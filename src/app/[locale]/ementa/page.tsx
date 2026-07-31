import { useLocale, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import { BotaoLink, BotaoAncora } from "@/components/ui/Botao";
import { restaurante } from "@/data/restaurante";
import { obterMenu } from "@/lib/menu";
import type { Menu } from "@/lib/menu-types";

/* Ver a nota em `src/app/[locale]/page.tsx`: a diária vem do /admin e muda
   todos os dias, por isso a página revalida em vez de ser fixa no build. */
export const revalidate = 300;

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
  const locale = useLocale() as keyof Menu["nota"];

  return (
    <section className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <Reveal className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gold-deep">{t("eyebrow")}</p>
        <h1 className="h-section mt-3 font-display text-ink">{t("titulo")}</h1>
      </Reveal>

      {menu.placeholder && (
        <Reveal delay={0.05} className="mt-6 rounded-lg border border-gold-deep/30 bg-gold/10 px-4 py-2 text-center text-sm text-gold-deep">
          {t("rascunhoAviso")}
        </Reveal>
      )}

      <div className="mt-12 space-y-12">
        {menu.categorias.map((categoria, i) => (
          <Reveal key={categoria.nome.pt} delay={i * 0.04}>
            <h2 className="font-display text-xl uppercase tracking-wide text-sea-deep">
              {categoria.nome[locale]}
            </h2>
            {categoria.descricao && (
              <p className="mt-1 text-sm italic text-muted">{categoria.descricao[locale]}</p>
            )}
            <ul className="mt-4 divide-y divide-line">
              {/* chave pelo índice: os pratos da diária vêm do /admin e podem
                  repetir o nome */}
              {categoria.pratos.map((prato, j) => (
                <li key={j} className="flex items-start justify-between gap-4 py-3">
                  <div>
                    <p className="font-medium text-ink">{prato.nome[locale]}</p>
                    {prato.descricao && (
                      <p className="mt-0.5 text-sm text-muted">{prato.descricao[locale]}</p>
                    )}
                  </div>
                  <p className="whitespace-nowrap font-medium text-gold-deep">{prato.preco}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1} className="mt-14 flex flex-wrap items-center justify-center gap-4">
        <BotaoAncora href={restaurante.menuPdfUrl} target="_blank" rel="noreferrer" variante="contorno">
          {t("descarregarPdf")}
        </BotaoAncora>
        <BotaoLink href="/" variante="mar">
          {t("voltar")}
        </BotaoLink>
      </Reveal>
    </section>
  );
}
