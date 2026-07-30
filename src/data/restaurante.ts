import dados from "./restaurante.json";

/**
 * Fonte única dos dados do negócio (`restaurante.json`), usada pelo Header,
 * Footer, secções da homepage e pelos scripts de geração de PDF/QR
 * (`scripts/`). Morada é real (confirmada). Telefone e horário são
 * PLACEHOLDER — ver `_placeholders` em restaurante.json. Não publicar em
 * produção sem substituir os campos marcados.
 */
export const restaurante = dados;
