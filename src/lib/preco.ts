/**
 * Normaliza o que o funcionário escreve no campo de preço para o formato que o
 * resto do site já usa: "8,50 €".
 *
 * Aceita "8,5", "8.50", "8", "8,50 €", " 8,50€ ". Se não for um número simples
 * — "s/ peso", "12,00 € / 18,00 €" — devolve o texto tal como foi escrito, só
 * sem espaços à volta. Vale mais deixar passar um caso raro do que impedir
 * alguém de gravar a diária por causa do formato.
 */
export function normalizarPreco(texto: string): string {
  const limpo = texto.trim();
  if (!limpo) return limpo;

  const semMoeda = limpo.replace(/€/g, "").trim();
  const comPonto = semMoeda.replace(",", ".");

  if (!/^\d+(\.\d{1,2})?$/.test(comPonto)) return limpo;

  const valor = Number(comPonto);
  if (!Number.isFinite(valor)) return limpo;

  return `${valor.toFixed(2).replace(".", ",")} €`;
}
