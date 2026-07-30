/**
 * Slot de imagem placeholder — usar até termos fotos reais do espaço/pratos.
 * `slot` identifica onde a foto real deve entrar (ver README/AGENTS.md).
 */
export function ImagemPlaceholder({
  slot,
  className = "",
  icone = "🐟",
}: {
  slot: string;
  className?: string;
  icone?: string;
}) {
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
