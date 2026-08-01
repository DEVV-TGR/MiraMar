import "server-only";

import menuData from "@/data/menu.json";
import takeAwayData from "@/data/takeaway.json";
import type { Menu } from "./menu-types";
import { lerDiarias } from "./diarias-store";
import { diaSemanaEmLisboa, hojeEmLisboa } from "./data-lisboa";

const menuBase = menuData as Menu;
const takeAwayBase = takeAwayData as Menu;

/**
 * As categorias servidas hoje. Uma categoria sem `diasSemana` — o caso normal —
 * é servida todos os dias; o Menu 6 (leitão) só tem `[0]`, domingo.
 *
 * Como o Menu 1 não declara `diasSemana`, nunca é filtrado e o contrato
 * posicional "categorias[0] é a diária" mantém-se. **Uma categoria com
 * `diasSemana` nunca pode ficar em primeiro lugar no `menu.json`**: nos dias em
 * que não fosse servida, o lugar da diária passava para outro menu.
 */
function categoriasDeHoje(categorias: Menu["categorias"]) {
  const dia = diaSemanaEmLisboa();
  return categorias.filter(
    (categoria) => !categoria.diasSemana || categoria.diasSemana.includes(dia),
  );
}

/**
 * A ementa como o site a deve mostrar: o `menu.json` com a primeira categoria
 * (a diária) substituída pelos pratos que o restaurante gravou no /admin, e
 * sem as categorias que hoje não se servem.
 *
 * Se não houver diárias gravadas — ou se as que existem forem de outro dia —
 * a primeira categoria fica com o texto genérico "pergunte ao empregado".
 * Mostrar o peixe de ontem é pior do que não mostrar nada, e mais cedo ou mais
 * tarde alguém esquece-se de apagar.
 *
 * Todos os consumidores passam por aqui, por isso o contrato posicional
 * "categorias[0] é a diária" continua a valer em toda a app.
 */
export async function obterMenu(): Promise<Menu> {
  const diarias = await lerDiarias();
  const categorias = categoriasDeHoje(menuBase.categorias);

  if (!diarias || diarias.data !== hojeEmLisboa() || diarias.pratos.length === 0) {
    return { ...menuBase, categorias };
  }

  const [categoriaDiaria, ...restantes] = categorias;
  if (!categoriaDiaria) return { ...menuBase, categorias };

  return {
    ...menuBase,
    categorias: [{ ...categoriaDiaria, pratos: diarias.pratos }, ...restantes],
  };
}

/**
 * A ementa de take away. Ao contrário da carta do restaurante, é inteiramente
 * estática: não tem diária, não passa pelo /admin e não precisa de cache nem
 * de revalidação. Por isso é síncrona.
 */
export function obterTakeAway(): Menu {
  return takeAwayBase;
}
