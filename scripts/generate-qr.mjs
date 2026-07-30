#!/usr/bin/env node
/**
 * Gera public/qr/mira-mar-menu-qr.png — QR code para imprimir nas mesas,
 * a apontar para a ementa em PDF. Corre com `npm run menu:qr`.
 *
 * IMPORTANTE: MENU_URL abaixo é um placeholder (subdomínio Vercel). Atualizar
 * para o domínio final antes de imprimir os QR codes para as mesas.
 */
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";
import path from "node:path";
import QRCode from "qrcode";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "..", "public", "qr", "mira-mar-menu-qr.png");

mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });

// PLACEHOLDER — substituir pelo domínio definitivo assim que o site estiver publicado.
const MENU_URL = "https://miramar-demo.vercel.app/mira-mar-menu.pdf";

await QRCode.toFile(OUTPUT_PATH, MENU_URL, {
  type: "png",
  width: 1200,
  margin: 2,
  color: { dark: "#2c4a58", light: "#faf5eaff" },
});

console.log(`QR code gerado em ${path.relative(process.cwd(), OUTPUT_PATH)}`);
console.log(`Aponta para: ${MENU_URL}`);
console.log("Lembrete: atualizar MENU_URL no script quando houver domínio final.");
