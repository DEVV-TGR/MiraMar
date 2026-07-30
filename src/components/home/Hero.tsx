import Image from "next/image";
import { restaurante } from "@/data/restaurante";
import { ImagemPlaceholder } from "@/components/ui/ImagemPlaceholder";
import { BotaoAncora } from "@/components/ui/Botao";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16">
      <div className="absolute inset-0 -z-10">
        <ImagemPlaceholder slot="Fachada do Mira Mar" icone="🌅" className="h-full w-full" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/70 to-background/10" />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <Image
          src="/logo/mira-mar-logo.jpg"
          alt={restaurante.nome}
          width={200}
          height={200}
          priority
          className="mb-6 h-28 w-28 rounded-full object-cover shadow-lg shadow-ink/10"
        />
        <h1 className="h-hero font-display text-ink">{restaurante.nome}</h1>
        <p className="mt-3 font-display text-lg italic text-gold-deep">{restaurante.tagline}</p>
        <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-muted">
          {restaurante.descricaoCurta}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <BotaoAncora href={restaurante.menuPdfUrl} target="_blank" rel="noreferrer" variante="dourado">
            Ver Ementa
          </BotaoAncora>
          <BotaoAncora href={restaurante.mapsUrl} target="_blank" rel="noreferrer" variante="contorno">
            Como Chegar
          </BotaoAncora>
        </div>
      </div>
    </section>
  );
}
