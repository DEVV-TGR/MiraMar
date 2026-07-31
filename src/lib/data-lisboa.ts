const FUSO = "Europe/Lisbon";

/**
 * O dia de hoje em Lisboa, "YYYY-MM-DD".
 *
 * A Vercel corre em UTC: sem isto, entre a meia-noite e a 1h de verão o
 * servidor já estaria no dia seguinte e as diárias desapareciam do site uma
 * hora antes de o restaurante fechar. `en-CA` dá exatamente o formato ISO.
 */
export function hojeEmLisboa(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** "2026-07-31" → "31/07" — como aparece no /admin. */
export function formatarDiaMes(data: string): string {
  const [, mes, dia] = data.split("-");
  return `${dia}/${mes}`;
}
