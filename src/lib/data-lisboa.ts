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

const DIAS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * O dia da semana em Lisboa: 0 = domingo … 6 = sábado, como `Date.getDay()`.
 *
 * Pelo mesmo motivo que `hojeEmLisboa()`: `new Date().getDay()` daria o dia do
 * servidor, que na Vercel é UTC — no verão português, das 23h à meia-noite de
 * sábado o servidor ainda está em sábado enquanto em Lisboa já é domingo, e o
 * menu de domingo aparecia (e desaparecia) uma hora fora de horas.
 *
 * O parâmetro `agora` existe só para testar um domingo sem esperar por domingo.
 */
export function diaSemanaEmLisboa(agora: Date = new Date()): number {
  const abreviatura = new Intl.DateTimeFormat("en-US", {
    timeZone: FUSO,
    weekday: "short",
  }).format(agora);
  return DIAS.indexOf(abreviatura);
}

/** "2026-07-31" → "31/07" — como aparece no /admin. */
export function formatarDiaMes(data: string): string {
  const [, mes, dia] = data.split("-");
  return `${dia}/${mes}`;
}
