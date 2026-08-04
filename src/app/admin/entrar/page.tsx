import { redirect } from "next/navigation";
import { verificarSessao } from "@/lib/auth";
import { FormularioEntrar } from "./FormularioEntrar";

export default async function EntrarPage() {
  if (await verificarSessao()) redirect("/admin");

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-5 py-12">
      <div className="rounded-2xl border border-line bg-raised p-7">
        <p className="text-xs uppercase tracking-[0.2em] text-gold-deep">Mira Mar</p>
        <h1 className="mt-2 font-display text-2xl text-ink">Gestão das diárias</h1>
        <p className="mt-2 text-sm text-muted">
          Área reservada à equipa do restaurante.
        </p>

        <FormularioEntrar />
      </div>
    </main>
  );
}
