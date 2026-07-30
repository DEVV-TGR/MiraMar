import type { ReactNode } from "react";

/**
 * Etiqueta que abre cada secção. As réguas finas são o único sítio onde o
 * verde-oliva da marca aparece nas secções claras — nas escuras passa a
 * dourado, que é o que lê sobre o azul.
 */
export function EtiquetaSeccao({
  children,
  centrado = false,
  sobreEscuro = false,
}: {
  children: ReactNode;
  centrado?: boolean;
  sobreEscuro?: boolean;
}) {
  const regua = sobreEscuro ? "bg-gold/50" : "bg-olive/45";
  const texto = sobreEscuro ? "text-gold" : "text-gold-deep";

  return (
    <p
      className={`flex items-center gap-3 text-xs uppercase tracking-[0.2em] ${texto} ${
        centrado ? "justify-center" : ""
      }`}
    >
      <span aria-hidden className={`h-px w-8 ${regua}`} />
      {children}
      {centrado && <span aria-hidden className={`h-px w-8 ${regua}`} />}
    </p>
  );
}
