export type TextoLocalizado = {
  pt: string;
  en: string;
  fr: string;
  es: string;
};

export type PratoMenu = {
  nome: TextoLocalizado;
  descricao?: TextoLocalizado;
  preco: string;
};

export type CategoriaMenu = {
  nome: TextoLocalizado;
  descricao?: TextoLocalizado;
  pratos: PratoMenu[];
};

export type Menu = {
  placeholder: boolean;
  nota: TextoLocalizado;
  atualizadoEm: string;
  categorias: CategoriaMenu[];
};
