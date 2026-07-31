"use client";

import { useActionState } from "react";
import { Botao } from "@/components/ui/Botao";
import { entrar } from "../acoes";

export function FormularioEntrar() {
  const [estado, acao, pendente] = useActionState(entrar, { erro: "" });

  return (
    <form action={acao} className="mt-8 space-y-4">
      <div>
        <label
          htmlFor="palavraPasse"
          className="block text-sm font-medium text-ink"
        >
          Palavra-passe
        </label>
        <input
          id="palavraPasse"
          name="palavraPasse"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          aria-describedby={estado.erro ? "erro-entrar" : undefined}
          className="mt-2 w-full rounded-lg border border-line bg-raised px-4 py-3 text-base text-ink outline-none focus:border-gold"
        />
      </div>

      {estado.erro && (
        <p id="erro-entrar" role="alert" className="text-sm text-gold-deep">
          {estado.erro}
        </p>
      )}

      <Botao type="submit" variante="mar" disabled={pendente} className="w-full">
        {pendente ? "A entrar…" : "Entrar"}
      </Botao>
    </form>
  );
}
