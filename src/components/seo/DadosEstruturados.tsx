import { getTranslations } from "next-intl/server";
import { restaurante } from "@/data/restaurante";
import { caminhoLocalizado } from "@/lib/metadata";
import { URL_SITE } from "@/lib/site";

/**
 * Dados estruturados schema.org (`Restaurant`), na homepage.
 *
 * É o que permite ao Google mostrar horário, telefone, morada e ementa
 * diretamente nos resultados de pesquisa e na ficha do mapa, em vez de só um
 * link azul. Para um restaurante de bairro é o item de SEO com mais retorno:
 * quase ninguém procura "Mira Mar", procura-se "restaurante em Angeiras".
 *
 * Não há conteúdo novo aqui — tudo sai de `restaurante.json`, a mesma fonte
 * que alimenta o header, o rodapé e as secções da homepage. Se a morada ou o
 * horário mudarem, mudam num sítio só.
 */

/** Do formato de escrita ("22 928 6518") para o E.164 que o schema quer. */
function telefoneInternacional(telefone: string) {
  return `+351${telefone.replace(/\D/g, "")}`;
}

/**
 * O horário existe em `restaurante.json` como texto de apresentação
 * ("08:00 – 23:00"); aqui é preciso em números. Extrai-se em vez de se repetir
 * noutro campo — dois sítios com o mesmo horário acabam sempre por divergir, e
 * um horário errado no Google é pior do que nenhum.
 */
function horasDeAbertura(horas: string) {
  const [abre, fecha] = horas.match(/\d{1,2}:\d{2}/g) ?? [];
  return abre && fecha ? { abre, fecha } : null;
}

export async function DadosEstruturados({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "metadata" });
  /* Sem a barra final, para bater certo com o `<link rel="canonical">` — duas
     formas do mesmo endereço são duas páginas aos olhos de um validador. */
  const absoluta = (rota: string) =>
    `${URL_SITE}${caminhoLocalizado(rota, locale)}`.replace(/\/$/, "");
  const horario = horasDeAbertura(restaurante.horarios[0].horas);

  const dados = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${URL_SITE}/#restaurante`,
    name: restaurante.nome,
    description: t("description"),
    url: absoluta("/"),
    image: [`${URL_SITE}/opengraph-image`],
    telephone: telefoneInternacional(restaurante.telefone),
    priceRange: "€", // barato, e é para isso que o campo serve
    servesCuisine: t("cozinha"),
    currenciesAccepted: "EUR",
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurante.morada,
      postalCode: "4455-039",
      addressLocality: "Lavra",
      addressRegion: "Matosinhos",
      addressCountry: "PT",
    },
    /* O restaurante fica *dentro* do parque de campismo — não ao lado. É o
       argumento comercial do negócio e o schema tem campo próprio para isso. */
    containedInPlace: {
      "@type": "Campground",
      name: "Parque de Campismo Orbitur Angeiras",
    },
    ...(horario
      ? {
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
              opens: horario.abre,
              closes: horario.fecha,
            },
          ],
        }
      : {}),
    hasMenu: [absoluta("/ementa"), absoluta("/take-away"), absoluta("/esplanada")],
    hasMap: restaurante.mapsUrl,
    sameAs: [restaurante.instagram],
  };

  return (
    <script
      type="application/ld+json"
      // o conteúdo é nosso e não vem de input nenhum; o `<` escapado evita
      // que uma aspa num campo feche o <script> mais cedo
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados).replace(/</g, "\\u003c") }}
    />
  );
}
