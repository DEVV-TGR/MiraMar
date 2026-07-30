"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { LogoAnel } from "@/components/ui/LogoAnel";

const MINIMO_MS = 700; // tempo mínimo em ecrã, breve — só dá vida, não atrasa
const LIMITE_MS = 2500; // rede de segurança: nunca deixar o ecrã preso

/** Ecrã de abertura breve com o logótipo, mostrado uma vez ao carregar o site. */
export function Preloader() {
  const t = useTranslations("carregamento");
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    const inicio = performance.now();
    const temporizadores: number[] = [];
    let agendado = false;

    const sair = () => {
      if (agendado) return;
      agendado = true;
      const restante = Math.max(0, MINIMO_MS - (performance.now() - inicio));
      temporizadores.push(window.setTimeout(() => setVisivel(false), restante));
    };

    if (document.readyState === "complete") sair();
    else window.addEventListener("load", sair);

    temporizadores.push(window.setTimeout(sair, LIMITE_MS));

    return () => {
      window.removeEventListener("load", sair);
      temporizadores.forEach(window.clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (!visivel) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = anterior;
    };
  }, [visivel]);

  if (!visivel) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] grid place-items-center bg-background"
    >
      <LogoAnel tamanho="grande" prioridade />
      <span className="sr-only">{t("aCarregar")}</span>
    </div>
  );
}
