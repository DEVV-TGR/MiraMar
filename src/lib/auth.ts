import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

/**
 * Autenticação da área /admin: uma só palavra-passe partilhada pela equipa.
 *
 * O risco real aqui é alguém escrever asneiras nas diárias, não roubo de dados
 * — não há dados pessoais nem pagamentos. Uma palavra-passe partilhada é o que
 * a equipa de um restaurante de bairro consegue mesmo usar todos os dias.
 * Se um dia isto crescer, o passo seguinte são contas individuais com hash.
 *
 * A sessão é um cookie assinado com HMAC-SHA256 (Web Crypto, sem dependências):
 * `<expiraEm>.<assinatura>`. Não guarda nada além da validade — não há o que
 * roubar do cookie, e alterar a validade invalida a assinatura.
 */

const NOME_COOKIE = "mm_sessao";
const DURACAO_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias

/** Trabalham a partir do telemóvel, na cozinha: pedir login todos os dias
    garantia que deixavam de usar isto. 30 dias com botão "Sair" é o
    compromisso certo para o risco em causa. */

function segredo(): string {
  const valor = process.env.ADMIN_SESSION_SECRET;
  if (!valor) {
    throw new Error(
      "ADMIN_SESSION_SECRET não está definida. Ver .env.example (gerar com `openssl rand -base64 32`).",
    );
  }
  return valor;
}

async function assinar(dados: string): Promise<string> {
  const chave = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(segredo()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const assinatura = await crypto.subtle.sign(
    "HMAC",
    chave,
    new TextEncoder().encode(dados),
  );
  return Buffer.from(assinatura).toString("base64url");
}

/** Comparação em tempo constante: não deixa medir a palavra-passe pelo tempo
    de resposta. Compara sempre o mesmo número de bytes. */
function iguaisEmTempoConstante(a: string, b: string): boolean {
  const bytesA = new TextEncoder().encode(a);
  const bytesB = new TextEncoder().encode(b);
  let diferenca = bytesA.length ^ bytesB.length;
  const maximo = Math.max(bytesA.length, bytesB.length);
  for (let i = 0; i < maximo; i++) {
    diferenca |= (bytesA[i] ?? 0) ^ (bytesB[i] ?? 0);
  }
  return diferenca === 0;
}

export function verificarPalavraPasse(tentativa: string): boolean {
  const esperada = process.env.ADMIN_PASSWORD;
  if (!esperada) {
    throw new Error("ADMIN_PASSWORD não está definida. Ver .env.example.");
  }
  return iguaisEmTempoConstante(tentativa, esperada);
}

export async function criarSessao(): Promise<void> {
  const expiraEm = Date.now() + DURACAO_MS;
  const valor = `${expiraEm}.${await assinar(String(expiraEm))}`;

  const cookieStore = await cookies();
  cookieStore.set(NOME_COOKIE, valor, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    expires: new Date(expiraEm),
  });
}

export async function apagarSessao(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete({ name: NOME_COOKIE, path: "/admin" });
}

/**
 * Memoizada por pedido com `cache()` do React: a página e a server action
 * podem chamá-la à vontade sem repetir o trabalho de criptografia.
 */
export const verificarSessao = cache(async (): Promise<boolean> => {
  const cookieStore = await cookies();
  const valor = cookieStore.get(NOME_COOKIE)?.value;
  if (!valor) return false;

  const separador = valor.lastIndexOf(".");
  if (separador <= 0) return false;

  const expiraEm = valor.slice(0, separador);
  const assinatura = valor.slice(separador + 1);

  const esperada = await assinar(expiraEm);
  if (!iguaisEmTempoConstante(assinatura, esperada)) return false;

  return Number(expiraEm) > Date.now();
});
