#!/usr/bin/env node
/**
 * Gera public/qr/mira-mar-menu-qr.png — QR code para imprimir nas mesas,
 * a apontar para a página da ementa no site (traduzida nas 4 línguas;
 * o PDF em português continua disponível como download a partir dessa
 * página). Corre com `npm run menu:qr`.
 *
 * O endereço vem de NEXT_PUBLIC_SITE_URL, a mesma variável que o site usa em
 * `src/lib/site.ts` — um QR impresso que não concorda com o `metadataBase` é
 * um cartaz a apontar para o sítio errado. (Aqui é lida do ambiente e não
 * importada: isto é um script Node, não passa pelo TypeScript.)
 *
 * ⚠️ Enquanto isto disser `miramar-demo.vercel.app`, **não mandar imprimir**:
 * os QR codes vão para as mesas plastificados e o subdomínio de demonstração
 * vai morrer. Definir o domínio final e correr o script outra vez.
 */
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";
import path from "node:path";
import QRCode from "qrcode";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "..", "public", "qr", "mira-mar-menu-qr.png");

mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });

const URL_BASE_PROVISORIA = "https://miramar-demo.vercel.app";
const URL_BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? URL_BASE_PROVISORIA).replace(/\/+$/, "");
const MENU_URL = `${URL_BASE}/ementa`;

await QRCode.toFile(OUTPUT_PATH, MENU_URL, {
  type: "png",
  width: 1200,
  margin: 2,
  color: { dark: "#2c4a58", light: "#faf5eaff" },
});

console.log(`QR code gerado em ${path.relative(process.cwd(), OUTPUT_PATH)}`);
console.log(`Aponta para: ${MENU_URL}`);

if (URL_BASE === URL_BASE_PROVISORIA) {
  console.warn(
    "\n⚠️  Este QR aponta para o subdomínio de demonstração da Vercel." +
      "\n   NÃO IMPRIMIR. Define NEXT_PUBLIC_SITE_URL com o domínio final e volta a correr.\n",
  );
}
