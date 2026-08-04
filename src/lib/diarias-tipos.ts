import type { PratoMenu } from "./menu-types";

/**
 * As diárias de um dia. Os pratos usam o mesmo `PratoMenu` do `menu.json`
 * (nome/descricao traduzidos, `preco` como string "8,50 €") para que os
 * componentes do site os consumam sem saber de onde vieram.
 */
export type Diarias = {
  /** Dia a que as diárias se referem, "YYYY-MM-DD" em hora de Lisboa. */
  data: string;
  /** Quando foram gravadas, ISO. Só informativo, mostrado no /admin. */
  atualizadoEm: string;
  pratos: PratoMenu[];
};
