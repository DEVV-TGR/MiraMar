<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Mira Mar

Site do **Restaurante Mira Mar** (Angeiras/Lavra, Matosinhos) — projeto real de cliente, não uma demo. É um projeto decisivo: o resultado influencia se ficamos com este cliente, por isso o acabamento visual e a execução têm de estar ao mais alto nível apesar do âmbito pequeno.

## Contexto do negócio

- O restaurante está a fazer **rebrand**: chamava-se "Mira Parque" / "Miraparque" e passa a chamar-se **Mira Mar**, com novo logótipo (`public/logo/mira-mar-logo.jpg`) e novo Instagram: [@restaurantemiramar26](https://www.instagram.com/restaurantemiramar26/).
- É um **restaurante de bairro, simples e económico** — muitas diárias, comida caseira, peixe fresco e carne. **Não é fine dining.** O design deve refletir isto: acolhedor e direto, não "premium"/luxuoso.
- Morada confirmada: junto ao Parque de Campismo de Angeiras, Rua de Angeiras 1183, 4455-039 Lavra, Matosinhos.
- **Telefone e horário são PLACEHOLDER** (inventados a pedido do cliente, ver `src/data/restaurante.json` → `_placeholders`) — **confirmar valores reais antes de publicar ou imprimir** qualquer material.
- **Ementa é um rascunho** (`src/data/menu.json`, `placeholder: true`) — pratos e preços inventados para termos algo completo a mostrar; substituir pelos reais assim que o cliente os fornecer.
- **Fotos**: ainda não existem fotos reais do espaço/pratos. Em vez de fotos de stock (enganoso), a landing page usa slots de placeholder visuais (`ImagemPlaceholder`, `src/components/ui/ImagemPlaceholder.tsx`) com nome do slot indicado — trocar por `<Image>` real quando houver fotos, mantendo os mesmos `slot` como referência do que fotografar.

## Âmbito do produto

Duas peças, já implementadas nesta fase:

1. **Landing page** (`/`) — página única com secções: Hero, Sobre, Galeria (placeholder), Localização (mapa embutido do Google Maps), Contactos & Horário. Sem catálogo, sem funcionalidades complexas.
2. **Ementa digital** — `src/data/menu.json` (dados) → `npm run menu:pdf` gera `public/mira-mar-menu.pdf` via `@react-pdf/renderer` (`scripts/generate-menu-pdf.mjs`) → `npm run menu:qr` gera `public/qr/mira-mar-menu-qr.png` via `qrcode` (`scripts/generate-qr.mjs`), apontando para o PDF. QR code e botão "Ver Ementa" do site apontam para o mesmo ficheiro PDF.

**Atualizar a ementa no futuro**: editar `src/data/menu.json` → correr `npm run menu:pdf`. Simples, sem precisar de recriar o PDF à mão.

**Antes de imprimir os QR codes definitivos**: atualizar `MENU_URL` em `scripts/generate-qr.mjs` para o domínio final (atualmente aponta para um subdomínio Vercel placeholder) e recorrer `npm run menu:qr`.

### Design visual (decidido)

Paleta extraída do logótipo real (`public/logo/mira-mar-logo.jpg`): fundo creme quente, tinta escura para texto, dourado quente como destaque/CTA, azul-petróleo profundo ("mar") como cor secundária, verde-oliva como acento pontual — tema claro, definido em `src/app/globals.css`. Tipografia: **Fraunces** (serifada quente, `--font-fraunces`) para títulos + Geist Sans para corpo. Sem preloader nem transições de rota — site de uma página, animação limitada a reveal subtil em scroll (`src/components/ui/Reveal.tsx`, usa `motion`).

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- npm

## Skills

As skills estão versionadas no repo em `.agents/skills/` (com symlinks em `.claude/skills/`, geridas via `npx skills` / `skills-lock.json`). Usar por defeito no trabalho de UI:

- **impeccable** — skill orquestradora principal para criar/rever/polir interfaces (sub-comandos: craft, audit, polish, animate, critique...).
- **emil-design-eng** + **animation-vocabulary** / **improve-animations** / **review-animations** — design engineering e qualidade de animações.
- **design-taste-frontend** / **high-end-visual-design** — critérios de bom gosto visual, evitar aspeto genérico de IA.
- **find-skills** — para descobrir e instalar novas skills quando necessário.

Nota: dado que este projeto é para um restaurante simples e económico (não premium), aplicar as skills de gosto visual com bom senso — o objetivo é "acolhedor e credível", não "luxuoso".
