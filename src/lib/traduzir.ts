import "server-only";

import * as z from "zod";
import type { TextoLocalizado } from "./menu-types";
import { procurarNoDicionario } from "./dicionario-pratos";

/**
 * Traduz as diárias de português para EN/FR/ES ao gravar no /admin.
 *
 * Duas fontes, por esta ordem:
 *  1. `dicionario-pratos.ts` — nomes de pratos portugueses curados à mão. É
 *     onde qualquer tradutor automático falha, e numa ementa o nome do prato
 *     é o conteúdo.
 *  2. DeepL, para tudo o resto (nomes fora do dicionário e as descrições, que
 *     são texto corrido — onde ele é bom).
 *
 * Porquê DeepL e não um modelo de linguagem: o restaurante não pode ficar com
 * despesa recorrente. O plano gratuito do DeepL **bloqueia com erro quando a
 * quota acaba, não passa a cobrar** — é essa garantia que interessa, mais do
 * que ser barato. Ao volume deste site (3 pratos × 3 línguas, uma ou duas
 * vezes por dia) fica-se muito abaixo da quota.
 *
 * Nunca lança: se a API falhar, faltar a chave, ou a resposta vier mal, cai
 * para português nas quatro línguas e devolve `ok: false`. O funcionário nunca
 * fica sem gravar por causa de um serviço externo.
 */

export type PratoParaTraduzir = {
  nomePt: string;
  descricaoPt?: string;
};

export type PratoTraduzido = {
  nome: TextoLocalizado;
  descricao?: TextoLocalizado;
};

export type ResultadoTraducao =
  | { ok: true; pratos: PratoTraduzido[] }
  | { ok: false; motivo: string; pratos: PratoTraduzido[] };

/** Inglês britânico: o site usa a bandeira do Reino Unido (ver `Bandeira.tsx`). */
const DESTINOS = [
  { chave: "en", deepl: "EN-GB" },
  { chave: "fr", deepl: "FR" },
  { chave: "es", deepl: "ES" },
] as const;

type Idioma = (typeof DESTINOS)[number]["chave"];

const esquemaResposta = z.object({
  translations: z.array(z.object({ text: z.string() })),
});

function mesmoTextoEmTodas(pt: string): TextoLocalizado {
  return { pt, en: pt, fr: pt, es: pt };
}

/**
 * O melhor que se consegue sem a API: os nomes que estão no dicionário saem
 * traduzidos à mesma (não precisam de rede), o resto fica em português. Com o
 * DeepL em baixo, um "arroz de cabidela" continua a aparecer bem ao turista.
 */
function semApi(
  pratos: PratoParaTraduzir[],
  doDicionario: (Omit<TextoLocalizado, "pt"> | null)[],
): PratoTraduzido[] {
  return pratos.map((prato, indice) => {
    const curado = doDicionario[indice];
    return {
      nome: curado ? { pt: prato.nomePt, ...curado } : mesmoTextoEmTodas(prato.nomePt),
      descricao: prato.descricaoPt ? mesmoTextoEmTodas(prato.descricaoPt) : undefined,
    };
  });
}

class ErroDeepL extends Error {
  readonly motivo: string;

  constructor(motivo: string) {
    super(motivo);
    this.motivo = motivo;
  }
}

/**
 * As chaves gratuitas do DeepL terminam em `:fx` e falam com outro endereço.
 * Detetar pelo sufixo evita um 403 sem explicação se um dia se mudar de plano.
 */
function endpoint(chave: string): string {
  return chave.trim().endsWith(":fx")
    ? "https://api-free.deepl.com/v2/translate"
    : "https://api.deepl.com/v2/translate";
}

/** Traduz um lote de textos para um idioma. Uma chamada, não uma por texto. */
async function traduzirLote(
  chave: string,
  textos: string[],
  destino: string,
): Promise<string[]> {
  if (textos.length === 0) return [];

  let resposta: Response;
  try {
    resposta = await fetch(endpoint(chave), {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${chave}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: textos,
        source_lang: "PT",
        target_lang: destino,
        // Dá contexto sem o traduzir; se o plano não o suportar, é ignorado.
        context: "Ementa de um restaurante português simples.",
      }),
      signal: AbortSignal.timeout(15_000),
    });
  } catch (erro) {
    if (erro instanceof Error && erro.name === "TimeoutError") {
      throw new ErroDeepL("O serviço de tradução demorou demasiado a responder.");
    }
    throw new ErroDeepL("Não foi possível contactar o serviço de tradução.");
  }

  if (!resposta.ok) {
    // 456 é o código próprio do DeepL para quota esgotada. Vale a pena
    // distingui-lo: diz ao funcionário exatamente o que se passa, em vez de
    // um erro genérico que não ajuda ninguém.
    if (resposta.status === 456) {
      throw new ErroDeepL("A quota mensal de tradução acabou.");
    }
    if (resposta.status === 401 || resposta.status === 403) {
      throw new ErroDeepL("A chave do serviço de tradução foi recusada.");
    }
    if (resposta.status === 429) {
      throw new ErroDeepL("O serviço de tradução está com demasiados pedidos.");
    }
    throw new ErroDeepL("O serviço de tradução respondeu com um erro.");
  }

  const analise = esquemaResposta.safeParse(await resposta.json().catch(() => null));
  if (!analise.success) {
    throw new ErroDeepL("O serviço de tradução devolveu uma resposta inesperada.");
  }

  // Se o número de traduções não bater certo com o de textos enviados, não dá
  // para saber qual pertence a qual prato — vale mais falhar do que atribuir
  // ao bacalhau a tradução da sobremesa.
  if (analise.data.translations.length !== textos.length) {
    throw new ErroDeepL("O serviço de tradução devolveu uma resposta incompleta.");
  }

  return analise.data.translations.map((traducao) => traducao.text);
}

export async function traduzirPratos(
  pratos: PratoParaTraduzir[],
): Promise<ResultadoTraducao> {
  if (pratos.length === 0) return { ok: true, pratos: [] };

  // O dicionário resolve os nomes curados sem sair daqui. Só o que sobra é que
  // vai à API — muitas vezes não sobra nada e não se gasta quota nenhuma.
  const doDicionario = pratos.map((prato) => procurarNoDicionario(prato.nomePt));
  const alternativa = semApi(pratos, doDicionario);

  const porTraduzir: { prato: number; campo: "nome" | "descricao"; texto: string }[] = [];
  pratos.forEach((prato, indice) => {
    if (!doDicionario[indice]) {
      porTraduzir.push({ prato: indice, campo: "nome", texto: prato.nomePt });
    }
    if (prato.descricaoPt) {
      porTraduzir.push({ prato: indice, campo: "descricao", texto: prato.descricaoPt });
    }
  });

  // Tudo veio do dicionário e nenhum prato tem descrição: não há chamada à API
  // nem gasto de quota. É o caso comum num restaurante que repete pratos.
  if (porTraduzir.length === 0) return { ok: true, pratos: alternativa };

  const chave = process.env.DEEPL_API_KEY?.trim();
  if (!chave) {
    return {
      ok: false,
      motivo: "Falta a chave da API de tradução (DEEPL_API_KEY).",
      pratos: alternativa,
    };
  }

  try {
    const textos = porTraduzir.map((entrada) => entrada.texto);

    // O DeepL só aceita um idioma de destino por pedido: três chamadas por
    // gravação, não três por prato.
    const lotes = await Promise.all(
      DESTINOS.map(async (destino) => ({
        idioma: destino.chave,
        textos: await traduzirLote(chave, textos, destino.deepl),
      })),
    );

    const traduzido = new Map<string, Record<Idioma, string>>();
    porTraduzir.forEach((entrada, i) => {
      const porIdioma = {} as Record<Idioma, string>;
      for (const lote of lotes) porIdioma[lote.idioma] = lote.textos[i];
      traduzido.set(`${entrada.prato}:${entrada.campo}`, porIdioma);
    });

    return {
      ok: true,
      pratos: pratos.map((prato, indice) => {
        const curado = doDicionario[indice];
        const nomeApi = traduzido.get(`${indice}:nome`);
        const descricaoApi = traduzido.get(`${indice}:descricao`);

        return {
          nome: {
            pt: prato.nomePt,
            ...(curado ?? {
              en: nomeApi?.en || prato.nomePt,
              fr: nomeApi?.fr || prato.nomePt,
              es: nomeApi?.es || prato.nomePt,
            }),
          },
          descricao: prato.descricaoPt
            ? {
                pt: prato.descricaoPt,
                en: descricaoApi?.en || prato.descricaoPt,
                fr: descricaoApi?.fr || prato.descricaoPt,
                es: descricaoApi?.es || prato.descricaoPt,
              }
            : undefined,
        };
      }),
    };
  } catch (erro) {
    console.error("[traduzir] falha ao traduzir as diárias:", erro);
    return {
      ok: false,
      motivo:
        erro instanceof ErroDeepL
          ? erro.motivo
          : "Não foi possível contactar o serviço de tradução.",
      pratos: alternativa,
    };
  }
}
