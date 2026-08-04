import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import { BotaoLink, BotaoAncora } from "@/components/ui/Botao";
import { ListaEmenta } from "@/components/ementa/ListaEmenta";
import { restaurante } from "@/data/restaurante";
import { obterTakeAway } from "@/lib/menu";
import { metadataDeRota } from "@/lib/metadata";
import type { Menu } from "@/lib/menu-types";

/* Sem `revalidate`: o take away é estático (`src/data/takeaway.json`), não
   tem diária nem passa pelo /admin.
   O título e as tabs estão no layout partilhado com a /ementa — ver
   `src/app/[locale]/(ementas)/layout.tsx`. */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return metadataDeRota({
    rota: "/take-away",
    locale,
    titulo: t("takeaway.eyebrow"),
    descricao: t("metadata.descricaoTakeAway"),
  });
}

export default async function TakeAwayPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TakeAwayConteudo menu={obterTakeAway()} />;
}

function TakeAwayConteudo({ menu }: { menu: Menu }) {
  const t = useTranslations("takeaway");
  const tEmenta = useTranslations("ementa");

  return (
    <>
      <ListaEmenta menu={menu} />

      {/* quem está a ver o take away quer encomendar — o telefone é o passo
          seguinte, e não vale a pena obrigar a voltar à homepage */}
      <Reveal delay={0.1} className="mt-14 flex flex-wrap items-center justify-center gap-4">
        <BotaoAncora href={`tel:${restaurante.telefone.replace(/\s/g, "")}`} variante="dourado">
          {t("encomendar", { telefone: restaurante.telefone })}
        </BotaoAncora>
        <BotaoLink href="/" variante="mar">
          {tEmenta("voltar")}
        </BotaoLink>
      </Reveal>
    </>
  );
}
