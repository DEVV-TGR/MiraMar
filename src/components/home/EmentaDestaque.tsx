import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { BotaoLink } from "@/components/ui/Botao";
import { EtiquetaSeccao } from "@/components/ui/EtiquetaSeccao";
import menuData from "@/data/menu.json";
import type { Menu } from "@/lib/menu-types";

const menu = menuData as Menu;

/**
 * Aponta para a ementa a partir da homepage. Lê as categorias do
 * `menu.json` — não duplica conteúdo, acompanha sempre a ementa real.
 * É também uma das duas âncoras escuras do ritmo de cor da página.
 */
export function EmentaDestaque() {
  const t = useTranslations("ementaDestaque");
  const locale = useLocale() as keyof Menu["nota"];

  const [diaria, ...restantes] = menu.categorias;
  const pratoDiaria = diaria?.pratos[0];

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

        {/* diária em destaque — é o que traz a maioria dos clientes */}
        {diaria && pratoDiaria && (
          <Reveal delay={0.08} className="mt-12">
            <div className="mx-auto max-w-md rounded-2xl border border-gold/30 bg-gold/10 px-6 py-5 text-center">
              <p className="text-xs uppercase tracking-[0.15em] text-gold">
                {diaria.nome[locale]}
              </p>
              <p className="mt-2 font-display text-2xl">{pratoDiaria.nome[locale]}</p>
              <p className="mt-1 text-lg text-gold">{pratoDiaria.preco}</p>
              {diaria.descricao && (
                <p className="mt-2 text-sm text-background/70">{diaria.descricao[locale]}</p>
              )}
            </div>
          </Reveal>
        )}

        <Reveal delay={0.14} className="mt-10">
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
            {restantes.map((categoria, i) => (
              <li key={categoria.nome.pt} className="flex items-center gap-3">
                {i > 0 && <span className="text-gold/50">·</span>}
                <span className="font-display text-lg text-background/85">
                  {categoria.nome[locale]}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.2} className="mt-12 text-center">
          <BotaoLink href="/ementa" variante="dourado">
            {t("verCompleta")}
          </BotaoLink>
        </Reveal>
      </div>
    </section>
  );
}
