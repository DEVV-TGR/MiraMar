"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { Botao } from "@/components/ui/Botao";
import { formatarDiaMes } from "@/lib/data-lisboa";
import { gerirDiarias } from "./acoes";
import { ESTADO_INICIAL, type Linha, type TraducoesLinha } from "./tipos";

const IDIOMAS = [
  { chave: "en", nome: "Inglês" },
  { chave: "fr", nome: "Francês" },
  { chave: "es", nome: "Espanhol" },
] as const;

const campo =
  "w-full rounded-lg border border-line bg-raised px-3 py-2.5 text-base text-ink outline-none focus:border-gold";

function linhaVazia(id: string): Linha {
  return {
    id,
    nomePt: "",
    descricaoPt: "",
    preco: "",
    traducoes: null,
    traduzidoDe: null,
  };
}

/** As traduções deixam de bater certo assim que o português muda. */
function traducoesDesatualizadas(linha: Linha): boolean {
  if (!linha.traducoes || !linha.traduzidoDe) return false;
  return (
    linha.traduzidoDe.nome !== linha.nomePt.trim() ||
    linha.traduzidoDe.descricao !== linha.descricaoPt.trim()
  );
}

export function EditorDiarias({
  hoje,
  linhasIniciais,
  dataInicial,
  atualizadoEm,
}: {
  hoje: string;
  linhasIniciais: Linha[];
  dataInicial: string;
  atualizadoEm: string | null;
}) {
  const [estado, acao, pendente] = useActionState(gerirDiarias, ESTADO_INICIAL);

  const [data, setData] = useState(dataInicial);
  const [linhas, setLinhas] = useState<Linha[]>(
    linhasIniciais.length > 0 ? linhasIniciais : [linhaVazia("inicial")],
  );

  // Depois de gravar, o servidor devolve as linhas como ficaram (já com as
  // traduções). Substituímos o que está no ecrã por essas, para que uma
  // segunda gravação não peça tradução dos mesmos pratos outra vez.
  // Ajuste durante a renderização (e não num efeito): é o padrão do React
  // para reagir a props novas sem uma segunda passagem pelo ecrã.
  const [submissaoVista, setSubmissaoVista] = useState(0);
  if (estado.submissao !== submissaoVista) {
    setSubmissaoVista(estado.submissao);
    if (estado.ok && estado.linhas) {
      setLinhas(
        estado.linhas.length > 0
          ? estado.linhas
          : [linhaVazia(`apos-${estado.submissao}`)],
      );
    }
  }

  function alterar(id: string, mudanca: Partial<Linha>) {
    setLinhas((atuais) =>
      atuais.map((linha) => (linha.id === id ? { ...linha, ...mudanca } : linha)),
    );
  }

  function alterarTraducao(
    id: string,
    parte: "nome" | "descricao",
    idioma: "en" | "fr" | "es",
    valor: string,
  ) {
    setLinhas((atuais) =>
      atuais.map((linha) => {
        if (linha.id !== id || !linha.traducoes) return linha;
        const traducoes: TraducoesLinha =
          parte === "nome"
            ? { ...linha.traducoes, nome: { ...linha.traducoes.nome, [idioma]: valor } }
            : {
                ...linha.traducoes,
                descricao: {
                  en: linha.traducoes.descricao?.en ?? "",
                  fr: linha.traducoes.descricao?.fr ?? "",
                  es: linha.traducoes.descricao?.es ?? "",
                  [idioma]: valor,
                },
              };
        // Uma tradução escrita à mão passa a ser a boa: marcamos de que
        // português veio, para que a gravação seguinte não a mande traduzir
        // outra vez e apague a correção. Se depois mudarem o português, deixa
        // de bater certo e volta a ser traduzida — que é o que se quer.
        return {
          ...linha,
          traducoes,
          traduzidoDe: {
            nome: linha.nomePt.trim(),
            descricao: linha.descricaoPt.trim(),
          },
        };
      }),
    );
  }

  // O botão de gravar está na barra fixa em baixo e a resposta aparece em
  // cima: no telemóvel, com três pratos na lista, a mensagem ficava fora do
  // ecrã e parecia que nada tinha acontecido.
  const referenciaMensagem = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (estado.submissao === 0) return;
    referenciaMensagem.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [estado.submissao]);

  const eHoje = data === hoje;

  return (
    <form action={acao} className="pb-32">
      <input type="hidden" name="dados" value={JSON.stringify({ data, linhas })} />

      <div ref={referenciaMensagem} className="scroll-mt-6" />

      {estado.submissao > 0 && estado.mensagem && (
        <p
          role="status"
          className={`mb-5 rounded-lg border px-4 py-3 text-sm ${
            estado.ok
              ? "border-olive/40 bg-olive/10 text-olive"
              : "border-gold-deep/40 bg-gold/10 text-gold-deep"
          }`}
        >
          {estado.mensagem}
        </p>
      )}

      {estado.aviso && (
        <p
          role="alert"
          className="mb-5 rounded-lg border border-gold-deep/40 bg-gold/10 px-4 py-3 text-sm text-gold-deep"
        >
          {estado.aviso}
        </p>
      )}

      <div className="rounded-2xl border border-line bg-raised p-5">
        <label htmlFor="data" className="block text-sm font-medium text-ink">
          Dia a que se referem
        </label>
        <input
          id="data"
          type="date"
          value={data}
          onChange={(evento) => setData(evento.target.value)}
          className={`${campo} mt-2`}
        />
        <p className="mt-2 text-sm text-muted">
          {eHoje
            ? "É hoje — assim que gravares, aparecem no site."
            : `Só aparecem no site no dia ${formatarDiaMes(data)}. Podes deixar as de amanhã preparadas.`}
        </p>
        {atualizadoEm && (
          <p className="mt-1 text-xs text-muted">
            Última gravação:{" "}
            {new Date(atualizadoEm).toLocaleString("pt-PT", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
        )}
      </div>

      <ul className="mt-5 space-y-4">
        {linhas.map((linha, indice) => (
          <LinhaPrato
            key={linha.id}
            linha={linha}
            indice={indice}
            erro={estado.errosPorLinha?.[linha.id]}
            podeRemover={linhas.length > 1}
            aoAlterar={alterar}
            aoAlterarTraducao={alterarTraducao}
            aoRemover={(id) =>
              setLinhas((atuais) => atuais.filter((outra) => outra.id !== id))
            }
          />
        ))}
      </ul>

      <button
        type="button"
        onClick={() =>
          setLinhas((atuais) => [...atuais, linhaVazia(crypto.randomUUID())])
        }
        className="mt-4 w-full cursor-pointer rounded-lg border border-dashed border-line py-3 text-sm text-muted transition-colors hover:border-gold hover:text-gold-deep"
      >
        + Adicionar prato
      </button>

      <div className="mt-10 rounded-2xl border border-line p-5">
        <h2 className="font-display text-base text-ink">Apagar as diárias</h2>
        <p className="mt-1 text-sm text-muted">
          O site volta a dizer para perguntar ao empregado.
        </p>
        <button
          type="submit"
          name="intencao"
          value="apagar"
          disabled={pendente}
          onClick={(evento) => {
            if (!confirm("Apagar as diárias guardadas?")) evento.preventDefault();
          }}
          className="mt-3 cursor-pointer text-sm text-gold-deep underline underline-offset-4 disabled:opacity-60"
        >
          Apagar diárias guardadas
        </button>
      </div>

      {/* Barra fixa: na cozinha, com o telemóvel na mão, o botão de gravar
          nunca deve obrigar a rolar até ao fim da lista. */}
      <div className="fixed inset-x-0 bottom-0 border-t border-line bg-surface/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto max-w-2xl">
          <Botao
            type="submit"
            name="intencao"
            value="gravar"
            variante="dourado"
            disabled={pendente}
            className="w-full"
          >
            {pendente ? "A gravar e a traduzir…" : "Gravar diárias"}
          </Botao>
        </div>
      </div>
    </form>
  );
}

function LinhaPrato({
  linha,
  indice,
  erro,
  podeRemover,
  aoAlterar,
  aoAlterarTraducao,
  aoRemover,
}: {
  linha: Linha;
  indice: number;
  erro?: string;
  podeRemover: boolean;
  aoAlterar: (id: string, mudanca: Partial<Linha>) => void;
  aoAlterarTraducao: (
    id: string,
    parte: "nome" | "descricao",
    idioma: "en" | "fr" | "es",
    valor: string,
  ) => void;
  aoRemover: (id: string) => void;
}) {
  const idNome = useId();
  const idPreco = useId();
  const idDescricao = useId();
  const idErro = useId();
  const desatualizada = traducoesDesatualizadas(linha);

  return (
    <li className="rounded-2xl border border-line bg-raised p-5">
      <div className="flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-[0.15em] text-gold-deep">
          Prato {indice + 1}
        </span>
        {podeRemover && (
          <button
            type="button"
            onClick={() => aoRemover(linha.id)}
            className="cursor-pointer text-sm text-muted underline underline-offset-4 hover:text-gold-deep"
          >
            Remover
          </button>
        )}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_9rem]">
        <div>
          <label htmlFor={idNome} className="block text-sm font-medium text-ink">
            Nome do prato
          </label>
          <input
            id={idNome}
            value={linha.nomePt}
            onChange={(evento) => aoAlterar(linha.id, { nomePt: evento.target.value })}
            placeholder="Bacalhau com natas"
            aria-invalid={erro ? true : undefined}
            aria-describedby={erro ? idErro : undefined}
            className={`${campo} mt-2`}
          />
        </div>
        <div>
          <label htmlFor={idPreco} className="block text-sm font-medium text-ink">
            Preço
          </label>
          <input
            id={idPreco}
            value={linha.preco}
            onChange={(evento) => aoAlterar(linha.id, { preco: evento.target.value })}
            inputMode="decimal"
            placeholder="8,50"
            aria-invalid={erro ? true : undefined}
            className={`${campo} mt-2`}
          />
        </div>
      </div>

      {erro && (
        <p id={idErro} role="alert" className="mt-2 text-sm text-gold-deep">
          {erro}
        </p>
      )}

      <details className="mt-3">
        <summary className="cursor-pointer text-sm text-muted">
          Descrição {linha.descricaoPt ? "" : "(opcional)"}
        </summary>
        <label htmlFor={idDescricao} className="sr-only">
          Descrição do prato
        </label>
        <input
          id={idDescricao}
          value={linha.descricaoPt}
          onChange={(evento) => aoAlterar(linha.id, { descricaoPt: evento.target.value })}
          placeholder="Com sopa, pão e café"
          className={`${campo} mt-2`}
        />
      </details>

      {linha.traducoes && (
        <details className="mt-3">
          <summary className="cursor-pointer text-sm text-muted">
            Traduções{" "}
            {desatualizada && (
              <span className="text-gold-deep">— mudaste o português, vão ser refeitas</span>
            )}
          </summary>

          <div className="mt-3 space-y-3">
            {IDIOMAS.map((idioma) => (
              <div key={idioma.chave} className="grid gap-2 sm:grid-cols-[5rem_1fr]">
                <span className="pt-2.5 text-sm text-muted">{idioma.nome}</span>
                <div className="space-y-2">
                  <input
                    value={linha.traducoes?.nome[idioma.chave] ?? ""}
                    onChange={(evento) =>
                      aoAlterarTraducao(linha.id, "nome", idioma.chave, evento.target.value)
                    }
                    aria-label={`Nome do prato em ${idioma.nome.toLowerCase()}`}
                    className={campo}
                  />
                  {linha.descricaoPt && (
                    <input
                      value={linha.traducoes?.descricao?.[idioma.chave] ?? ""}
                      onChange={(evento) =>
                        aoAlterarTraducao(
                          linha.id,
                          "descricao",
                          idioma.chave,
                          evento.target.value,
                        )
                      }
                      aria-label={`Descrição do prato em ${idioma.nome.toLowerCase()}`}
                      className={`${campo} text-sm`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs text-muted">
            Traduzido automaticamente. Corrige o que te parecer mal — as correções
            ficam guardadas.
          </p>
        </details>
      )}
    </li>
  );
}
