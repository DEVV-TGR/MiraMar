"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { restaurante } from "@/data/restaurante";
import { BotaoLink } from "@/components/ui/Botao";

export function Hero() {
  const t = useTranslations("hero");
  const reduzido = useReducedMotion();
  const seccao = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: seccao,
    offset: ["start start", "end start"],
  });

  // profundidade: a foto acompanha o scroll mais devagar que o conteúdo
  const yFoto = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  // o conteúdo sai antes, com um desvanecer suave — tem de estar invisível
  // antes de chegar ao header, senão passa-lhe por trás como um fantasma
  const yTexto = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const opacidadeTexto = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  return (
    <section ref={seccao} className="relative overflow-hidden pt-24">
      {/* a caixa da foto é mais alta que a secção (folga de 12% em cima e em
          baixo) para o deslocamento do parallax nunca destapar os cantos */}
      <motion.div
        style={reduzido ? undefined : { y: yFoto }}
        className="absolute inset-x-0 -inset-y-[12%] -z-20"
      >
        <Image
          src="/fotos/entrada-restaurante.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={`object-cover ${reduzido ? "" : "kenburns"}`}
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/45 to-background/10" />
      {/* véu radial na faixa do texto — o contraste não fica todo dependente
          da sombra das letras */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 45% 32% at 50% 52%, var(--halo) 0%, var(--halo-suave) 45%, transparent 75%)",
        }}
      />

      {/* sem logo aqui — o logo vive no header (centrado); repeti-lo no corpo
          punha dois logos iguais no mesmo ecrã */}
      <motion.div
        style={reduzido ? undefined : { y: yTexto, opacity: opacidadeTexto }}
        className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6"
      >
        <h1 className="h-hero titulo-destaque font-display text-ink">{restaurante.nome}</h1>
        <p className="titulo-destaque mt-3 font-display text-lg italic text-gold-deep">
          {restaurante.tagline}
        </p>

        {/* três destinos, duas hierarquias: a carta é o principal (dourado), o
            take away e a esplanada são secundários (contorno).

            No telemóvel os três empilhados eram uma coluna alta de mais para um
            ecrã que já é `min-h`: o principal fica sozinho na primeira linha e
            os dois secundários dividem a segunda. O `sm:contents` dissolve o
            wrapper acima do breakpoint e os três voltam a ser irmãos da mesma
            linha, sem markup duplicado. */}
        <div className="mt-9 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <BotaoLink href="/ementa" variante="dourado">
            {t("verEmenta")}
          </BotaoLink>
          <div className="flex gap-3 sm:contents">
            <BotaoLink
              href="/take-away"
              variante="contorno"
              className="flex-1 bg-background/70 backdrop-blur-sm sm:flex-none"
            >
              {t("verTakeAway")}
            </BotaoLink>
            <BotaoLink
              href="/esplanada"
              variante="contorno"
              className="flex-1 bg-background/70 backdrop-blur-sm sm:flex-none"
            >
              {t("verEsplanada")}
            </BotaoLink>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
