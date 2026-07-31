import { useLocale, useTranslations } from "next-intl";
import { EntradaEmenta } from "@/components/ementa/EntradaEmenta";
import type { CategoriaMenu, Menu } from "@/lib/menu-types";

/**
 * Renderiza uma ementa completa. Serve as duas: a carta do restaurante
 * (`/ementa`, menus de preço fixo) e o take away (`/take-away`, preço por
 * prato, muitos deles com dose e meia dose).
 *
 * Síncrono de propósito, para poder usar `useTranslations()` — a página que o
 * monta é que é `async`.
 */
export function ListaEmenta({ menu }: { menu: Menu }) {
  const t = useTranslations("ementa");
  const locale = useLocale() as keyof Menu["nota"];

  return (
    <EntradaEmenta>
      {menu.placeholder && (
        <div className="mt-6 rounded-lg border border-gold-deep/30 bg-gold/10 px-4 py-2 text-center text-sm text-gold-deep">
          {t("rascunhoAviso")}
        </div>
      )}

      {menu.incluido && (
        <p className="mx-auto mt-8 max-w-2xl text-balance text-center text-sm leading-relaxed text-muted">
          {menu.incluido[locale]}
        </p>
      )}

      <div className="mt-12 space-y-12">
        {menu.categorias.map((categoria, i) => (
          /* chave pelo índice: os nomes das categorias são livres e nada
             impede que um dia se repitam */
          <div key={i}>
            <Categoria categoria={categoria} locale={locale} />
          </div>
        ))}
      </div>
    </EntradaEmenta>
  );
}

function Categoria({
  categoria,
  locale,
}: {
  categoria: CategoriaMenu;
  locale: keyof Menu["nota"];
}) {
  const t = useTranslations("ementa");

  /* Se algum prato da categoria tiver dose e meia dose, a categoria inteira
     ganha duas colunas de preço — assim os valores alinham de linha para
     linha. Os pratos de preço único ocupam a largura das duas. */
  const temDose = categoria.pratos.some((prato) => prato.precoDose);

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-display text-xl uppercase tracking-wide text-sea-deep">
          {categoria.nome[locale]}
        </h2>
        {categoria.preco && (
          <p className="font-display text-xl text-gold-deep">{categoria.preco}</p>
        )}
      </div>
      {categoria.descricao && (
        <p className="mt-1 text-sm italic text-muted">{categoria.descricao[locale]}</p>
      )}

      {temDose && (
        <div
          aria-hidden
          className="mt-4 flex justify-end gap-3 text-[0.65rem] uppercase tracking-[0.12em] text-muted"
        >
          <span className="w-16 text-right">{t("dose")}</span>
          <span className="w-16 text-right">{t("meiaDose")}</span>
        </div>
      )}

      <ul className={`divide-y divide-line ${temDose ? "mt-1" : "mt-4"}`}>
        {/* chave pelo índice: os pratos da diária vêm do /admin e podem
            repetir o nome */}
        {categoria.pratos.map((prato, j) => (
          <li key={j} className="flex items-start justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="font-medium text-ink">{prato.nome[locale]}</p>
              {prato.descricao && (
                <p className="mt-0.5 text-sm text-muted">{prato.descricao[locale]}</p>
              )}
            </div>

            {prato.precoDose ? (
              <div className="flex shrink-0 gap-3 font-medium text-gold-deep">
                <span className="w-16 whitespace-nowrap text-right">
                  <span className="sr-only">{t("dose")}: </span>
                  {prato.precoDose}
                </span>
                <span className="w-16 whitespace-nowrap text-right">
                  <span className="sr-only">{t("meiaDose")}: </span>
                  {prato.preco}
                </span>
              </div>
            ) : (
              prato.preco && (
                <p
                  className={`shrink-0 whitespace-nowrap text-right font-medium text-gold-deep ${
                    temDose ? "w-[8.75rem]" : ""
                  }`}
                >
                  {prato.preco}
                </p>
              )
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
