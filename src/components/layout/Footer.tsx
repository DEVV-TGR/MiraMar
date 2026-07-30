import Image from "next/image";
import { useTranslations } from "next-intl";
import { restaurante } from "@/data/restaurante";

export function Footer() {
  const t = useTranslations("footer");
  const tHorario = useTranslations("horario");
  const horarios = tHorario.raw("linhas") as { dias: string; horas: string }[];

  return (
    <footer id="contactos" className="border-t border-line/70 bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Image
              src="/logo/mira-mar-logo.jpg"
              alt={restaurante.nome}
              width={200}
              height={200}
              className="h-16 w-16 rounded-full object-cover object-[50%_18%]"
            />
            <p className="mt-4 max-w-xs text-sm italic text-muted">{restaurante.tagline}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold-deep">{t("horarioLabel")}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {horarios.map((h) => (
                <li key={h.dias}>
                  <span className="text-ink">{h.dias}:</span> {h.horas}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold-deep">{t("contactosLabel")}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>{restaurante.morada}</li>
              <li>{restaurante.localidade}</li>
              <li>
                <a href={`tel:+351${restaurante.telefone.replaceAll(" ", "")}`} className="transition-colors hover:text-ink">
                  {restaurante.telefone}
                </a>
              </li>
              <li>
                <a href={restaurante.instagram} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
                  {t("instagram")} ↗
                </a>
              </li>
              <li>
                <a href={restaurante.menuPdfUrl} target="_blank" rel="noreferrer" className="text-gold-deep transition-colors hover:text-gold">
                  {t("verEmentaPdf")} ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-12" />
        <p className="mt-6 text-center text-xs text-muted">
          {t("copyright", { ano: new Date().getFullYear(), nome: restaurante.nome })}
        </p>
      </div>
    </footer>
  );
}
