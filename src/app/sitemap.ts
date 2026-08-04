import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { caminhoLocalizado } from "@/lib/metadata";
import { ROTAS_PUBLICAS, URL_SITE } from "@/lib/site";

/**
 * `/sitemap.xml` — as quatro rotas públicas × as quatro línguas, cada uma a
 * declarar as outras três como traduções (`alternates.languages`, que o Next
 * escreve como `xhtml:link`). É o par do `hreflang` das páginas: sem isto o
 * Google descobria as traduções por acaso, ou não descobria.
 *
 * ⚠️ Vive fora de `[locale]` de propósito — o sitemap é um só para o site
 * inteiro, não um por idioma. Ao acrescentar uma rota pública nova, entra em
 * `ROTAS_PUBLICAS` (`src/lib/site.ts`) e aparece aqui sozinha.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (rota: string, locale: string) => `${URL_SITE}${caminhoLocalizado(rota, locale)}`;

  return ROTAS_PUBLICAS.flatMap((rota) =>
    routing.locales.map((locale) => ({
      url: url(rota, locale),
      lastModified: new Date(),
      // a homepage é a porta de entrada; as ementas valem tanto ou mais,
      // porque é para elas que o QR code das mesas aponta
      priority: rota === "/" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((outro) => [outro, url(rota, outro)]),
        ),
      },
    })),
  );
}
