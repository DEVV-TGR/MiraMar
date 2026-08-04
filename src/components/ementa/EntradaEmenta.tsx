"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Fundido curto da ementa inteira ao entrar.
 *
 * Não é o `Reveal` de scroll das secções da homepage de propósito: numa
 * ementa a pessoa está a procurar um prato e um preço, e ver as categorias
 * aparecerem uma a uma à medida que se faz scroll dá trabalho a ler. Aqui o
 * movimento serve só para a troca entre "Carta Restaurante" e "Take Away"
 * não ser um salto seco — daí ser rápido e acontecer uma vez só.
 */
export function EntradaEmenta({ children }: { children: ReactNode }) {
  const reduzido = useReducedMotion();

  return (
    <motion.div
      initial={reduzido ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
