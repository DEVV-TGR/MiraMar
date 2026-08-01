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

  // --- a carta do Mira Mar -------------------------------------------------
  // Nomes exatamente como aparecem na ementa do restaurante e no take away
  // (`src/data/menu.json` e `src/data/takeaway.json`). O Menu 1, que é o que
  // roda todos os dias no /admin, sai destes pratos — tê-los aqui é o que
  // garante que a diária aparece traduzida mesmo sem chave do DeepL.

  // Menu 1 / take away
  "feijoada a moda da casa": {
    en: "House-style feijoada (bean and meat stew)",
    fr: "Feijoada maison (ragoût de haricots et de viandes)",
    es: "Feijoada a la moda de la casa (guiso de alubias y carnes)",
  },
  "kebab de frango": {
    en: "Chicken kebab",
    fr: "Kebab de poulet",
    es: "Kebab de pollo",
  },
  "kebab de frango com batata e salada": {
    en: "Chicken kebab with potatoes and salad",
    fr: "Kebab de poulet, pommes de terre et salade",
    es: "Kebab de pollo con patatas y ensalada",
  },
  // a raia é o outro erro clássico: "raia" traduzido à letra dá "stripe"
  raia: {
    en: "Skate",
    fr: "Raie",
    es: "Raya",
  },
  "raia com batata cozida e salada": {
    en: "Skate with boiled potatoes and salad",
    fr: "Raie, pommes de terre vapeur et salade",
    es: "Raya con patata cocida y ensalada",
  },

  // Menu 2
  "panados de frango": {
    en: "Breaded chicken cutlets",
    fr: "Escalopes de poulet panées",
    es: "Filetes de pollo empanados",
  },
  "panados de frango com batata frita e arroz": {
    en: "Breaded chicken cutlets with fries and rice",
    fr: "Escalopes de poulet panées, frites et riz",
    es: "Filetes de pollo empanados con patatas fritas y arroz",
  },
  "panados de frango com batata e arroz": {
    en: "Breaded chicken cutlets with potatoes and rice",
    fr: "Escalopes de poulet panées, pommes de terre et riz",
    es: "Filetes de pollo empanados con patatas y arroz",
  },
  "panados de porco": {
    en: "Breaded pork cutlets",
    fr: "Escalopes de porc panées",
    es: "Filetes de cerdo empanados",
  },
  "panados de porco com batata e arroz": {
    en: "Breaded pork cutlets with potatoes and rice",
    fr: "Escalopes de porc panées, pommes de terre et riz",
    es: "Filetes de cerdo empanados con patatas y arroz",
  },
  "frango no churrasco com batata frita e arroz": {
    en: "Charcoal-grilled chicken with fries and rice",
    fr: "Poulet grillé au charbon de bois, frites et riz",
    es: "Pollo a la brasa con patatas fritas y arroz",
  },
  "frango no churrasco (meia de batata ou arroz)": {
    en: "Charcoal-grilled chicken (half portion of fries or rice)",
    fr: "Poulet grillé au charbon de bois (demi-portion de frites ou de riz)",
    es: "Pollo a la brasa (media de patatas o arroz)",
  },
  "omeleta mista": {
    en: "Ham and cheese omelette",
    fr: "Omelette jambon-fromage",
    es: "Tortilla mixta",
  },
  "omeleta mista com batata frita e salada": {
    en: "Ham and cheese omelette with fries and salad",
    fr: "Omelette jambon-fromage, frites et salade",
    es: "Tortilla mixta con patatas fritas y ensalada",
  },
  // "bifinhos" não é "little steaks" — são tiras finas de carne
  "bifinhos de frango grelhados": {
    en: "Grilled chicken strips",
    fr: "Émincé de poulet grillé",
    es: "Tiras de pollo a la plancha",
  },
  "bifinhos de frango grelhados, batata frita e arroz": {
    en: "Grilled chicken strips, fries and rice",
    fr: "Émincé de poulet grillé, frites et riz",
    es: "Tiras de pollo a la plancha, patatas fritas y arroz",
  },

  // Menu 3
  "dourada grelhada com batata cozida e salada": {
    en: "Grilled sea bream with boiled potatoes and salad",
    fr: "Daurade grillée, pommes de terre vapeur et salade",
    es: "Dorada a la parrilla con patata cocida y ensalada",
  },
  "dourada grelhada, batata cozida e salada": {
    en: "Grilled sea bream, boiled potatoes and salad",
    fr: "Daurade grillée, pommes de terre vapeur et salade",
    es: "Dorada a la parrilla, patata cocida y ensalada",
  },
  "salmao grelhado": {
    en: "Grilled salmon",
    fr: "Saumon grillé",
    es: "Salmón a la parrilla",
  },
  "salmao grelhado com batata cozida e salada": {
    en: "Grilled salmon with boiled potatoes and salad",
    fr: "Saumon grillé, pommes de terre vapeur et salade",
    es: "Salmón a la parrilla con patata cocida y ensalada",
  },
  "robalo grelhado, batata cozida e salada": {
    en: "Grilled sea bass, boiled potatoes and salad",
    fr: "Bar grillé, pommes de terre vapeur et salade",
    es: "Lubina a la parrilla, patata cocida y ensalada",
  },

  // Menu 4
  "bacalhau a braga": {
    en: "Braga-style salt cod",
    fr: "Morue à la mode de Braga",
    es: "Bacalao a la moda de Braga",
  },
  "bacalhau a braga, batata, arroz e molho de cebolada": {
    en: "Braga-style salt cod, potatoes, rice and onion sauce",
    fr: "Morue à la mode de Braga, pommes de terre, riz et sauce à l'oignon",
    es: "Bacalao a la moda de Braga, patatas, arroz y salsa de cebolla",
  },
  "bacalhau a braga, batata frita e arroz": {
    en: "Braga-style salt cod, fries and rice",
    fr: "Morue à la mode de Braga, frites et riz",
    es: "Bacalao a la moda de Braga, patatas fritas y arroz",
  },
  "picanha a brasileira": {
    en: "Brazilian-style picanha",
    fr: "Picanha à la brésilienne",
    es: "Picaña a la brasileña",
  },
  "picanha a brasileira, batata, arroz, feijao e farofa": {
    en: "Brazilian-style picanha, potatoes, rice, beans and farofa",
    fr: "Picanha à la brésilienne, pommes de terre, riz, haricots et farofa",
    es: "Picaña a la brasileña, patatas, arroz, frijoles y farofa",
  },
  "picanha a brasileira, batata, arroz e feijao": {
    en: "Brazilian-style picanha, potatoes, rice and beans",
    fr: "Picanha à la brésilienne, pommes de terre, riz et haricots",
    es: "Picaña a la brasileña, patatas, arroz y frijoles",
  },
  "bife grelhado com ovo, batata e arroz": {
    en: "Grilled steak with a fried egg, potatoes and rice",
    fr: "Steak grillé avec œuf au plat, pommes de terre et riz",
    es: "Bistec a la parrilla con huevo frito, patatas y arroz",
  },
  "bifinhos de vaca": {
    en: "Beef strips",
    fr: "Émincé de bœuf",
    es: "Tiras de ternera",
  },
  "bifinhos de vaca com batata, arroz e molho de cogumelos": {
    en: "Beef strips with potatoes, rice and mushroom sauce",
    fr: "Émincé de bœuf, pommes de terre, riz et sauce aux champignons",
    es: "Tiras de ternera con patatas, arroz y salsa de champiñones",
  },
  "bifinhos de vitela": {
    en: "Veal strips",
    fr: "Émincé de veau",
    es: "Tiras de ternera lechal",
  },
  "bifinhos de vitela, batata e arroz": {
    en: "Veal strips, potatoes and rice",
    fr: "Émincé de veau, pommes de terre et riz",
    es: "Tiras de ternera lechal, patatas y arroz",
  },
  "francesinha com ovo, batata frita e arroz": {
    en: "Francesinha with a fried egg, fries and rice",
    fr: "Francesinha avec œuf au plat, frites et riz",
    es: "Francesinha con huevo frito, patatas fritas y arroz",
  },

  // Menu 5
  "bife na pedra": {
    en: "Steak on a hot stone",
    fr: "Steak sur pierre chaude",
    es: "Bistec a la piedra",
  },
  "bife na pedra com batata frita e salada": {
    en: "Steak on a hot stone with fries and salad",
    fr: "Steak sur pierre chaude, frites et salade",
    es: "Bistec a la piedra con patatas fritas y ensalada",
  },

  // Menu 6 (só aos domingos)
  // "Bairrada" é uma região, não se traduz — mas sem o "roast"/"rôti" o leitão
  // fica a parecer cru nas outras línguas.
  "leitao a moda da bairrada": {
    en: "Bairrada-style roast suckling pig",
    fr: "Cochon de lait rôti à la mode de Bairrada",
    es: "Cochinillo asado a la moda de Bairrada",
  },
  "leitao a moda da bairrada com batata a rodela": {
    en: "Bairrada-style roast suckling pig with sliced potatoes",
    fr: "Cochon de lait rôti à la mode de Bairrada, pommes de terre en rondelles",
    es: "Cochinillo asado a la moda de Bairrada con patatas en rodajas",
  },

  // take away: petiscos e pratos que não estão nos menus
  "chourico crioulo": {
    en: "Creole-style chouriço sausage",
    fr: "Chouriço créole (saucisse fumée)",
    es: "Chorizo criollo",
  },
  "prego em prato": {
    en: "Prego — garlic beef steak, served on a plate",
    fr: "Prego — steak de bœuf à l'ail, servi à l'assiette",
    es: "Prego — filete de ternera al ajo, servido en plato",
  },
  "francesinha t4 com ovo e batata": {
    en: "Francesinha t4 with a fried egg and fries",
    fr: "Francesinha t4 avec œuf au plat et frites",
    es: "Francesinha t4 con huevo frito y patatas",
  },
  "francesinha t1 com batata frita": {
    en: "Francesinha t1 with fries",
    fr: "Francesinha t1 avec frites",
    es: "Francesinha t1 con patatas fritas",
  },
  // "cachorro" é cachorro-quente, não o animal — é dos piores erros possíveis
  cachorro: {
    en: "Hot dog",
    fr: "Hot-dog",
    es: "Perrito caliente",
  },
  "cachorro t4 com ovo e batata": {
    en: "Hot dog t4 with a fried egg and fries",
    fr: "Hot-dog t4 avec œuf au plat et frites",
    es: "Perrito caliente t4 con huevo frito y patatas",
  },
  "filetes de pescada": {
    en: "Hake fillets",
    fr: "Filets de merlu",
    es: "Filetes de merluza",
  },
  leitao: {
    en: "Roast suckling pig",
    fr: "Cochon de lait rôti",
    es: "Cochinillo asado",
  },
  "leitao com batata a rodela e salada": {
    en: "Roast suckling pig with sliced potatoes and salad",
    fr: "Cochon de lait rôti, pommes de terre en rondelles et salade",
    es: "Cochinillo asado con patatas en rodajas y ensalada",
  },
  "meio leitao": {
    en: "Half a suckling pig",
    fr: "Demi cochon de lait",
    es: "Medio cochinillo",
  },
  "leitao inteiro": {
    en: "Whole suckling pig",
    fr: "Cochon de lait entier",
    es: "Cochinillo entero",
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
