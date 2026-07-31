import { CabecalhoEmenta } from "@/components/ementa/CabecalhoEmenta";
import { AlternadorEmenta } from "@/components/ementa/AlternadorEmenta";

/**
 * Layout partilhado por `/ementa` e `/take-away`.
 *
 * A razão de existir é a transição: com as duas páginas debaixo do mesmo
 * layout, o cabeçalho e as tabs **não remontam** ao passar de uma para a
 * outra — só o conteúdo da ementa é que muda. É isso que faz a troca parecer
 * um separador a deslizar em vez de um carregamento de página.
 *
 * O título vive aqui (e não em cada página) porque tem de ficar *acima* das
 * tabs; muda conforme o caminho, com um fundido curto.
 */
export default function EmentasLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <CabecalhoEmenta />

      <div className="mt-8">
        <AlternadorEmenta />
      </div>

      {children}
    </section>
  );
}
