import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { BotaoAncora } from "@/components/ui/Botao";
import { EtiquetaSeccao } from "@/components/ui/EtiquetaSeccao";
import { restaurante } from "@/data/restaurante";

export function ContactosHorario() {
  const t = useTranslations("contactos");
  const tHorario = useTranslations("horario");
  const horarios = tHorario.raw("linhas") as { dias: string; horas: string }[];

  return (
    <section className="bg-sea-deep py-24 text-background">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <EtiquetaSeccao centrado sobreEscuro>
            {t("eyebrow")}
          </EtiquetaSeccao>
          <h2 className="h-section mt-3 font-display">{t("titulo")}</h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-background/60">{t("horarioLabel")}</p>
            <ul className="mt-3 space-y-1.5 text-background/90">
              {horarios.map((h) => (
                <li key={h.dias}>
                  {h.dias}: {h.horas}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-background/60">{t("telefoneLabel")}</p>
            <a
              href={`tel:+351${restaurante.telefone.replaceAll(" ", "")}`}
              className="mt-3 block text-lg text-background transition-colors hover:text-gold"
            >
              {restaurante.telefone}
            </a>
            <p className="text-xs text-background/60">{restaurante.telefoneNota}</p>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-10">
          <BotaoAncora href={`tel:+351${restaurante.telefone.replaceAll(" ", "")}`} variante="dourado">
            {t("ligarAgora")}
          </BotaoAncora>
        </Reveal>
      </div>
    </section>
  );
}
