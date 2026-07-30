"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { restaurante } from "@/data/restaurante";

export function Header() {
  const t = useTranslations("nav");
  const tIdiomas = useTranslations("idiomas");
  const locale = useLocale();
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const [idiomaAberto, setIdiomaAberto] = useState(false);

  const ligacoes = [
    { hash: "sobre", rotulo: t("sobre") },
    { hash: "galeria", rotulo: t("fotos") },
    { hash: "localizacao", rotulo: t("localizacao") },
    { hash: "contactos", rotulo: t("contactos") },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label={restaurante.nome}>
          {/* logo é o lockup completo (emblema + texto); recortado ao emblema
              até termos uma versão só-ícone exportada à parte */}
          <Image
            src="/logo/mira-mar-logo.jpg"
            alt={restaurante.nome}
            width={200}
            height={200}
            priority
            className="h-11 w-11 rounded-full object-cover object-[50%_18%]"
          />
          <span className="font-display text-lg text-ink">{restaurante.nome}</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
          {ligacoes.map((l) => (
            <Link
              key={l.hash}
              href={{ pathname: "/", hash: l.hash }}
              className="text-sm tracking-wide text-muted transition-colors hover:text-ink"
            >
              {l.rotulo}
            </Link>
          ))}
          <Link
            href="/ementa"
            className="border border-gold-deep/50 px-4 py-2 text-sm tracking-wide text-sea-deep transition-colors hover:border-gold hover:bg-gold/10"
          >
            {t("verEmenta")}
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIdiomaAberto((a) => !a)}
              aria-expanded={idiomaAberto}
              aria-label="Idioma"
              className="text-sm uppercase tracking-wide text-muted transition-colors hover:text-ink"
            >
              {locale}
            </button>
            {idiomaAberto && (
              <ul className="absolute right-0 top-full mt-2 min-w-32 border border-line bg-background py-1 shadow-lg">
                {routing.locales.map((loc) => (
                  <li key={loc}>
                    <Link
                      href={pathname}
                      locale={loc}
                      onClick={() => setIdiomaAberto(false)}
                      className={`block px-4 py-2 text-sm transition-colors hover:bg-surface ${
                        loc === locale ? "text-gold-deep" : "text-ink"
                      }`}
                    >
                      {tIdiomas(loc)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        <button
          type="button"
          onClick={() => setAberto((a) => !a)}
          aria-expanded={aberto}
          aria-label={aberto ? t("fecharMenu") : t("abrirMenu")}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-px w-6 bg-ink transition-transform ${aberto ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-6 bg-ink transition-transform ${aberto ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {aberto && (
        <nav
          className="border-t border-line/70 bg-background px-6 py-6 md:hidden"
          aria-label="Menu móvel"
        >
          <ul className="flex flex-col gap-5">
            {ligacoes.map((l) => (
              <li key={l.hash}>
                <Link
                  href={{ pathname: "/", hash: l.hash }}
                  onClick={() => setAberto(false)}
                  className="font-display text-xl text-ink"
                >
                  {l.rotulo}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/ementa" onClick={() => setAberto(false)} className="text-sm text-gold-deep">
                {t("verEmenta")} ↗
              </Link>
            </li>
            <li className="flex gap-3 pt-2">
              {routing.locales.map((loc) => (
                <Link
                  key={loc}
                  href={pathname}
                  locale={loc}
                  onClick={() => setAberto(false)}
                  className={`text-sm uppercase tracking-wide ${
                    loc === locale ? "text-gold-deep" : "text-muted"
                  }`}
                >
                  {loc}
                </Link>
              ))}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
