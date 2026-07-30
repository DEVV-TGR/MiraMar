export type PratoMenu = {
  nome: string;
  descricao?: string;
  preco: string;
};

export type CategoriaMenu = {
  nome: string;
  descricao?: string;
  pratos: PratoMenu[];
};

export type Menu = {
  placeholder: boolean;
  nota: string;
  atualizadoEm: string;
  categorias: CategoriaMenu[];
};
