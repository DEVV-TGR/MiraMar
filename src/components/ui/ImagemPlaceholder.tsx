import Image from "next/image";

/**
 * Slot de imagem — se `src` for passado, mostra a foto (por agora, fotos de
 * stock temporárias, ver AGENTS.md); caso contrário mostra uma caixa
 * placeholder com o nome do slot, para nunca ficar quebrado.
 */
export function ImagemPlaceholder({
  slot,
  className = "",
  icone = "🐟",
  src,
  prioridade = false,
}: {
  slot: string;
  className?: string;
  icone?: string;
  src?: string;
  prioridade?: boolean;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={slot}
          fill
          priority={prioridade}
          sizes="(max-width: 640px) 50vw, 33vw"
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
