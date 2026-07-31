import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { Sobre } from "@/components/home/Sobre";
import { EmentaDestaque } from "@/components/home/EmentaDestaque";
import { Galeria } from "@/components/home/Galeria";
import { Localizacao } from "@/components/home/Localizacao";
import { ContactosHorario } from "@/components/home/ContactosHorario";
import { obterMenu } from "@/lib/menu";

/* As diárias mudam todos os dias e são gravadas no /admin. A página continua
   estática entre gravações — o `revalidateTag("diarias")` regenera-a logo que
   alguém grava, e este teto de 5 min garante que a viragem do dia se cura
   sozinha mesmo que ninguém mexa em nada. */
export const revalidate = 300;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const menu = await obterMenu();

  return (
    <>
      <Hero />
      <Sobre />
      <EmentaDestaque menu={menu} />
      <Galeria />
      <Localizacao />
      <ContactosHorario />
    </>
  );
}
