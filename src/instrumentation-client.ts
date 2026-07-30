/**
 * Avisa o overlay de transição sempre que uma navegação começa.
 * É o único ponto que apanha todas as navegações do router — cliques em
 * <Link> (incl. troca de idioma) e navegação programática.
 */
export function onRouterTransitionStart(url: string) {
  window.dispatchEvent(new CustomEvent("rota:inicio", { detail: { url } }));
}
