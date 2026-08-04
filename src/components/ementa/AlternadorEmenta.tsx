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
  { href: "/esplanada", chave: "esplanada" },
] as const;

export function AlternadorEmenta() {
  const t = useTranslations("ementa.abas");
  const caminho = usePathname();
  const reduzido = useReducedMotion();

  return (
    <nav aria-label={t("etiqueta")} className="flex justify-center">
      {/* com três abas, "Carta Restaurante" já não cabe a `px-5` num telemóvel
          estreito: aperta-se abaixo do `sm` e deixa-se quebrar em duas linhas
          como rede de segurança */}
      <div className="inline-flex flex-wrap justify-center gap-1 rounded-3xl border border-line bg-surface p-1 sm:rounded-full">
        {ABAS.map(({ href, chave }) => {
          const ativa = caminho === href;

          return (
            <Link
              key={href}
              href={href}
              aria-current={ativa ? "page" : undefined}
              className="relative rounded-full px-3.5 py-1.5 text-[0.8125rem] tracking-wide sm:px-5 sm:py-2 sm:text-sm"
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
