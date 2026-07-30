import type { Locale } from "@/i18n/routing";

/**
 * Bandeiras em SVG inline — não emoji. O Windows não traz glifos de bandeira,
 * por isso `🇵🇹` aparece lá como as letras "PT"; num site virado a turistas
 * isso não serve. Desenhos simplificados, legíveis a 20–28px.
 * O inglês usa a bandeira do Reino Unido (convenção na Europa).
 */
export function Bandeira({ locale, className = "" }: { locale: Locale; className?: string }) {
  const comum = `block rounded-[2px] ${className}`;

  if (locale === "pt") {
    return (
      <svg viewBox="0 0 30 20" className={comum} aria-hidden focusable="false">
        <rect width="30" height="20" fill="#da291c" />
        <rect width="12" height="20" fill="#046a38" />
        <circle cx="12" cy="10" r="4.6" fill="#ffe000" />
        <circle cx="12" cy="10" r="3.3" fill="#fff" />
        <circle cx="12" cy="10" r="3.3" fill="none" stroke="#046a38" strokeWidth="0.8" />
        <path d="M12 6.7v6.6M8.7 10h6.6" stroke="#046a38" strokeWidth="0.7" />
        <circle cx="12" cy="10" r="1.5" fill="#da291c" />
      </svg>
    );
  }

  if (locale === "en") {
    return (
      <svg viewBox="0 0 30 20" className={comum} aria-hidden focusable="false">
        <rect width="30" height="20" fill="#012169" />
        <path d="M0 0l30 20M30 0L0 20" stroke="#fff" strokeWidth="4" />
        <path d="M0 0l30 20M30 0L0 20" stroke="#c8102e" strokeWidth="2" />
        <path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="6.5" />
        <path d="M15 0v20M0 10h30" stroke="#c8102e" strokeWidth="4" />
      </svg>
    );
  }

  if (locale === "fr") {
    return (
      <svg viewBox="0 0 30 20" className={comum} aria-hidden focusable="false">
        <rect width="30" height="20" fill="#fff" />
        <rect width="10" height="20" fill="#002395" />
        <rect x="20" width="10" height="20" fill="#ed2939" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 30 20" className={comum} aria-hidden focusable="false">
      <rect width="30" height="20" fill="#aa151b" />
      <rect y="5" width="30" height="10" fill="#f1bf00" />
    </svg>
  );
}
