import { Reveal } from "@/components/ui/Reveal";
import { ImagemPlaceholder } from "@/components/ui/ImagemPlaceholder";

export function Sobre() {
  return (
    <section id="sobre" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <Reveal>
          <ImagemPlaceholder
            slot="Sala do restaurante"
            icone="🍽️"
            className="aspect-[4/3] w-full rounded-2xl"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-xs uppercase tracking-[0.2em] text-gold-deep">Sobre nós</p>
          <h2 className="h-section mt-3 font-display text-ink">Casa de bairro, mesa cheia</h2>
          <p className="mt-5 text-base leading-relaxed text-muted">
            No Mira Mar cozinha-se todos os dias como em casa: muitas diárias, peixe fresco
            e carne de boa qualidade, a preços de todos os dias. Fica junto ao Parque de
            Campismo de Angeiras, num ambiente simples e acolhedor onde os habituais se
            sentem em casa desde o primeiro dia.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Sem complicações, sem pressa — só boa comida, servida com atenção, todos os dias
            da semana.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
