import "server-only";

import menuData from "@/data/menu.json";
import type { Menu } from "./menu-types";
import { lerDiarias } from "./diarias-store";
import { hojeEmLisboa } from "./data-lisboa";

const menuBase = menuData as Menu;

/**
 * A ementa como o site a deve mostrar: o `menu.json` com a primeira categoria
 * (a diária) substituída pelos pratos que o restaurante gravou no /admin.
 *
 * Se não houver diárias gravadas — ou se as que existem forem de outro dia —
 * devolve o `menu.json` intacto, ou seja, o texto genérico "pergunte ao
 * empregado". Mostrar o peixe de ontem é pior do que não mostrar nada, e mais
 * cedo ou mais tarde alguém esquece-se de apagar.
 *
 * Todos os consumidores passam por aqui, por isso o contrato posicional
 * "categorias[0] é a diária" continua a valer em toda a app.
 */
export async function obterMenu(): Promise<Menu> {
  const diarias = await lerDiarias();

  if (!diarias || diarias.data !== hojeEmLisboa() || diarias.pratos.length === 0) {
    return menuBase;
  }

  const [categoriaDiaria, ...restantes] = menuBase.categorias;
  if (!categoriaDiaria) return menuBase;

  return {
    ...menuBase,
    categorias: [{ ...categoriaDiaria, pratos: diarias.pratos }, ...restantes],
  };
}
