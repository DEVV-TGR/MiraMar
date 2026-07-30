"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { restaurante } from "@/data/restaurante";
import { Bandeira } from "@/components/ui/Bandeira";

const ligacaoClasse =
  "text-xs uppercase tracking-[0.12em] text-ink/80 transition-colors hover:text-gold-deep";

export function Header() {
  const t = useTranslations("nav");
  const tIdiomas = useTranslations("idiomas");
  const locale = useLocale();
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const [idiomaAberto, setIdiomaAberto] = useState(false);
  const [comFundo, setComFundo] = useState(false);

  // transparente sobre a foto do hero; ganha fundo assim que se faz scroll,
  // para os links continuarem legíveis sobre as secções seguintes
  useEffect(() => {
    const aoScroll = () => setComFundo(window.scrollY > 40);
    aoScroll();
    window.addEventListener("scroll", aoScroll, { passive: true });
    return () => window.removeEventListener("scroll", aoScroll);
  }, []);

  const esquerda = [
    { hash: "sobre", rotulo: t("sobre") },
    { hash: "ementa", rotulo: t("ementa") },
    { hash: "galeria", rotulo: t("fotos") },
    { hash: "localizacao", rotulo: t("localizacao") },
  ];
  const direita = [{ hash: "contactos", rotulo: t("contactos") }];
  const todas = [...esquerda, ...direita];

  const opaco = comFundo || aberto;

  const logo = (
    <Link href="/" aria-label={restaurante.nome} className="justify-self-center">
      <Image
        src="/logo/mira-mar-logo.jpg"
        alt={restaurante.nome}
        width={200}
        height={200}
        priority
        className="h-[4.5rem] w-[4.5rem] rounded-full object-cover object-[50%_18%] ring-1 ring-ink/10 shadow-md shadow-ink/15"
      />
    </Link>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        opaco ? "border-b border-line/70 bg-background/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-24 max-w-6xl items-center px-4 sm:px-6">
        {/* desktop — grelha de 3 colunas para o logo ficar mesmo ao centro,
            independentemente da largura dos grupos de cada lado */}
        <div className="hidden w-full grid-cols-[1fr_auto_1fr] items-center md:grid">
          <nav className="flex items-center gap-7" aria-label="Principal">
            {esquerda.map((l) => (
              <Link key={l.hash} href={{ pathname: "/", hash: l.hash }} className={ligacaoClasse}>
                {l.rotulo}
              </Link>
            ))}
          </nav>

          {logo}

          <div className="flex items-center justify-end gap-6">
            {direita.map((l) => (
              <Link key={l.hash} href={{ pathname: "/", hash: l.hash }} className={ligacaoClasse}>
                {l.rotulo}
              </Link>
            ))}

            <Link
              href="/ementa"
              className="inline-flex items-center gap-2 border border-ink/25 px-4 py-2 text-xs uppercase tracking-[0.12em] text-ink transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold-deep"
            >
              {t("verEmenta")}
              <span aria-hidden>→</span>
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIdiomaAberto((a) => !a)}
                aria-expanded={idiomaAberto}
                aria-label={tIdiomas(locale)}
                className="flex cursor-pointer items-center transition-transform hover:scale-105"
              >
                <Bandeira locale={locale as Locale} className="h-4 w-6 ring-1 ring-ink/15" />
                <span className="sr-only">{tIdiomas(locale)}</span>
              </button>
              {idiomaAberto && (
                <ul className="absolute right-0 top-full mt-3 flex gap-2 rounded-xl border border-line bg-background p-2 shadow-lg">
                  {routing.locales.map((loc) => (
                    <li key={loc}>
                      <Link
                        href={pathname}
                        locale={loc}
                        onClick={() => setIdiomaAberto(false)}
                        aria-label={tIdiomas(loc)}
                        className={`block rounded transition-transform hover:scale-110 ${
                          loc === locale ? "ring-2 ring-gold" : "ring-1 ring-ink/15"
                        }`}
                      >
                        <Bandeira locale={loc} className="h-4 w-6" />
                        <span className="sr-only">{tIdiomas(loc)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* mobile — logo ao centro, menu à direita */}
        <div className="relative flex w-full items-center justify-center md:hidden">
          {logo}
          <button
            type="button"
            onClick={() => setAberto((a) => !a)}
            aria-expanded={aberto}
            aria-label={aberto ? t("fecharMenu") : t("abrirMenu")}
            className="absolute right-0 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
          >
            <span
              className={`h-px w-6 bg-ink transition-transform ${aberto ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-6 bg-ink transition-transform ${aberto ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {aberto && (
        <nav
          className="border-t border-line/70 bg-background px-6 py-6 md:hidden"
          aria-label="Menu móvel"
        >
          <ul className="flex flex-col gap-5">
            {todas.map((l) => (
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
                {t("verEmenta")} →
              </Link>
            </li>
            {/* sem idiomas aqui — no telemóvel isso é o botão flutuante
                (SeletorIdioma), para não haver dois seletores iguais */}
          </ul>
        </nav>
      )}
    </header>
  );
}
