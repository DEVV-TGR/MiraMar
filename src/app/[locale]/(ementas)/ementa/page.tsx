import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import { BotaoLink, BotaoAncora } from "@/components/ui/Botao";
import { ListaEmenta } from "@/components/ementa/ListaEmenta";
import { restaurante } from "@/data/restaurante";
import { obterMenu } from "@/lib/menu";
import type { Menu } from "@/lib/menu-types";

/* Ver a nota em `src/app/[locale]/page.tsx`: o Menu 1 vem do /admin e muda
   todos os dias, por isso a página revalida em vez de ser fixa no build. */
export const revalidate = 300;

/* O título e as tabs estão no layout partilhado com o /take-away — ver
   `src/app/[locale]/(ementas)/layout.tsx`. */
export default async function EmentaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const menu = await obterMenu();

  return <EmentaConteudo menu={menu} />;
}

function EmentaConteudo({ menu }: { menu: Menu }) {
  const t = useTranslations("ementa");

  return (
    <>
      <ListaEmenta menu={menu} />

      <Reveal delay={0.1} className="mt-14 flex flex-wrap items-center justify-center gap-4">
        <BotaoAncora href={restaurante.menuPdfUrl} target="_blank" rel="noreferrer" variante="contorno">
          {t("descarregarPdf")}
        </BotaoAncora>
        <BotaoLink href="/" variante="mar">
          {t("voltar")}
        </BotaoLink>
      </Reveal>
    </>
  );
}
