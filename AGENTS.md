<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Mira Mar

Site do **Restaurante Mira Mar** (Angeiras/Lavra, Matosinhos) — projeto real de cliente, não uma demo. É um projeto decisivo: o resultado influencia se ficamos com este cliente, por isso o acabamento visual e a execução têm de estar ao mais alto nível apesar do âmbito pequeno.

## Contexto do negócio

- O restaurante está a fazer **rebrand**: chamava-se "Mira Parque" / "Miraparque" e passa a chamar-se **Mira Mar**, com novo logótipo (`public/logo/mira-mar-logo.jpg`) e novo Instagram: [@restaurantemiramar26](https://www.instagram.com/restaurantemiramar26/).
- É um **restaurante de bairro, simples e económico** — muitas diárias, comida caseira, peixe fresco e carne. **Não é fine dining.** O design deve refletir isto: acolhedor e direto, não "premium"/luxuoso.
- Dados herdados da ficha antiga do mesmo espaço físico (**a confirmar com o cliente antes de publicar**, o rebrand pode ter mudado algo):
  - Morada: Rua de Angeiras 1183, 4455-039 Lavra, Matosinhos (em frente ao Parque de Campismo de Angeiras)
  - Telefones: 919 037 743 e 229 286 518
  - Encerra à 2ª feira ao jantar

## Âmbito do produto

Duas peças, propositadamente simples:

1. **Landing page** — site institucional simples: quem somos, localização (mapa), contactos, horário. Sem catálogo, sem funcionalidades complexas.
2. **Ementa digital** — QR code nas mesas do restaurante que abre diretamente a ementa em PDF (sem necessidade de navegar o site).

Nenhuma destas peças está implementada ainda — o design visual, a paleta de cores e a estrutura de páginas ainda **não foram decididos**. Este documento será atualizado assim que essa fase arrancar.

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
