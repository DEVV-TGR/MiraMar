"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Bandeira } from "@/components/ui/Bandeira";

/**
 * Ícone flutuante no canto inferior com a bandeira do idioma ativo.
 * Ao clicar abre para cima a lista dos outros idiomas, só com bandeiras.
 * A bandeira sozinha não diz o idioma a quem usa leitor de ecrã, por isso
 * cada controlo leva o nome do idioma em `aria-label`/texto invisível.
 */
export function SeletorIdioma() {
  const t = useTranslations("idiomas");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;

    const aoClicarFora = (evento: MouseEvent) => {
      if (!caixa.current?.contains(evento.target as Node)) setAberto(false);
    };
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setAberto(false);
    };

    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  const outros = routing.locales.filter((l) => l !== locale);

  return (
    // só no telemóvel — no desktop o seletor vive no header, para não repetir
    <div ref={caixa} className="fixed bottom-6 right-6 z-40 md:hidden">
      {aberto && (
        <ul className="mb-2 flex flex-col gap-1.5 rounded-2xl border border-line bg-background/95 p-2 shadow-lg backdrop-blur-sm">
          {outros.map((loc) => (
            <li key={loc}>
              <Link
                href={pathname}
                locale={loc}
                onClick={() => setAberto(false)}
                aria-label={t(loc)}
                className="block rounded-full p-1 transition-transform hover:scale-110"
              >
                <Bandeira locale={loc} className="h-5 w-[30px] ring-1 ring-ink/10" />
                <span className="sr-only">{t(loc)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        aria-label={t(locale)}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-background/95 shadow-lg backdrop-blur-sm transition-transform hover:scale-105 cursor-pointer"
      >
        <Bandeira locale={locale} className="h-5 w-[30px] ring-1 ring-ink/10" />
        <span className="sr-only">{t(locale)}</span>
      </button>
    </div>
  );
}
