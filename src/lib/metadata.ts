import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { restaurante } from "@/data/restaurante";

/**
 * Metadados por rota — canónico, hreflang e Open Graph.
 *
 * ⚠️ **Qualquer página pública nova tem de passar por aqui**, tal como tem de
 * entrar na regex `ESTA_NUMA_EMENTA` do `TransicaoRota` e na lista do
 * `sitemap.ts`. Sem `alternates.languages` o Google trata `/fr/ementa` e
 * `/ementa` como páginas concorrentes em vez de traduções uma da outra, e pode
 * servir a versão portuguesa a um campista francês — que é precisamente o
 * público para quem as quatro línguas existem.
 *
 * O `openGraph` vai aqui inteiro de propósito: os metadados do Next são
 * fundidos **superficialmente**, por isso uma página que declare `openGraph`
 * apaga o do layout em vez de o completar.
 */

/**
 * O `og:locale` pede `idioma_TERRITÓRIO`, não o código de duas letras que o
 * routing usa. O inglês fica `en_GB` pela mesma razão que a bandeira do
 * seletor de idioma é a do Reino Unido: convenção europeia, e o público são os
 * campistas que ali estão.
 */
const OG_LOCALE: Record<string, string> = {
  pt: "pt_PT",
  en: "en_GB",
  fr: "fr_FR",
  es: "es_ES",
};

export const ogLocale = (locale: string) => OG_LOCALE[locale] ?? locale;

/** Caminho de uma rota num dado idioma, respeitando o `localePrefix: "as-needed"`. */
export function caminhoLocalizado(rota: string, locale: string): string {
  const prefixo = locale === routing.defaultLocale ? "" : `/${locale}`;
  const caminho = rota === "/" ? "" : rota;
  return `${prefixo}${caminho}` || "/";
}

export function metadataDeRota({
  rota,
  locale,
  titulo,
  descricao,
}: {
  rota: string;
  locale: string;
  /** Ausente na homepage, que usa o título por defeito do layout. */
  titulo?: string;
  descricao: string;
}): Metadata {
  const url = caminhoLocalizado(rota, locale);

  return {
    ...(titulo ? { title: titulo } : {}),
    description: descricao,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, caminhoLocalizado(rota, l)]),
        ),
        // para quem não corresponde a nenhuma das quatro línguas
        "x-default": caminhoLocalizado(rota, routing.defaultLocale),
      },
    },
    openGraph: {
      url,
      siteName: restaurante.nome,
      locale: ogLocale(locale),
      type: "website",
    },
  };
}
