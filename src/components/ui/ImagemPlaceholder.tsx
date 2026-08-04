import Image from "next/image";

/**
 * Slot de imagem — se `src` for passado, mostra a foto (por agora, fotos de
 * stock temporárias, ver AGENTS.md); caso contrário mostra uma caixa
 * placeholder com o nome do slot, para nunca ficar quebrado.
 */
/**
 * Grelha da Galeria: duas colunas no telemóvel, três a partir do `sm`, dentro
 * de um contentor que não passa dos 1152 px. É o caso mais comum, por isso é o
 * valor por defeito — quem usar a imagem noutro sítio **tem de passar o seu**.
 */
const SIZES_GALERIA = "(min-width: 1200px) 384px, (min-width: 640px) 33vw, 50vw";

export function ImagemPlaceholder({
  slot,
  className = "",
  icone = "🐟",
  src,
  prioridade = false,
  sizes = SIZES_GALERIA,
}: {
  slot: string;
  className?: string;
  icone?: string;
  src?: string;
  prioridade?: boolean;
  /**
   * Largura que a imagem ocupa em cada tamanho de ecrã. É por aqui que o Next
   * escolhe qual das variantes serve — declarar menos do que a imagem ocupa
   * faz chegar um ficheiro pequeno esticado, e vê-se.
   */
  sizes?: string;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={slot}
          fill
          priority={prioridade}
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`Foto de ${slot} (por adicionar)`}
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-surface via-background to-surface ${className}`}
    >
      <div className="absolute inset-0 border border-line/70" />
      <div className="flex flex-col items-center gap-2 text-muted">
        <span className="text-3xl opacity-70">{icone}</span>
        <span className="text-xs uppercase tracking-[0.15em]">{slot}</span>
      </div>
    </div>
  );
}
