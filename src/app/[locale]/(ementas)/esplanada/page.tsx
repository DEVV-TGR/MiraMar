import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import { BotaoLink } from "@/components/ui/Botao";
import { ListaEmenta } from "@/components/ementa/ListaEmenta";
import { obterEsplanada } from "@/lib/menu";
import type { Menu } from "@/lib/menu-types";

/* Sem `revalidate`: a esplanada é estática (`src/data/esplanada.json`), como o
   take away.
   O título e as tabs estão no layout partilhado com as outras ementas — ver
   `src/app/[locale]/(ementas)/layout.tsx`. */

export default async function EsplanadaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <EsplanadaConteudo menu={obterEsplanada()} />;
}

function EsplanadaConteudo({ menu }: { menu: Menu }) {
  const t = useTranslations("ementa");

  return (
    <>
      <ListaEmenta menu={menu} />

      {/* só "voltar": aqui pede-se ao balcão, e um botão de telefone como o do
          take away contradizia a própria página */}
      <Reveal delay={0.1} className="mt-14 flex justify-center">
        <BotaoLink href="/" variante="mar">
          {t("voltar")}
        </BotaoLink>
      </Reveal>
    </>
  );
}
