import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { BotaoAncora } from "@/components/ui/Botao";
import { restaurante } from "@/data/restaurante";

export function Localizacao() {
  const t = useTranslations("localizacao");

  return (
    <section id="localizacao" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal>
        <p className="text-center text-xs uppercase tracking-[0.2em] text-gold-deep">
          {t("eyebrow")}
        </p>
        <h2 className="h-section mt-3 text-center font-display text-ink">{t("titulo")}</h2>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 overflow-hidden rounded-2xl border border-line">
        <iframe
          title={`Mapa — ${restaurante.nome}`}
          src={`https://www.google.com/maps?q=${encodeURIComponent(restaurante.mapsQuery)}&output=embed`}
          className="h-[380px] w-full grayscale-[15%]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Reveal>

      <Reveal delay={0.15} className="mt-6 flex flex-col items-center gap-4 text-center">
        <p className="text-muted">
          {restaurante.morada}, {restaurante.localidade}
          <br />
          {restaurante.moradaCompleta}
        </p>
        <BotaoAncora href={restaurante.mapsUrl} target="_blank" rel="noreferrer" variante="mar">
          {t("abrirMaps")}
        </BotaoAncora>
      </Reveal>
    </section>
  );
}
