export type TextoLocalizado = {
  pt: string;
  en: string;
  fr: string;
  es: string;
};

export type PratoMenu = {
  nome: TextoLocalizado;
  descricao?: TextoLocalizado;
  /**
   * Opcional de propósito: na carta do restaurante o preço é do menu inteiro
   * (`CategoriaMenu.preco`), não do prato — os cinco pratos do Menu 2 custam
   * todos 9,00 €, e repetir o preço em cada linha só suja a ementa.
   * No take away, onde cada prato tem preço próprio, está sempre preenchido.
   */
  preco?: string;
  /**
   * Só take away: preço da dose (para partilhar). Quando existe, `preco` é o
   * da meia dose. Quando não existe, `preco` é o preço único do prato.
   */
  precoDose?: string;
};

export type CategoriaMenu = {
  nome: TextoLocalizado;
  descricao?: TextoLocalizado;
  /** Preço fixo do menu inteiro, ex. "7,50 €". Ver `PratoMenu.preco`. */
  preco?: string;
  /**
   * Dias da semana em que a categoria é servida (0 = domingo, como
   * `Date.getDay()`). Ausente — o caso normal — quer dizer todos os dias.
   *
   * Só `obterMenu()` filtra por isto. O PDF é estático e mostra sempre tudo,
   * por isso a restrição tem de estar também escrita na `descricao` ("Só aos
   * domingos"), que é o que aparece impresso.
   */
  diasSemana?: number[];
  pratos: PratoMenu[];
};

export type Menu = {
  placeholder: boolean;
  nota: TextoLocalizado;
  /** O que está incluído no preço dos menus — bloco no topo da carta. */
  incluido?: TextoLocalizado;
  atualizadoEm: string;
  categorias: CategoriaMenu[];
};
