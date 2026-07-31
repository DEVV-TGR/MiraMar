import "server-only";

import { unstable_cache } from "next/cache";
import * as z from "zod";
import type { Diarias } from "./diarias-tipos";

/**
 * Única porta de acesso ao armazenamento das diárias.
 *
 * Em produção (Vercel) o sistema de ficheiros é só-leitura, por isso as diárias
 * vivem num blob JSON. Em desenvolvimento não queremos obrigar ninguém a ter
 * conta ou token para mexer no site, por isso guarda-se num ficheiro local.
 * O driver é escolhido pela presença de `BLOB_READ_WRITE_TOKEN`.
 *
 * Trocar de fornecedor (Upstash, Supabase, ...) é mexer só neste ficheiro.
 */

export const TAG_DIARIAS = "diarias";

const CAMINHO_BLOB = "diarias.json";
const CAMINHO_LOCAL = ".data/diarias.json";

const textoLocalizado = z.object({
  pt: z.string(),
  en: z.string(),
  fr: z.string(),
  es: z.string(),
});

/**
 * Validação defensiva do que vem do armazenamento: um blob de uma versão
 * antiga ou editado à mão não pode deitar o site abaixo — vale mais cair para
 * a diária genérica do `menu.json`.
 */
const esquemaDiarias = z.object({
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  atualizadoEm: z.string(),
  pratos: z.array(
    z.object({
      nome: textoLocalizado,
      descricao: textoLocalizado.optional(),
      preco: z.string(),
    }),
  ),
});

function usaBlob(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

// ---------------------------------------------------------------- leitura

async function lerBruto(): Promise<string | null> {
  if (usaBlob()) {
    const { get } = await import("@vercel/blob");
    // `useCache: false` porque a cache que interessa é a do Next (ver `lerDiarias`);
    // a do CDN só atrasaria a atualização depois de gravar.
    const resultado = await get(CAMINHO_BLOB, { access: "private", useCache: false });
    if (!resultado?.stream) return null;
    return await new Response(resultado.stream).text();
  }

  const { readFile } = await import("node:fs/promises");
  try {
    return await readFile(CAMINHO_LOCAL, "utf8");
  } catch (erro) {
    if ((erro as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw erro;
  }
}

/** Leitura sem cache. Usar no /admin, que tem de ver sempre o estado real. */
export async function lerDiariasFrescas(): Promise<Diarias | null> {
  let bruto: string | null;
  try {
    bruto = await lerBruto();
  } catch (erro) {
    console.error("[diarias] falha ao ler o armazenamento:", erro);
    return null;
  }
  if (!bruto) return null;

  try {
    return esquemaDiarias.parse(JSON.parse(bruto));
  } catch (erro) {
    console.error("[diarias] conteúdo guardado inválido, ignorado:", erro);
    return null;
  }
}

/**
 * Leitura para as páginas públicas. Fica em cache até alguém gravar
 * (`revalidateTag(TAG_DIARIAS)`), com um teto de 5 minutos como rede de
 * segurança para a viragem do dia.
 */
export const lerDiarias = unstable_cache(lerDiariasFrescas, ["diarias"], {
  tags: [TAG_DIARIAS],
  revalidate: 300,
});

// ---------------------------------------------------------------- escrita

export async function guardarDiarias(diarias: Diarias): Promise<void> {
  const conteudo = JSON.stringify(diarias, null, 2);

  if (usaBlob()) {
    const { put } = await import("@vercel/blob");
    await put(CAMINHO_BLOB, conteudo, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }

  const { mkdir, writeFile } = await import("node:fs/promises");
  const { dirname } = await import("node:path");
  await mkdir(dirname(CAMINHO_LOCAL), { recursive: true });
  await writeFile(CAMINHO_LOCAL, conteudo, "utf8");
}

export async function apagarDiarias(): Promise<void> {
  if (usaBlob()) {
    const { del } = await import("@vercel/blob");
    await del(CAMINHO_BLOB);
    return;
  }

  const { rm } = await import("node:fs/promises");
  await rm(CAMINHO_LOCAL, { force: true });
}
