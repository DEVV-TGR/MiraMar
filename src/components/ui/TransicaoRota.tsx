"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoAnel } from "@/components/ui/LogoAnel";

const MINIMO_MS = 450; // curto: marca a transição sem travar a navegação
const LIMITE_MS = 2500; // rede de segurança se a rota nunca chegar

/**
 * `/ementa`, `/take-away` e `/esplanada` comportam-se como separadores da mesma página:
 * partilham layout, título e alternador (ver `src/app/[locale]/(ementas)/`).
 * Tapar o ecrã com o logótipo entre elas era o oposto do pretendido — ficava
 * um carregamento de página onde devia haver um deslize. Só se ignora a
 * transição quando **o idioma é o mesmo**: trocar de língua muda a página
 * toda e aí o logótipo continua a fazer sentido.
 */
const ESTA_NUMA_EMENTA = /\/(ementa|take-away|esplanada)$/;
const prefixoDeIdioma = (caminho: string) => caminho.replace(ESTA_NUMA_EMENTA, "");

function ehTrocaDeSeparador(destino: string, atual: string) {
  return (
    ESTA_NUMA_EMENTA.test(destino) &&
    ESTA_NUMA_EMENTA.test(atual) &&
    prefixoDeIdioma(destino) === prefixoDeIdioma(atual)
  );
}

/** Ecrã breve entre páginas, disparado por src/instrumentation-client.ts. */
export function TransicaoRota() {
  const t = useTranslations("carregamento");
  const [visivel, setVisivel] = useState(false);
  const inicio = useRef(0);
  const destino = useRef<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const aoIniciar = (evento: Event) => {
      const url = (evento as CustomEvent<{ url?: string }>).detail?.url;
      const caminho = url ? new URL(url, window.location.origin).pathname : null;

      // mesma página (ex.: âncora `#sobre`) — deixa-se o scroll fazer o trabalho
      if (caminho !== null && caminho === window.location.pathname) return;

      if (caminho !== null && ehTrocaDeSeparador(caminho, window.location.pathname)) return;

      destino.current = caminho;
      inicio.current = performance.now();
      setVisivel(true);
    };

    window.addEventListener("rota:inicio", aoIniciar);
    return () => window.removeEventListener("rota:inicio", aoIniciar);
  }, []);

  useEffect(() => {
    if (!visivel) return;

    const chegou = destino.current === null || pathname === destino.current;
    const decorrido = performance.now() - inicio.current;
    const espera = chegou ? Math.max(0, MINIMO_MS - decorrido) : Math.max(0, LIMITE_MS - decorrido);

    const temporizador = window.setTimeout(() => setVisivel(false), espera);
    return () => window.clearTimeout(temporizador);
  }, [visivel, pathname]);

  if (!visivel) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] grid place-items-center bg-background"
    >
      <LogoAnel tamanho="pequeno" />
      <span className="sr-only">{t("aCarregarPagina")}</span>
    </div>
  );
}
