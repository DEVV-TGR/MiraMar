"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const TAMANHOS = {
  grande: { caixa: 128, logo: 92 },
  pequeno: { caixa: 72, logo: 52 },
} as const;

/** Logótipo com anel dourado a girar — usado no preloader e na transição de rota. */
export function LogoAnel({
  tamanho = "grande",
  prioridade = false,
}: {
  tamanho?: keyof typeof TAMANHOS;
  prioridade?: boolean;
}) {
  const reduzido = useReducedMotion();
  const { caixa, logo } = TAMANHOS[tamanho];

  return (
    <div className="relative grid place-items-center" style={{ width: caixa, height: caixa }}>
      <motion.svg
        viewBox="0 0 100 100"
        aria-hidden
        className="absolute inset-0 h-full w-full"
        animate={reduzido ? undefined : { rotate: 360 }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="50" cy="50" r="46" fill="none" stroke="var(--line)" strokeWidth="1.5" />
        {/* arco dourado — ~25% da circunferência (2πr ≈ 289) */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="72 217"
        />
      </motion.svg>

      <motion.div
        animate={reduzido ? undefined : { opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="overflow-hidden rounded-full"
        style={{ width: logo, height: logo }}
      >
        <Image
          src="/logo/mira-mar-logo.jpg"
          alt=""
          width={200}
          height={200}
          priority={prioridade}
          className="h-full w-full object-cover object-[50%_18%]"
        />
      </motion.div>
    </div>
  );
}
