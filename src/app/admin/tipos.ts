/** Tipos partilhados entre o formulário (cliente) e as server actions. */

export type TraducoesLinha = {
  nome: { en: string; fr: string; es: string };
  descricao: { en: string; fr: string; es: string } | null;
};

export type Linha = {
  /** Chave estável para o React; não é guardada. */
  id: string;
  nomePt: string;
  descricaoPt: string;
  preco: string;
  /** Traduções já obtidas (ou corrigidas à mão). */
  traducoes: TraducoesLinha | null;
  /**
   * O português de que estas traduções vieram. Se o funcionário mudar o nome
   * ou a descrição, deixa de bater certo e o prato é traduzido outra vez — é
   * assim que as correções manuais sobrevivem a gravações seguintes sem
   * gastar chamadas à API em pratos que não mudaram.
   */
  traduzidoDe: { nome: string; descricao: string } | null;
};

export type EstadoFormulario = {
  ok: boolean;
  /** Mensagem de sucesso ou de erro para mostrar ao funcionário. */
  mensagem: string;
  /** Tradução falhou mas gravou à mesma — o site fica em português. */
  aviso?: string;
  /** Erros por linha, indexados pelo `id`. */
  errosPorLinha?: Record<string, string>;
  /** Linhas como ficaram guardadas, já com as traduções. */
  linhas?: Linha[];
  /** Muda a cada submissão, para o formulário saber que há resposta nova. */
  submissao: number;
};

export const ESTADO_INICIAL: EstadoFormulario = {
  ok: false,
  mensagem: "",
  submissao: 0,
};
