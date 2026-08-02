/**
 * Gera os ícones do site a partir de `public/logo/mira-mar-logo.jpg`:
 *
 *   src/app/favicon.ico    16 / 32 / 48 px  — separador do browser
 *   src/app/icon.png       512 px           — browsers modernos, Android
 *   src/app/apple-icon.png 180 px           — "adicionar ao ecrã principal" no iOS
 *
 * Correr com `npm run icons` (e voltar a correr se o logótipo mudar).
 * São convenções de ficheiro do Next: basta existirem em `src/app/` e as
 * <link> aparecem sozinhas, nas quatro línguas e também no /admin.
 *
 * PORQUÊ UM RECORTE E NÃO O LOGÓTIPO INTEIRO
 * O logótipo é um lockup completo — ilustração, "MIRA MAR", "RESTAURANTE" e
 * "SABORES. MAR. MOMENTOS.". A 16 px, que é o tamanho a que um favicon é
 * mesmo visto, isso é uma mancha castanha ilegível. Por isso o ícone é só o
 * medalhão do topo (sol sobre o mar), que é a parte do logótipo que sobrevive
 * ao tamanho pequeno: o sol dourado e a faixa azul do mar continuam a
 * distinguir-se. O recorte foi escolhido comparando candidatos a 16, 32 e
 * 48 px — mais aberto perdia o sol, mais fechado perdia o arco dourado.
 */

import { Buffer } from "node:buffer";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LOGO = path.join(RAIZ, "public/logo/mira-mar-logo.jpg");
const DESTINO = path.join(RAIZ, "src/app");

/* Caixa do medalhão dentro do logótipo de 1080×1080, em píxeis do original.
   Se o logótipo for substituído por outro ficheiro, é isto que há a reajustar. */
const MEDALHAO = { left: 315, top: 85, width: 445, height: 445 };

/* --background da paleta (oklch(0.97 0.015 85)) em sRGB. O ícone do iOS não
   pode ter transparência — o iOS compõe as zonas transparentes a preto —, por
   isso leva o creme por baixo em vez do recorte redondo. */
const CREME = { r: 250, g: 245, b: 234, alpha: 1 };

/** Recorta o medalhão e devolve-o quadrado, no tamanho pedido. */
function medalhao(tamanho) {
  return sharp(LOGO).extract(MEDALHAO).resize(tamanho, tamanho, { fit: "cover" });
}

/* O medalhão é uma ilustração de poucas cores (creme, dourado, azul), por isso
   um PNG de paleta fica visualmente igual a um em cor verdadeira e ocupa uma
   fração — 460 kB para um favicon era desperdício puro. */
const PNG = { palette: true, quality: 90, compressionLevel: 9 };

/** O mesmo, mas com recorte circular (cantos transparentes). */
function medalhaoRedondo(tamanho) {
  const r = tamanho / 2;
  const mascara = Buffer.from(
    `<svg width="${tamanho}" height="${tamanho}"><circle cx="${r}" cy="${r}" r="${r}" fill="#fff"/></svg>`,
  );
  return medalhao(tamanho)
    .composite([{ input: mascara, blend: "dest-in" }])
    .png(PNG);
}

/**
 * Empacota PNGs num contentor .ico. Um .ico não é mais do que um índice
 * seguido das imagens; guardar PNG lá dentro (em vez de BMP) é suportado por
 * todos os browsers atuais e poupa o triplo do tamanho.
 */
function empacotarIco(imagens) {
  const CABECALHO = 6;
  const ENTRADA = 16;
  const indice = Buffer.alloc(CABECALHO + ENTRADA * imagens.length);
  indice.writeUInt16LE(0, 0); // reservado
  indice.writeUInt16LE(1, 2); // 1 = ícone
  indice.writeUInt16LE(imagens.length, 4);

  let deslocamento = indice.length;
  imagens.forEach(({ tamanho, dados }, i) => {
    const p = CABECALHO + ENTRADA * i;
    indice.writeUInt8(tamanho >= 256 ? 0 : tamanho, p); // 0 quer dizer 256
    indice.writeUInt8(tamanho >= 256 ? 0 : tamanho, p + 1);
    indice.writeUInt8(0, p + 2); // paleta: nenhuma
    indice.writeUInt8(0, p + 3); // reservado
    indice.writeUInt16LE(1, p + 4); // planos
    indice.writeUInt16LE(32, p + 6); // bits por píxel
    indice.writeUInt32LE(dados.length, p + 8);
    indice.writeUInt32LE(deslocamento, p + 12);
    deslocamento += dados.length;
  });

  return Buffer.concat([indice, ...imagens.map((i) => i.dados)]);
}

await mkdir(DESTINO, { recursive: true });

// icon.png — o que os browsers modernos usam; redondo, como no header
await medalhaoRedondo(512).toFile(path.join(DESTINO, "icon.png"));

// apple-icon.png — quadrado e opaco; o iOS aplica a sua própria máscara
await medalhao(180)
  .flatten({ background: CREME })
  .png(PNG)
  .toFile(path.join(DESTINO, "apple-icon.png"));

// favicon.ico — três tamanhos, cada um reamostrado a partir do original
const tamanhos = [16, 32, 48];
const imagens = await Promise.all(
  tamanhos.map(async (tamanho) => ({
    tamanho,
    dados: await medalhaoRedondo(tamanho).toBuffer(),
  })),
);
await writeFile(path.join(DESTINO, "favicon.ico"), empacotarIco(imagens));

console.log("Ícones gerados em src/app/:");
console.log(`  favicon.ico    (${tamanhos.join(", ")} px)`);
console.log("  icon.png       (512 px, redondo)");
console.log("  apple-icon.png (180 px, quadrado sobre creme)");
