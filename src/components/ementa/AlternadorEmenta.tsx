"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

/**
 * A carta do restaurante e o take away são duas coisas diferentes — por isso
 * vivem em páginas próprias, e não misturadas numa lista só. Este alternador
 * está no layout partilhado pelas duas para que passar de uma à outra não
 * custe nada: a pastilha escura desliza de um lado ao outro (`layoutId`) em
 * vez de a página inteira piscar.
 *
 * São links a sério (navegação entre páginas), não separadores de conteúdo:
 * daí `nav` + `aria-current="page"` em vez de `role="tablist"`.
 */
const ABAS = [
  { href: "/ementa", chave: "restaurante" },
  { href: "/take-away", chave: "takeAway" },
] as const;

export function AlternadorEmenta() {
  const t = useTranslations("ementa.abas");
  const caminho = usePathname();
  const reduzido = useReducedMotion();

  return (
    <nav aria-label={t("etiqueta")} className="flex justify-center">
      <div className="inline-flex gap-1 rounded-full border border-line bg-surface p-1">
        {ABAS.map(({ href, chave }) => {
          const ativa = caminho === href;

          return (
            <Link
              key={href}
              href={href}
              aria-current={ativa ? "page" : undefined}
              className="relative rounded-full px-5 py-2 text-sm tracking-wide"
            >
              {ativa &&
                (reduzido ? (
                  <span aria-hidden className="absolute inset-0 rounded-full bg-sea-deep" />
                ) : (
                  <motion.span
                    aria-hidden
                    layoutId="ementa-aba-ativa"
                    className="absolute inset-0 rounded-full bg-sea-deep"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                ))}
              <span
                className={`relative transition-colors duration-200 ${
                  ativa ? "font-medium text-background" : "text-muted hover:text-ink"
                }`}
              >
                {t(chave)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
