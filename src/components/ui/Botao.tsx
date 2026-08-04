import { Link } from "@/i18n/navigation";
import type { ComponentProps, ReactNode } from "react";

type Variante = "dourado" | "mar" | "contorno";

const estilos: Record<Variante, string> = {
  dourado:
    "bg-gold text-sea-deep hover:bg-gold-bright active:bg-gold-deep font-medium",
  mar: "bg-sea text-background hover:bg-sea-deep font-medium",
  contorno:
    "border border-line text-ink hover:border-gold hover:text-gold-deep",
};

const base =
  "inline-flex items-center justify-center gap-2 px-6 py-3 text-sm tracking-wide transition-[color,background-color,border-color,transform] duration-200 cursor-pointer select-none rounded-full hover:scale-[1.03] active:scale-[0.98]";

export function BotaoLink({
  variante = "dourado",
  className = "",
  children,
  ...props
}: ComponentProps<typeof Link> & { variante?: Variante; children: ReactNode }) {
  return (
    <Link {...props} className={`${base} ${estilos[variante]} ${className}`}>
      {children}
    </Link>
  );
}

/** `<button>` nativo com o mesmo aspeto — para formulários (ex.: /admin). */
export function Botao({
  variante = "dourado",
  className = "",
  children,
  ...props
}: ComponentProps<"button"> & { variante?: Variante; children: ReactNode }) {
  return (
    <button
      {...props}
      className={`${base} ${estilos[variante]} disabled:pointer-events-none disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}

export function BotaoAncora({
  variante = "dourado",
  className = "",
  children,
  ...props
}: ComponentProps<"a"> & { variante?: Variante; children: ReactNode }) {
  return (
    <a {...props} className={`${base} ${estilos[variante]} ${className}`}>
      {children}
    </a>
  );
}
