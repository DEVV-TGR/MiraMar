import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { ImagemPlaceholder } from "@/components/ui/ImagemPlaceholder";

export function Sobre() {
  const t = useTranslations("sobre");

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
          <p className="text-xs uppercase tracking-[0.2em] text-gold-deep">{t("eyebrow")}</p>
          <h2 className="h-section mt-3 font-display text-ink">{t("titulo")}</h2>
          <p className="mt-5 text-base leading-relaxed text-muted">{t("paragrafo1")}</p>
          <p className="mt-4 text-base leading-relaxed text-muted">{t("paragrafo2")}</p>
        </Reveal>
      </div>
    </section>
  );
}
