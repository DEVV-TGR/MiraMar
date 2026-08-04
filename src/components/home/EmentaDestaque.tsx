import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { BotaoLink } from "@/components/ui/Botao";
import { EtiquetaSeccao } from "@/components/ui/EtiquetaSeccao";
import type { Menu } from "@/lib/menu-types";

/**
 * Aponta para a ementa a partir da homepage. Recebe a ementa já resolvida
 * (`obterMenu()`, que junta as diárias do dia ao `menu.json`) — não duplica
 * conteúdo, acompanha sempre a ementa real.
 * É também uma das duas âncoras escuras do ritmo de cor da página.
 */
export function EmentaDestaque({ menu }: { menu: Menu }) {
  const t = useTranslations("ementaDestaque");
  const locale = useLocale() as keyof Menu["nota"];

  const [diaria, ...restantes] = menu.categorias;

  /* As categorias que só se servem em certos dias já vêm filtradas por
     `obterMenu()` — se estão aqui, é porque hoje há. Mas não podem ir para a
     fila "Menu 2 · Menu 3 · …": aparecer e desaparecer no meio da linha sem
     explicação parece um erro, e o leitão de domingo é dos pratos que mais
     vale a pena anunciar. */
  const semanais = restantes.filter((categoria) => !categoria.diasSemana);
  const especiais = restantes.filter((categoria) => categoria.diasSemana);

  return (
    <section id="ementa" className="bg-sea-deep py-24 text-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal className="text-center">
          <EtiquetaSeccao centrado sobreEscuro>
            {t("eyebrow")}
          </EtiquetaSeccao>
          <h2 className="h-section mt-3 font-display">{t("titulo")}</h2>
          <p className="mx-auto mt-5 max-w-xl text-balance leading-relaxed text-background/75">
            {t("descricao")}
          </p>
        </Reveal>

        {/* diária em destaque — é o que traz a maioria dos clientes.
            São os pratos que o restaurante grava no /admin: um ou vários. */}
        {diaria && diaria.pratos.length > 0 && (
          <Reveal delay={0.08} className="mt-12">
            <div className="mx-auto max-w-md rounded-2xl border border-gold/30 bg-gold/10 px-6 py-5 text-center">
              <p className="text-xs uppercase tracking-[0.15em] text-gold">
                {diaria.nome[locale]}
              </p>
              {/* o preço é do menu inteiro, não de cada prato — mostrá-lo uma
                  vez aqui em cima evita repetir "7,50 €" em cada linha */}
              {diaria.preco && (
                <p className="mt-1 font-display text-3xl text-gold">{diaria.preco}</p>
              )}
              <ul className="mt-3 divide-y divide-gold/20">
                {/* chave pelo índice: as diárias vêm do /admin e nada impede
                    que alguém grave dois pratos com o mesmo nome */}
                {diaria.pratos.map((prato, i) => (
                  <li key={i} className="py-2 first:pt-0 last:pb-0">
                    <p className="font-display text-2xl">{prato.nome[locale]}</p>
                    {prato.preco && <p className="mt-1 text-lg text-gold">{prato.preco}</p>}
                    {prato.descricao && (
                      <p className="mt-1 text-sm text-background/70">
                        {prato.descricao[locale]}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
              {diaria.descricao && (
                <p className="mt-3 text-sm text-background/70">{diaria.descricao[locale]}</p>
              )}
            </div>
          </Reveal>
        )}

        <Reveal delay={0.14} className="mt-10">
          {/* só os nomes ("Menu 2 · Menu 3 · …") não dizem nada a ninguém —
              é o preço que faz alguém querer abrir a ementa */}
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
            {semanais.map((categoria, i) => (
              <li key={i} className="flex items-center gap-3">
                {i > 0 && <span className="text-gold/50">·</span>}
                <span className="font-display text-lg text-background/85">
                  {categoria.nome[locale]}
                  {categoria.preco && (
                    <span className="ml-2 text-gold">{categoria.preco}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Contorno em vez de fundo cheio: uma segunda caixa igual à da diária
            tirava-lhe o destaque, e é a diária que traz a maioria dos
            clientes. O aviso ("Só aos domingos") sai da `descricao` da
            categoria, que já vem traduzida do menu.json. */}
        {especiais.map((categoria, i) => (
          <Reveal key={i} delay={0.17} className="mt-6">
            <div className="mx-auto max-w-md rounded-2xl border border-gold/25 px-6 py-4 text-center">
              {categoria.descricao && (
                <p className="text-xs uppercase tracking-[0.15em] text-gold">
                  {categoria.descricao[locale]}
                </p>
              )}
              {categoria.pratos.map((prato, j) => (
                <p key={j} className="mt-2 font-display text-xl text-balance">
                  {prato.nome[locale]}
                </p>
              ))}
              <p className="mt-2 text-sm text-background/70">
                {categoria.nome[locale]}
                {categoria.preco && <span className="ml-2 text-gold">{categoria.preco}</span>}
              </p>
            </div>
          </Reveal>
        ))}

        <Reveal delay={0.2} className="mt-12 text-center">
          <BotaoLink href="/ementa" variante="dourado">
            {t("verCompleta")}
          </BotaoLink>
        </Reveal>
      </div>
    </section>
  );
}
