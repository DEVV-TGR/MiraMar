import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/ui/Preloader";
import { TransicaoRota } from "@/components/ui/TransicaoRota";
import { SeletorIdioma } from "@/components/ui/SeletorIdioma";
import { restaurante } from "@/data/restaurante";
import { URL_SITE } from "@/lib/site";
import { ogLocale } from "@/lib/metadata";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    /* Sem isto, as imagens de partilha saíam com caminhos relativos e nenhum
       serviço as conseguia ir buscar. É também o que torna absolutos os
       `alternates` de cada página (ver `src/lib/metadata.ts`). */
    metadataBase: new URL(URL_SITE),
    title: {
      default: t("title", { nome: restaurante.nome }),
      template: `%s | ${restaurante.nome}`,
    },
    description: t("description"),
    openGraph: {
      siteName: restaurante.nome,
      locale: ogLocale(locale),
      type: "website",
    },
    /* O cartão grande — é o formato que o WhatsApp e o Facebook usam quando
       existe uma imagem de 1200×630 (ver `opengraph-image.tsx`). */
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <Preloader />
          <TransicaoRota />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <SeletorIdioma />
          {/* Sem cookies, por isso não obriga a banner de consentimento — e o
              plano gratuito da Vercel chega e sobra para este volume. A regra é
              a mesma que ditou o DeepL em vez de um modelo de linguagem: o
              restaurante não pode ter despesa recorrente.
              Montado só aqui, no site público: não interessa medir a equipa a
              escrever as diárias, e o /admin tem layout próprio. */}
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
