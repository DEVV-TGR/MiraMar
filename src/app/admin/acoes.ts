"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import * as z from "zod";
import {
  apagarSessao,
  criarSessao,
  verificarPalavraPasse,
  verificarSessao,
} from "@/lib/auth";
import {
  TAG_DIARIAS,
  apagarDiarias,
  guardarDiarias as gravarNoArmazenamento,
} from "@/lib/diarias-store";
import { hojeEmLisboa } from "@/lib/data-lisboa";
import { normalizarPreco } from "@/lib/preco";
import { traduzirPratos, type PratoParaTraduzir } from "@/lib/traduzir";
import type { Diarias } from "@/lib/diarias-tipos";
import type { EstadoFormulario, Linha } from "./tipos";

/**
 * Server actions do /admin.
 *
 * Todas verificam a sessão à cabeça: uma server action é um POST alcançável
 * diretamente, por isso a exclusão de /admin no `proxy.ts` não protege nada —
 * a verificação tem de estar aqui dentro.
 */

// ------------------------------------------------------------------ entrar

/** Atraso fixo em cada tentativa. Não substitui um verdadeiro limite de
    tentativas (em serverless não há estado partilhado fiável para contar),
    mas torna a força bruta lenta o suficiente para o risco em causa. */
const ATRASO_LOGIN_MS = 400;

export async function entrar(
  _estadoAnterior: { erro: string },
  formData: FormData,
): Promise<{ erro: string }> {
  const palavraPasse = String(formData.get("palavraPasse") ?? "");

  await new Promise((resolve) => setTimeout(resolve, ATRASO_LOGIN_MS));

  if (!palavraPasse || !verificarPalavraPasse(palavraPasse)) {
    return { erro: "Palavra-passe errada." };
  }

  await criarSessao();
  redirect("/admin");
}

export async function sair(): Promise<void> {
  await apagarSessao();
  redirect("/admin/entrar");
}

// ------------------------------------------------------------------ gravar

const esquemaLinha = z.object({
  id: z.string().min(1),
  nomePt: z.string(),
  descricaoPt: z.string(),
  preco: z.string(),
  traducoes: z
    .object({
      nome: z.object({ en: z.string(), fr: z.string(), es: z.string() }),
      descricao: z
        .object({ en: z.string(), fr: z.string(), es: z.string() })
        .nullable(),
    })
    .nullable(),
  traduzidoDe: z.object({ nome: z.string(), descricao: z.string() }).nullable(),
});

const esquemaSubmissao = z.object({
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida."),
  linhas: z.array(esquemaLinha),
});

function precisaTraduzir(linha: Linha, nomePt: string, descricaoPt: string): boolean {
  if (!linha.traducoes || !linha.traduzidoDe) return true;
  return (
    linha.traduzidoDe.nome !== nomePt || linha.traduzidoDe.descricao !== descricaoPt
  );
}

/**
 * Uma só action para gravar e para apagar, escolhida pelo botão que foi
 * carregado (`<button name="intencao">`). Assim o formulário tem um único
 * `useActionState` e uma única mensagem de estado — em vez de duas que se
 * atropelam.
 */
export async function gerirDiarias(
  estadoAnterior: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const submissao = estadoAnterior.submissao + 1;

  if (!(await verificarSessao())) {
    return { ok: false, mensagem: "A sessão expirou. Volta a entrar.", submissao };
  }

  if (formData.get("intencao") === "apagar") {
    return apagarTudo(submissao);
  }

  let bruto: unknown;
  try {
    bruto = JSON.parse(String(formData.get("dados") ?? "null"));
  } catch {
    bruto = null;
  }

  const analise = esquemaSubmissao.safeParse(bruto);
  if (!analise.success) {
    // O caso realista é o campo de data vazio; o resto só acontece se alguém
    // andar a mexer no formulário por fora.
    const semData = analise.error.issues.some((problema) =>
      problema.path.includes("data"),
    );
    return {
      ok: false,
      mensagem: semData
        ? "Escolhe o dia a que as diárias se referem."
        : "Os dados do formulário vieram mal. Recarrega a página e tenta outra vez.",
      submissao,
    };
  }

  const { data } = analise.data;
  // Linhas totalmente vazias são descartadas em silêncio: é o que acontece
  // quando se carrega em "Adicionar prato" e se muda de ideias.
  const linhas = analise.data.linhas.filter(
    (linha) => linha.nomePt.trim() || linha.preco.trim() || linha.descricaoPt.trim(),
  );

  if (linhas.length === 0) {
    return {
      ok: false,
      mensagem: "Escreve pelo menos um prato antes de gravar.",
      submissao,
    };
  }

  const errosPorLinha: Record<string, string> = {};
  for (const linha of linhas) {
    if (!linha.nomePt.trim()) errosPorLinha[linha.id] = "Falta o nome do prato.";
    else if (!linha.preco.trim()) errosPorLinha[linha.id] = "Falta o preço.";
  }
  if (Object.keys(errosPorLinha).length > 0) {
    return {
      ok: false,
      mensagem: "Há campos por preencher.",
      errosPorLinha,
      submissao,
    };
  }

  // Só vão à tradução os pratos novos ou cujo português mudou. Assim as
  // correções manuais às traduções sobrevivem às gravações seguintes.
  const normalizadas = linhas.map((linha) => ({
    ...linha,
    nomePt: linha.nomePt.trim(),
    descricaoPt: linha.descricaoPt.trim(),
    preco: normalizarPreco(linha.preco),
  }));

  const porTraduzir: { indice: number; prato: PratoParaTraduzir }[] = [];
  normalizadas.forEach((linha, indice) => {
    if (precisaTraduzir(linha, linha.nomePt, linha.descricaoPt)) {
      porTraduzir.push({
        indice,
        prato: {
          nomePt: linha.nomePt,
          descricaoPt: linha.descricaoPt || undefined,
        },
      });
    }
  });

  const resultado = await traduzirPratos(porTraduzir.map((entrada) => entrada.prato));

  const linhasFinais: Linha[] = [...normalizadas];
  porTraduzir.forEach((entrada, i) => {
    const traduzido = resultado.pratos[i];
    linhasFinais[entrada.indice] = {
      ...normalizadas[entrada.indice],
      traducoes: {
        nome: {
          en: traduzido.nome.en,
          fr: traduzido.nome.fr,
          es: traduzido.nome.es,
        },
        descricao: traduzido.descricao
          ? {
              en: traduzido.descricao.en,
              fr: traduzido.descricao.fr,
              es: traduzido.descricao.es,
            }
          : null,
      },
      // Se a tradução falhou não marcamos de onde veio: assim a próxima
      // gravação volta a tentar, em vez de fixar o português para sempre.
      traduzidoDe: resultado.ok
        ? {
            nome: normalizadas[entrada.indice].nomePt,
            descricao: normalizadas[entrada.indice].descricaoPt,
          }
        : null,
    };
  });

  const diarias: Diarias = {
    data,
    atualizadoEm: new Date().toISOString(),
    pratos: linhasFinais.map((linha) => ({
      nome: {
        pt: linha.nomePt,
        en: linha.traducoes?.nome.en || linha.nomePt,
        fr: linha.traducoes?.nome.fr || linha.nomePt,
        es: linha.traducoes?.nome.es || linha.nomePt,
      },
      descricao: linha.descricaoPt
        ? {
            pt: linha.descricaoPt,
            en: linha.traducoes?.descricao?.en || linha.descricaoPt,
            fr: linha.traducoes?.descricao?.fr || linha.descricaoPt,
            es: linha.traducoes?.descricao?.es || linha.descricaoPt,
          }
        : undefined,
      preco: linha.preco,
    })),
  };

  try {
    await gravarNoArmazenamento(diarias);
  } catch (erro) {
    console.error("[admin] falha ao gravar as diárias:", erro);
    return {
      ok: false,
      mensagem: "Não foi possível gravar. Tenta outra vez daqui a pouco.",
      submissao,
    };
  }

  updateTag(TAG_DIARIAS);

  const paraHoje = data === hojeEmLisboa();
  return {
    ok: true,
    mensagem: paraHoje
      ? "Diárias gravadas. Já estão no site."
      : "Diárias gravadas. Aparecem no site no dia a que se referem.",
    aviso: resultado.ok
      ? undefined
      // "Alguns" e não "os pratos": os que estão no dicionário de pratos
      // portugueses saem traduzidos mesmo sem a API.
      : `${resultado.motivo} Alguns pratos ficaram em português nas outras línguas — podes escrever as traduções à mão em baixo.`,
    linhas: linhasFinais,
    submissao,
  };
}

// ------------------------------------------------------------------ apagar

async function apagarTudo(submissao: number): Promise<EstadoFormulario> {
  try {
    await apagarDiarias();
  } catch (erro) {
    console.error("[admin] falha ao apagar as diárias:", erro);
    return { ok: false, mensagem: "Não foi possível apagar.", submissao };
  }

  updateTag(TAG_DIARIAS);

  return {
    ok: true,
    mensagem: "Diárias apagadas. O site volta a dizer para perguntar ao empregado.",
    linhas: [],
    submissao,
  };
}
