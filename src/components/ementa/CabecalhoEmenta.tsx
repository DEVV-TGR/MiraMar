"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";

/**
 * Título das páginas de ementa. Vive no layout partilhado, por isso não
 * remonta ao trocar de separador — troca de texto com um fundido curto,
 * enquanto o resto da página fica quieto.
 */
/* Cada ementa traz o seu eyebrow e título do seu namespace. Um mapa e não um
   ternário: com três abas, um booleano dava o título da carta do restaurante a
   tudo o que não fosse take away. */
const NAMESPACES: Record<string, string> = {
  "/take-away": "takeaway",
  "/esplanada": "esplanada",
};

export function CabecalhoEmenta() {
  const caminho = usePathname();
  const reduzido = useReducedMotion();

  const t = useTranslations(NAMESPACES[caminho] ?? "ementa");
  const eyebrow = t("eyebrow");
  const titulo = t("titulo");

  return (
    /* altura reservada pelo conteúdo: o `grid` de uma célula sobrepõe o texto
       que sai ao que entra, senão a página saltava durante o fundido */
    <div className="grid text-center [&>*]:col-start-1 [&>*]:row-start-1">
      <AnimatePresence initial={false}>
        <motion.div
          key={caminho}
          initial={reduzido ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduzido ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-gold-deep">{eyebrow}</p>
          <h1 className="h-section mt-3 font-display text-ink">{titulo}</h1>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
