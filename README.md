# Mira Mar

Site do **Restaurante Mira Mar** — Angeiras/Lavra, Matosinhos, dentro do Parque de
Campismo Orbitur Angeiras. Landing page + três ementas digitais em quatro línguas,
com uma área onde o restaurante escreve as diárias do dia.

Ver [`AGENTS.md`](./AGENTS.md) para o contexto do negócio e o **porquê** de cada
decisão — o que está aqui é só o suficiente para pôr o projeto a correr.

## O que o site tem

- **Landing page** (`/`) — Hero, Sobre, ementa em destaque, Galeria, Localização
  (mapa) e Contactos.
- **Três ementas**, todas traduzidas: a carta do restaurante (`/ementa`, com PDF
  para descarregar), o take away (`/take-away`) e a esplanada / Pool Bar
  (`/esplanada`). O QR code das mesas aponta para a carta.
- **Quatro línguas** — PT (por defeito, sem prefixo), EN, FR, ES. O idioma do
  browser é detetado à primeira visita; há um seletor no header.
- **`/admin`** — onde os funcionários escrevem as diárias, pensado para telemóvel.
  As diárias expiram ao fim do dia e são traduzidas automaticamente ao gravar.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 · `next-intl` · `motion`
- `@vercel/blob` (diárias em produção) · DeepL, plano gratuito (traduções)
- `zod` · `sharp` (ícones e cartão de partilha) · npm

## Desenvolvimento

```bash
npm install
cp .env.example .env.local   # preencher ADMIN_PASSWORD e ADMIN_SESSION_SECRET
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000); o editor das diárias está em
[/admin](http://localhost:3000/admin).

Em desenvolvimento **não é preciso configurar mais nada**: as diárias vão para
`.data/diarias.json` (não versionado) e o site funciona sem chave de tradução.

A tradução das diárias para EN/FR/ES usa o **plano gratuito do DeepL**
(`DEEPL_API_KEY`), escolhido para o restaurante não ficar com despesa recorrente:
quando a quota acaba, bloqueia com erro em vez de cobrar. Os pratos portugueses
que a tradução automática estraga estão curados à mão em
`src/lib/dicionario-pratos.ts` — é aí que se acrescenta um prato mal traduzido,
não se troca de serviço.

## Comandos

```bash
npm run build      # build de produção
npm run lint       # eslint
npm run menu:pdf   # public/mira-mar-menu.pdf (só a carta, só em português)
npm run menu:qr    # public/qr/mira-mar-menu-qr.png, a apontar para /ementa
npm run icons      # favicon / icon / apple-icon, a partir do logótipo
```

## Antes de publicar

Três coisas por fechar, todas registadas em `AGENTS.md`:

1. **Domínio.** Definir `NEXT_PUBLIC_SITE_URL` na Vercel. É a fonte única do
   endereço: alimenta as imagens de partilha, o `sitemap.xml`, o `robots.txt` e o
   QR code. **Não imprimir QR codes antes disso** — enquanto a variável não
   estiver definida, o script avisa e o código gerado aponta para o subdomínio de
   demonstração, que vai morrer.
2. **Original da foto do hero.** A fachada (`public/fotos/entrada-restaurante.jpg`)
   é uma foto real do cliente, mas chegou a 768×1024 e o hero estica-a a toda a
   largura do ecrã. Pedir o ficheiro original ao cliente e substituí-lo, mantendo
   o nome.
3. **Ativar o Analytics** no painel da Vercel (sem cookies, plano gratuito).

As fotos do espaço já são reais (fachada, sala, placa da entrada, esplanada).
Continuam de stock temporário as de comida e mar — `peixe-grelhado.jpg`,
`prato-do-dia.jpg`, `sobremesa-casa.jpg` e `vista-mar.jpg`: substituir cada
ficheiro pela foto real correspondente, mantendo o mesmo nome — o código não
precisa de mexer.
