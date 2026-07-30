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

- **Landing page** (`/{locale}`) — página única com secções: Hero, Sobre, Galeria (placeholder), Localização (mapa embutido do Google Maps), Contactos & Horário.
- **Ementa digital** — página real do site (`/{locale}/ementa`), traduzida nas 4 línguas, com botão "Descarregar PDF" (só português, ver abaixo). QR code das mesas e o CTA "Ver Ementa" do site apontam para esta página.
- **Multi-idioma** (PT/EN/FR/ES) — motivado por estar junto a um parque de campismo com muitos turistas. Ver secção própria abaixo.
- **Logótipo no carregamento/transições** — dá "vida" ao site, pedido explicitamente para o mesmo motivo (site visitado por muitos visitantes de fora, primeira impressão importa).

### Multi-idioma (`next-intl`)

- Locales: `pt` (default, sem prefixo no URL — `/`, `/ementa`), `en`, `fr`, `es` (`/en`, `/fr`, `/es`, `/en/ementa`...). Configurado em `src/i18n/routing.ts`.
- `src/middleware.ts` deteta o idioma do browser automaticamente na primeira visita (`Accept-Language`); um seletor no `Header` permite trocar a qualquer momento (fica guardado em cookie). **Não há ecrã de escolha bloqueante** — decisão do cliente, para não gerar fricção com turistas.
- Todo o copy da UI está em `messages/{pt,en,fr,es}.json`, usado via `useTranslations()` nos componentes. **As traduções EN/FR/ES foram feitas por mim (Claude)** — boas o suficiente para mostrar ao cliente, mas tal como o resto do conteúdo placeholder, vale a pena um nativo rever antes de publicar a sério.
- A ementa (`src/data/menu.json`) segue o mesmo princípio: cada `nome`/`descricao` é um objeto `{ pt, en, fr, es }`; `preco` é universal (€, não convertido por idioma).
- Ao adicionar novo copy: criar a chave nas 4 mensagens, nunca só em português — o build não falha se faltar uma chave nalgum idioma, mas o texto aparece a menos noutras línguas.

### Ementa: página do site + PDF opcional

- `src/data/menu.json` → página `/{locale}/ementa` (fonte principal, traduzida). Editar aqui para atualizar pratos/preços — não precisa de mais nada.
- `npm run menu:pdf` gera `public/mira-mar-menu.pdf` via `@react-pdf/renderer` (`scripts/generate-menu-pdf.mjs`) — **só em português** (decisão do cliente: manter o PDF como download opcional, não vale a pena gerar 4 PDFs traduzidos). O script lê os campos `.pt` do `menu.json`.
- `npm run menu:qr` gera `public/qr/mira-mar-menu-qr.png` via `qrcode` (`scripts/generate-qr.mjs`), a apontar para a página `/ementa` (não para o PDF). **Antes de imprimir os QR codes definitivos**: atualizar `MENU_URL` no script para o domínio final (atualmente placeholder Vercel).

### Logótipo no carregamento e transições

- `src/instrumentation-client.ts` + `src/components/ui/TransicaoRota.tsx` — usa a API estável do Next 16 `onRouterTransitionStart` (sem flags experimentais) para mostrar brevemente o logótipo (`LogoAnel.tsx`, anel dourado a girar) entre navegações (`/` ↔ `/ementa`, trocas de idioma).
- `src/components/ui/Preloader.tsx` — o mesmo logótipo no primeiro carregamento do site.
- Deliberadamente **discreto e rápido** (~700ms/450ms mínimos) — dá vida sem atrasar a navegação nem ficar "espetáculo" de luxo, coerente com o posicionamento simples/económico da marca.

### Design visual (decidido)

Paleta extraída do logótipo real (`public/logo/mira-mar-logo.jpg`): fundo creme quente, tinta escura para texto, dourado quente como destaque/CTA, azul-petróleo profundo ("mar") como cor secundária, verde-oliva como acento pontual — tema claro, definido em `src/app/globals.css`. Tipografia: **Fraunces** (serifada quente, `--font-fraunces`) para títulos + Geist Sans para corpo. Animação de scroll subtil (`src/components/ui/Reveal.tsx`, usa `motion`) + preloader/transições de rota (ver acima).

## Stack

- Next.js 16 (App Router, `src/app/[locale]/...`) + React 19 + TypeScript
- Tailwind CSS v4
- `next-intl` — i18n (routing, middleware, mensagens em `messages/`)
- npm

## Skills

As skills estão versionadas no repo em `.agents/skills/` (com symlinks em `.claude/skills/`, geridas via `npx skills` / `skills-lock.json`). Usar por defeito no trabalho de UI:

- **impeccable** — skill orquestradora principal para criar/rever/polir interfaces (sub-comandos: craft, audit, polish, animate, critique...).
- **emil-design-eng** + **animation-vocabulary** / **improve-animations** / **review-animations** — design engineering e qualidade de animações.
- **design-taste-frontend** / **high-end-visual-design** — critérios de bom gosto visual, evitar aspeto genérico de IA.
- **find-skills** — para descobrir e instalar novas skills quando necessário.

Nota: dado que este projeto é para um restaurante simples e económico (não premium), aplicar as skills de gosto visual com bom senso — o objetivo é "acolhedor e credível", não "luxuoso".
