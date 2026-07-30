import { Reveal } from "@/components/ui/Reveal";
import { BotaoAncora } from "@/components/ui/Botao";
import { restaurante } from "@/data/restaurante";

export function ContactosHorario() {
  return (
    <section className="bg-sea-deep py-24 text-background">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Contactos</p>
          <h2 className="h-section mt-3 font-display">Fale connosco</h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-background/60">Horário</p>
            <ul className="mt-3 space-y-1.5 text-background/90">
              {restaurante.horarios.map((h) => (
                <li key={h.dias}>
                  {h.dias}: {h.horas}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-background/60">Telefone</p>
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
            Ligar agora
          </BotaoAncora>
        </Reveal>
      </div>
    </section>
  );
}
