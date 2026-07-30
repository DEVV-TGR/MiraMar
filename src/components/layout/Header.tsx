"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { restaurante } from "@/data/restaurante";

const ligacoes = [
  { href: "#sobre", rotulo: "Sobre" },
  { href: "#galeria", rotulo: "Fotos" },
  { href: "#localizacao", rotulo: "Localização" },
  { href: "#contactos", rotulo: "Contactos" },
];

export function Header() {
  const [aberto, setAberto] = useState(false);

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
            <a
              key={l.href}
              href={l.href}
              className="text-sm tracking-wide text-muted transition-colors hover:text-ink"
            >
              {l.rotulo}
            </a>
          ))}
          <a
            href={restaurante.menuPdfUrl}
            target="_blank"
            rel="noreferrer"
            className="border border-gold-deep/50 px-4 py-2 text-sm tracking-wide text-sea-deep transition-colors hover:border-gold hover:bg-gold/10"
          >
            Ver Ementa
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setAberto((a) => !a)}
          aria-expanded={aberto}
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
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
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="font-display text-xl text-ink"
                >
                  {l.rotulo}
                </a>
              </li>
            ))}
            <li>
              <a href={restaurante.menuPdfUrl} target="_blank" rel="noreferrer" className="text-sm text-gold-deep">
                Ver Ementa (PDF) ↗
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
