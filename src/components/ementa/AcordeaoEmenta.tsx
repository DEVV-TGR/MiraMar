"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * As ementas são compridas — a esplanada tem dez categorias e a carta seis
 * menus. Cada categoria pode ser minimizada no seu cabeçalho, e um botão no
 * topo minimiza ou mostra tudo de uma vez.
 *
 * O estado vive todo aqui, no pai: as categorias só perguntam se estão abertas
 * e pedem para alternar. Assim o botão de "minimizar tudo" não precisa que
 * ninguém lhe reporte nada.
 *
 * Guarda-se o que está **fechado**, não o que está aberto: a ementa começa toda
 * aberta, como se lê uma carta em papel. Minimizar é a exceção.
 */
type Acordeao = {
  estaAberta: (indice: number) => boolean;
  alternar: (indice: number) => void;
};

const AcordeaoContexto = createContext<Acordeao | null>(null);

export function AcordeaoEmenta({ total, children }: { total: number; children: ReactNode }) {
  const t = useTranslations("ementa");
  const [fechadas, setFechadas] = useState<number[]>([]);
  const todasFechadas = fechadas.length === total;

  const valor = useMemo<Acordeao>(
    () => ({
      estaAberta: (indice) => !fechadas.includes(indice),
      alternar: (indice) =>
        setFechadas((atual) =>
          atual.includes(indice) ? atual.filter((i) => i !== indice) : [...atual, indice],
        ),
    }),
    [fechadas],
  );

  return (
    <AcordeaoContexto.Provider value={valor}>
      <div className="mt-10 flex justify-end">
        <button
          type="button"
          onClick={() =>
            setFechadas(todasFechadas ? [] : Array.from({ length: total }, (_, i) => i))
          }
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.12em] text-muted transition-colors duration-200 hover:border-gold hover:text-gold-deep"
        >
          {todasFechadas ? t("mostrarTudo") : t("minimizarTudo")}
          <Seta aberta={!todasFechadas} />
        </button>
      </div>
      {children}
    </AcordeaoContexto.Provider>
  );
}

export function CategoriaColapsavel({
  indice,
  nome,
  preco,
  descricao,
  children,
}: {
  indice: number;
  nome: string;
  preco?: string;
  descricao?: string;
  children: ReactNode;
}) {
  const acordeao = useContext(AcordeaoContexto);
  const reduzido = useReducedMotion();
  const aberta = acordeao ? acordeao.estaAberta(indice) : true;
  const idConteudo = `ementa-categoria-${indice}`;

  return (
    <>
      {/* o botão vai dentro do `h2` e não ao contrário: um `button` não pode
          conter um título, e assim a ementa mantém a estrutura de cabeçalhos
          para quem navega com leitor de ecrã */}
      <h2 className="font-display text-xl uppercase tracking-wide text-sea-deep">
        <button
          type="button"
          onClick={() => acordeao?.alternar(indice)}
          aria-expanded={aberta}
          aria-controls={idConteudo}
          className="flex w-full cursor-pointer flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-left"
        >
          <span>{nome}</span>
          <span className="flex items-center gap-3">
            {preco && <span className="text-gold-deep">{preco}</span>}
            <Seta aberta={aberta} />
          </span>
        </button>
      </h2>
      {descricao && <p className="mt-1 text-sm italic text-muted">{descricao}</p>}

      {/* o conteúdo nunca sai do DOM, só encolhe: assim o Ctrl+F do browser
          continua a encontrar um prato dentro de uma categoria minimizada, e o
          `inert` garante que o teclado e os leitores de ecrã o ignoram enquanto
          está fechado */}
      <motion.div
        id={idConteudo}
        inert={!aberta}
        initial={false}
        animate={{ height: aberta ? "auto" : 0, opacity: aberta ? 1 : 0 }}
        transition={
          reduzido ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
        }
        className="overflow-hidden"
      >
        {children}
      </motion.div>
    </>
  );
}

/** Seta que aponta para baixo quando está aberto e para a direita quando não. */
function Seta({ aberta }: { aberta: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={`h-3.5 w-3.5 shrink-0 text-muted transition-transform duration-200 ${
        aberta ? "rotate-90" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3.5 10.5 8 6 12.5" />
    </svg>
  );
}
