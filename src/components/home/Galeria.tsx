import { Reveal } from "@/components/ui/Reveal";
import { ImagemPlaceholder } from "@/components/ui/ImagemPlaceholder";

const fotos = [
  { slot: "Peixe grelhado", icone: "🐟" },
  { slot: "Sala e balcão", icone: "🍽️" },
  { slot: "Prato do dia", icone: "🍲" },
  { slot: "Esplanada", icone: "☀️" },
  { slot: "Sobremesa da casa", icone: "🍮" },
  { slot: "Vista sobre o mar", icone: "🌊" },
];

export function Galeria() {
  return (
    <section id="galeria" className="bg-surface py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-center text-xs uppercase tracking-[0.2em] text-gold-deep">Fotos</p>
          <h2 className="h-section mt-3 text-center font-display text-ink">Um bocadinho da casa</h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {fotos.map((foto, i) => (
            <Reveal key={foto.slot} delay={i * 0.05}>
              <ImagemPlaceholder slot={foto.slot} icone={foto.icone} className="aspect-square rounded-xl" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
