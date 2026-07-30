import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { Sobre } from "@/components/home/Sobre";
import { EmentaDestaque } from "@/components/home/EmentaDestaque";
import { Galeria } from "@/components/home/Galeria";
import { Localizacao } from "@/components/home/Localizacao";
import { ContactosHorario } from "@/components/home/ContactosHorario";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Sobre />
      <EmentaDestaque />
      <Galeria />
      <Localizacao />
      <ContactosHorario />
    </>
  );
}
