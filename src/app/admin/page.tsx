import { redirect } from "next/navigation";
import { verificarSessao } from "@/lib/auth";
import { lerDiariasFrescas } from "@/lib/diarias-store";
import { hojeEmLisboa, formatarDiaMes } from "@/lib/data-lisboa";
import { sair } from "./acoes";
import { EditorDiarias } from "./EditorDiarias";
import type { Linha } from "./tipos";

/**
 * A verificação da sessão fica aqui, na página, e não no layout: um layout não
 * volta a renderizar em navegações do lado do cliente, por isso a sessão não
 * seria reavaliada. As server actions verificam-na outra vez, por sua conta.
 */
export default async function AdminPage() {
  if (!(await verificarSessao())) redirect("/admin/entrar");

  const hoje = hojeEmLisboa();
  const diarias = await lerDiariasFrescas();
  const saoDeHoje = diarias?.data === hoje;

  // Se o que está guardado é de outro dia, o site já não o mostra — mas
  // trazemo-lo à mesma para o ecrã, com a data verdadeira, para que se perceba
  // porque é que o site está a mostrar o texto genérico.
  const linhasIniciais: Linha[] = (diarias?.pratos ?? []).map((prato, i) => ({
    id: String(i),
    nomePt: prato.nome.pt,
    descricaoPt: prato.descricao?.pt ?? "",
    preco: prato.preco,
    traducoes: {
      nome: { en: prato.nome.en, fr: prato.nome.fr, es: prato.nome.es },
      descricao: prato.descricao
        ? { en: prato.descricao.en, fr: prato.descricao.fr, es: prato.descricao.es }
        : null,
    },
    traduzidoDe: {
      nome: prato.nome.pt,
      descricao: prato.descricao?.pt ?? "",
    },
  }));

  return (
    <main className="mx-auto max-w-2xl px-5 py-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold-deep">Mira Mar</p>
          <h1 className="mt-1 font-display text-2xl text-ink">Diárias</h1>
        </div>
        <form action={sair}>
          <button
            type="submit"
            className="cursor-pointer text-sm text-muted underline underline-offset-4 hover:text-gold-deep"
          >
            Sair
          </button>
        </form>
      </header>

      <p className="mt-4 rounded-lg border border-line bg-raised px-4 py-3 text-sm text-ink">
        {saoDeHoje ? (
          <>
            No site neste momento: <strong>{diarias?.pratos.length} prato(s)</strong> de
            hoje.
          </>
        ) : diarias ? (
          <>
            O site está a mostrar o texto genérico — as diárias guardadas são de{" "}
            <strong>{formatarDiaMes(diarias.data)}</strong>, não de hoje.
          </>
        ) : (
          <>Ainda não há diárias guardadas. O site diz para perguntar ao empregado.</>
        )}
      </p>

      <div className="mt-6">
        <EditorDiarias
          hoje={hoje}
          linhasIniciais={linhasIniciais}
          dataInicial={diarias?.data ?? hoje}
          atualizadoEm={diarias?.atualizadoEm ?? null}
        />
      </div>
    </main>
  );
}
