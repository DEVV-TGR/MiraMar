/**
 * Endereço público do site — fonte única.
 *
 * É preciso em três sítios que têm de concordar entre si: o `metadataBase`
 * (que transforma os caminhos relativos das imagens de partilha em absolutos),
 * o `sitemap.ts`/`robots.ts`, e o `scripts/generate-qr.mjs`, que lê a mesma
 * variável de ambiente por sua conta (é um script Node, não importa TypeScript).
 *
 * ⚠️ O valor por defeito é o subdomínio de demonstração da Vercel, porque **o
 * domínio final ainda não está decidido**. Quando estiver: define-se
 * `NEXT_PUBLIC_SITE_URL` no painel da Vercel e corre-se `npm run menu:qr` outra
 * vez. Enquanto isto apontar para o subdomínio de demonstração, **não mandar
 * imprimir QR codes** — ficam a apontar para um endereço que vai morrer.
 */
export const URL_SITE = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://miramar-demo.vercel.app"
).replace(/\/+$/, "");

/** As quatro rotas públicas, sem prefixo de idioma. Usadas pelo `sitemap.ts`. */
export const ROTAS_PUBLICAS = ["/", "/ementa", "/take-away", "/esplanada"] as const;
