import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import "../globals.css";

/* A área de administração vive fora de `[locale]`: é só em português, para a
   equipa do restaurante, e não deve herdar o header, o rodapé, o preloader nem
   o seletor de idioma do site público. Como o projeto não tem root layout
   (é o `[locale]/layout.tsx` que renderiza <html>/<body>), tem de o fazer aqui. */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Gestão das diárias | Mira Mar",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-surface">{children}</body>
    </html>
  );
}
