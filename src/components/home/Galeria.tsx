import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { ImagemPlaceholder } from "@/components/ui/ImagemPlaceholder";
import { EtiquetaSeccao } from "@/components/ui/EtiquetaSeccao";

const fotos = [
  { chave: "peixeGrelhado", icone: "🐟", src: "/fotos/peixe-grelhado.jpg" },
  { chave: "salaBalcao", icone: "🍽️", src: "/fotos/sala-balcao.jpg" },
  { chave: "pratoDoDia", icone: "🍲", src: "/fotos/prato-do-dia.jpg" },
  { chave: "esplanada", icone: "☀️", src: "/fotos/esplanada.jpg" },
  { chave: "sobremesaDaCasa", icone: "🍮", src: "/fotos/sobremesa-casa.jpg" },
  { chave: "vistaSobreOMar", icone: "🌊", src: "/fotos/vista-mar.jpg" },
] as const;

export function Galeria() {
  const t = useTranslations("galeria");

  return (
    <section id="galeria" className="bg-surface py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <EtiquetaSeccao centrado>{t("eyebrow")}</EtiquetaSeccao>
          <h2 className="h-section mt-3 text-center font-display text-ink">{t("titulo")}</h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {fotos.map((foto, i) => (
            <Reveal key={foto.chave} delay={i * 0.05}>
              <ImagemPlaceholder
                slot={t(`fotos.${foto.chave}`)}
                icone={foto.icone}
                src={foto.src}
                className="aspect-square rounded-xl"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
