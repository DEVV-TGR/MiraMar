import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fraunces, Geist } from "next/font/google";
import { restaurante } from "@/data/restaurante";
import "./globals.css";

/**
 * Página 404.
 *
 * Vive fora de `[locale]` — é o que apanha um endereço que não corresponde a
 * rota nenhuma, e nesse caso não há idioma para ler. Fica em português, como o
 * /admin, e por isso não usa `useTranslations` nem o `Link` do next-intl.
 *
 * Como o projeto não tem root layout (é o `[locale]/layout.tsx` que renderiza
 * <html>/<body>), tem de o fazer aqui — tal como o `admin/layout.tsx`.
 *
 * Não é uma página decorativa: os QR codes das mesas são lidos com a câmara,
 * ficam plastificados durante meses e o restaurante já teve outro nome. Um
 * endereço mal lido ou antigo cai aqui, e uma folha branca com tipo de letra do
 * sistema não se parece nada com o resto do site.
 */

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: `Página não encontrada | ${restaurante.nome}`,
  // `follow` fica ligado: a página tem ligações para a homepage e para a ementa
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html
      lang="pt"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
          <Link href="/" aria-label={restaurante.nome}>
            <Image
              src="/logo/mira-mar-logo.jpg"
              alt={restaurante.nome}
              width={200}
              height={200}
              priority
              className="h-24 w-24 rounded-full object-cover ring-1 ring-ink/10 shadow-md shadow-ink/15"
            />
          </Link>

          <p className="mt-10 text-xs uppercase tracking-[0.2em] text-muted">Erro 404</p>

          <h1 className="h-section mt-3 font-display text-ink">Página não encontrada</h1>

          <p className="mt-5 text-muted">
            O endereço que abriu não existe — ou já não existe. A ementa e os contactos estão
            todos a um toque daqui.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-medium tracking-wide text-sea-deep transition-transform duration-200 hover:scale-[1.03] hover:bg-gold-bright active:scale-[0.98]"
            >
              Voltar ao início
            </Link>
            <Link
              href="/ementa"
              className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm tracking-wide text-ink transition-colors duration-200 hover:border-gold hover:text-gold-deep"
            >
              Ver ementa
            </Link>
          </div>

          <a
            href={`tel:+351${restaurante.telefone.replace(/\s/g, "")}`}
            className="mt-8 text-sm text-muted transition-colors hover:text-gold-deep"
          >
            {restaurante.telefone}
          </a>
        </main>
      </body>
    </html>
  );
}
