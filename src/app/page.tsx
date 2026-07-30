import { Hero } from "@/components/home/Hero";
import { Sobre } from "@/components/home/Sobre";
import { Galeria } from "@/components/home/Galeria";
import { Localizacao } from "@/components/home/Localizacao";
import { ContactosHorario } from "@/components/home/ContactosHorario";

export default function Home() {
  return (
    <>
      <Hero />
      <Sobre />
      <Galeria />
      <Localizacao />
      <ContactosHorario />
    </>
  );
}
