import type { TextoLocalizado } from "./menu-types";

/**
 * Pratos portugueses que a tradução automática estraga.
 *
 * O DeepL é muito bom em texto corrido, mas trata um nome de prato como uma
 * frase qualquer: "arroz de cabidela" vira arroz com sangue traduzido à letra,
 * "iscas com elas" fica num disparate, e o carapau passa a "mackerel" (que é
 * cavala, outro peixe). Numa ementa, o nome do prato *é* o conteúdo — é
 * precisamente onde não podemos falhar.
 *
 * Por isso: o que estiver aqui usa a tradução curada; o resto vai ao DeepL.
 * A lista cresce à medida que aparecem pratos novos — um restaurante roda
 * talvez 30 a 50 pratos, por isso ao fim de umas semanas cobre quase tudo.
 *
 * Critério para as entradas: quando não há equivalente real noutra língua,
 * mantém-se o nome português seguido de uma explicação curta entre parênteses.
 * O turista percebe o que vai comer e o empregado percebe o que ele pediu.
 */

type Traducoes = Omit<TextoLocalizado, "pt">;

const ENTRADAS: Record<string, Traducoes> = {
  // --- clássicos sem equivalente noutra língua -----------------------------
  "arroz de cabidela": {
    en: "Arroz de cabidela (chicken and rice in a rich blood sauce)",
    fr: "Arroz de cabidela (riz au poulet, sauce au sang)",
    es: "Arroz de cabidela (arroz con pollo en salsa de sangre)",
  },
  "bacalhau a bras": {
    en: "Bacalhau à Brás (shredded salt cod with egg, onion and straw potatoes)",
    fr: "Bacalhau à Brás (morue effilochée aux œufs, oignons et pommes paille)",
    es: "Bacalhau à Brás (bacalao desmigado con huevo, cebolla y patatas paja)",
  },
  "bacalhau com natas": {
    en: "Salt cod baked in cream",
    fr: "Morue gratinée à la crème",
    es: "Bacalao gratinado con nata",
  },
  "bacalhau a lagareiro": {
    en: "Bacalhau à lagareiro (roast salt cod with olive oil and smashed potatoes)",
    fr: "Bacalhau à lagareiro (morue rôtie à l'huile d'olive, pommes de terre écrasées)",
    es: "Bacalhau à lagareiro (bacalao asado con aceite de oliva y patatas chafadas)",
  },
  "iscas com elas": {
    en: "Iscas com elas (marinated liver strips with potatoes)",
    fr: "Iscas com elas (émincé de foie mariné, pommes de terre)",
    es: "Iscas com elas (hígado marinado en tiras con patatas)",
  },
  "rojoes a moda do minho": {
    en: "Rojões (Minho-style braised pork chunks)",
    fr: "Rojões (porc mijoté à la mode du Minho)",
    es: "Rojões (tacos de cerdo guisados al estilo del Minho)",
  },
  rojoes: {
    en: "Rojões (braised pork chunks)",
    fr: "Rojões (morceaux de porc mijotés)",
    es: "Rojões (tacos de cerdo guisados)",
  },
  "tripas a moda do porto": {
    en: "Tripas à moda do Porto (tripe and white bean stew)",
    fr: "Tripas à moda do Porto (tripes et haricots blancs mijotés)",
    es: "Tripas à moda do Porto (callos guisados con alubias blancas)",
  },
  "cozido a portuguesa": {
    en: "Cozido à portuguesa (boiled meats, sausages and vegetables)",
    fr: "Cozido à portuguesa (pot-au-feu portugais)",
    es: "Cozido à portuguesa (cocido portugués)",
  },
  feijoada: {
    en: "Feijoada (bean stew with pork and sausage)",
    fr: "Feijoada (ragoût de haricots au porc et à la saucisse)",
    es: "Feijoada (guiso de alubias con cerdo y chorizo)",
  },
  "caldo verde": {
    en: "Caldo verde (kale and potato soup with chouriço)",
    fr: "Caldo verde (soupe de chou vert et pommes de terre au chouriço)",
    es: "Caldo verde (sopa de berza y patata con chorizo)",
  },
  "sopa da pedra": {
    en: "Sopa da pedra (hearty bean and meat soup)",
    fr: "Sopa da pedra (soupe consistante aux haricots et à la viande)",
    es: "Sopa da pedra (sopa contundente de alubias y carne)",
  },
  "caldeirada de peixe": {
    en: "Caldeirada (Portuguese fish stew)",
    fr: "Caldeirada (ragoût de poisson portugais)",
    es: "Caldeirada (guiso de pescado portugués)",
  },
  francesinha: {
    en: "Francesinha (Porto's layered steak sandwich in beer sauce)",
    fr: "Francesinha (croque de Porto à la viande, sauce à la bière)",
    es: "Francesinha (sándwich de carne de Oporto con salsa de cerveza)",
  },
  "prego no prato": {
    en: "Prego (garlic steak) with egg and fries",
    fr: "Prego (steak à l'ail) avec œuf et frites",
    es: "Prego (filete al ajo) con huevo y patatas fritas",
  },
  "carne de porco a alentejana": {
    en: "Carne de porco à alentejana (pork with clams)",
    fr: "Carne de porco à alentejana (porc aux palourdes)",
    es: "Carne de porco à alentejana (cerdo con almejas)",
  },
  "polvo a lagareiro": {
    en: "Polvo à lagareiro (roast octopus with olive oil and smashed potatoes)",
    fr: "Polvo à lagareiro (poulpe rôti à l'huile d'olive, pommes de terre écrasées)",
    es: "Polvo à lagareiro (pulpo asado con aceite de oliva y patatas chafadas)",
  },
  "arroz de polvo": {
    en: "Octopus rice",
    fr: "Riz au poulpe",
    es: "Arroz con pulpo",
  },
  "arroz de marisco": {
    en: "Seafood rice",
    fr: "Riz aux fruits de mer",
    es: "Arroz con marisco",
  },
  "arroz de tamboril": {
    en: "Monkfish rice",
    fr: "Riz à la lotte",
    es: "Arroz con rape",
  },

  // --- peixe: espécies que a tradução automática troca ---------------------
  // O carapau é o erro clássico: sai "mackerel", que é cavala — outro peixe.
  carapau: {
    en: "Horse mackerel",
    fr: "Chinchard",
    es: "Jurel",
  },
  "carapau grelhado": {
    en: "Grilled horse mackerel",
    fr: "Chinchard grillé",
    es: "Jurel a la parrilla",
  },
  "carapaus grelhados": {
    en: "Grilled horse mackerel",
    fr: "Chinchards grillés",
    es: "Jureles a la parrilla",
  },
  dourada: {
    en: "Sea bream",
    fr: "Daurade",
    es: "Dorada",
  },
  "dourada grelhada": {
    en: "Grilled sea bream",
    fr: "Daurade grillée",
    es: "Dorada a la parrilla",
  },
  robalo: {
    en: "Sea bass",
    fr: "Bar",
    es: "Lubina",
  },
  "robalo grelhado": {
    en: "Grilled sea bass",
    fr: "Bar grillé",
    es: "Lubina a la parrilla",
  },
  pescada: {
    en: "Hake",
    fr: "Merlu",
    es: "Merluza",
  },
  "pescada cozida": {
    en: "Poached hake with vegetables",
    fr: "Merlu poché aux légumes",
    es: "Merluza cocida con verduras",
  },
  sardinhas: {
    en: "Grilled sardines",
    fr: "Sardines grillées",
    es: "Sardinas a la parrilla",
  },
  "sardinhas assadas": {
    en: "Charcoal-grilled sardines",
    fr: "Sardines grillées au charbon",
    es: "Sardinas asadas a la brasa",
  },
  "peixe do dia": {
    en: "Catch of the day",
    fr: "Poisson du jour",
    es: "Pescado del día",
  },

  // --- carne ---------------------------------------------------------------
  "bife de vazia": {
    en: "Sirloin steak",
    fr: "Faux-filet",
    es: "Entrecot",
  },
  "febras grelhadas": {
    en: "Grilled pork loin steaks",
    fr: "Échine de porc grillée",
    es: "Filetes de lomo de cerdo a la parrilla",
  },
  "frango assado": {
    en: "Roast chicken",
    fr: "Poulet rôti",
    es: "Pollo asado",
  },
  "frango no churrasco": {
    en: "Charcoal-grilled chicken",
    fr: "Poulet grillé au charbon",
    es: "Pollo a la brasa",
  },
  "jardineira de vaca": {
    en: "Beef and vegetable stew",
    fr: "Ragoût de bœuf aux légumes",
    es: "Estofado de ternera con verduras",
  },
  jardineira: {
    en: "Meat and vegetable stew",
    fr: "Ragoût de viande aux légumes",
    es: "Estofado de carne con verduras",
  },
  "carne guisada": {
    en: "Braised beef stew",
    fr: "Bœuf en daube",
    es: "Carne guisada",
  },
};

/**
 * Normaliza para comparação: minúsculas, sem acentos, sem espaços a mais.
 * Assim "Bacalhau à Brás", "bacalhau a bras" e "  BACALHAU À BRÁS " batem
 * todos na mesma entrada — o funcionário escreve como lhe sai.
 */
export function normalizarNome(nome: string): string {
  return nome
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // marcas de acentuação separadas pelo NFD
    .replace(/\s+/g, " ");
}

/**
 * Procura pelo **nome completo** do prato, não por substituição de palavras
 * soltas: trocar palavras dentro de uma frase produz traduções estropiadas
 * ("Bacalhau à Brás com salada" viraria uma mistura de duas línguas). Nomes de
 * pratos são curtos e repetem-se, por isso o acerto pelo nome inteiro chega.
 */
export function procurarNoDicionario(nomePt: string): Traducoes | null {
  return ENTRADAS[normalizarNome(nomePt)] ?? null;
}

/** Só para testes e para o aviso de manutenção. */
export const TOTAL_ENTRADAS = Object.keys(ENTRADAS).length;
