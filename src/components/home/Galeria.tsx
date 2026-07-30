import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { ImagemPlaceholder } from "@/components/ui/ImagemPlaceholder";

const fotos = [
  { chave: "peixeGrelhado", icone: "🐟" },
  { chave: "salaBalcao", icone: "🍽️" },
  { chave: "pratoDoDia", icone: "🍲" },
  { chave: "esplanada", icone: "☀️" },
  { chave: "sobremesaDaCasa", icone: "🍮" },
  { chave: "vistaSobreOMar", icone: "🌊" },
] as const;

export function Galeria() {
  const t = useTranslations("galeria");

  return (
    <section id="galeria" className="bg-surface py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-center text-xs uppercase tracking-[0.2em] text-gold-deep">{t("eyebrow")}</p>
          <h2 className="h-section mt-3 text-center font-display text-ink">{t("titulo")}</h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {fotos.map((foto, i) => (
            <Reveal key={foto.chave} delay={i * 0.05}>
              <ImagemPlaceholder
                slot={t(`fotos.${foto.chave}`)}
                icone={foto.icone}
                className="aspect-square rounded-xl"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
