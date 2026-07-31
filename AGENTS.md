<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Mira Mar

Site do **Restaurante Mira Mar** (Angeiras/Lavra, Matosinhos) — projeto real de cliente, não uma demo. É um projeto decisivo: o resultado influencia se ficamos com este cliente, por isso o acabamento visual e a execução têm de estar ao mais alto nível apesar do âmbito pequeno.

## Contexto do negócio

- O restaurante está a fazer **rebrand**: chamava-se "Mira Parque" / "Miraparque" e passa a chamar-se **Mira Mar**, com novo logótipo (`public/logo/mira-mar-logo.jpg`) e novo Instagram: [@restaurantemiramar26](https://www.instagram.com/restaurantemiramar26/).
- É um **restaurante de bairro, simples e económico** — muitas diárias, comida caseira, peixe fresco e carne. **Não é fine dining.** O design deve refletir isto: acolhedor e direto, não "premium"/luxuoso.
- **O restaurante fica *dentro* do Parque de Campismo Orbitur Angeiras** — não ao lado. R. Angeiras 821, 4455-039 Lavra, Matosinhos. Isto não é um detalhe de morada: é o argumento comercial. Para quem está a acampar, "o restaurante é aqui" não é a mesma coisa que "há um restaurante ali perto" — o copy das quatro línguas diz "dentro/inside/au sein/dentro" de propósito.
- **Morada, telefone e horário confirmados com o cliente em 2026-07-31** e já no `src/data/restaurante.json`: telefone fixo `22 928 6518`, aberto **todos os dias das 08:00 às 23:00** (sete dias iguais, por isso o horário é uma só linha em `messages/*.json` → `horario.linhas`). Já não há campos inventados neste ficheiro — o `_placeholders`/`_nota` foi removido.
- **`mapsQuery`/`mapsUrl` apontam para "Restaurante Mira Mar, R. Angeiras 821, 4455-039 Lavra"** — o restaurante já está registado no Google Maps com o nome novo (confirmado pelo cliente), por isso a pesquisa resolve para a ficha dele e não só para a morada. Se algum dia o mapa embutido aparecer vazio, é sinal de que a ficha mudou de nome: confirmar no Google Maps antes de mexer aqui.
- **Ementa é um rascunho** (`src/data/menu.json`, `placeholder: true`) — pratos e preços inventados para termos algo completo a mostrar; substituir pelos reais assim que o cliente os fornecer.
- **Fotos**: ainda não existem fotos reais do espaço/pratos. Por pedido do cliente ("não vamos entregar o trabalho com 0 imagens"), `public/fotos/` tem **fotos de stock temporárias** (Unsplash/Pexels, licença livre para uso comercial, sem necessidade de atribuição) — **não são o espaço real do Mira Mar**, servem só para dar noção do resultado final. `ImagemPlaceholder` (`src/components/ui/ImagemPlaceholder.tsx`) aceita uma prop `src` opcional: com `src` mostra a foto, sem `src` mostra a caixa placeholder (nunca quebra se faltar alguma imagem). **Substituir cada ficheiro em `public/fotos/` pela foto real correspondente assim que existir** — os componentes (`Hero.tsx`, `Sobre.tsx`, `Galeria.tsx`) já apontam para os caminhos certos, não é preciso mexer no código, só trocar os ficheiros mantendo o mesmo nome. 
> ⚠️ **`praia-angeiras.jpg` (fundo do Hero) tem um problema de licenciamento por resolver.** Ao contrário das restantes, não veio de stock livre — foi fornecida pelo cliente a partir de uma pesquisa na web, sem licença conhecida. Serve como placeholder para apresentação, mas **não pode ir para produção assim**: ou se licencia, ou (melhor) o cliente tira uma foto própria — a praia é ali ao lado do restaurante.

## Âmbito do produto

- **Landing page** (`/{locale}`) — página única com secções: Hero, Sobre, Galeria (placeholder), Localização (mapa embutido do Google Maps), Contactos & Horário.
- **Ementa digital** — página real do site (`/{locale}/ementa`), traduzida nas 4 línguas, com botão "Descarregar PDF" (só português, ver abaixo). QR code das mesas e o CTA "Ver Ementa" do site apontam para esta página.
- **Multi-idioma** (PT/EN/FR/ES) — motivado por o restaurante estar dentro de um parque de campismo cheio de turistas estrangeiros. Ver secção própria abaixo.
- **Logótipo no carregamento/transições** — dá "vida" ao site, pedido explicitamente para o mesmo motivo (site visitado por muitos visitantes de fora, primeira impressão importa).

### Multi-idioma (`next-intl`)

- Locales: `pt` (default, sem prefixo no URL — `/`, `/ementa`), `en`, `fr`, `es` (`/en`, `/fr`, `/es`, `/en/ementa`...). Configurado em `src/i18n/routing.ts`.
- `src/proxy.ts` (o Next 16 renomeou `middleware.ts` → `proxy.ts`) deteta o idioma do browser automaticamente na primeira visita (`Accept-Language`); um seletor no `Header` permite trocar a qualquer momento (fica guardado em cookie). **Não há ecrã de escolha bloqueante** — decisão do cliente, para não gerar fricção com turistas.
- Todo o copy da UI está em `messages/{pt,en,fr,es}.json`, usado via `useTranslations()` nos componentes. **As traduções EN/FR/ES foram feitas por mim (Claude)** — boas o suficiente para mostrar ao cliente, mas tal como o resto do conteúdo placeholder, vale a pena um nativo rever antes de publicar a sério.
- A ementa (`src/data/menu.json`) segue o mesmo princípio: cada `nome`/`descricao` é um objeto `{ pt, en, fr, es }`; `preco` é universal (€, não convertido por idioma).
- Ao adicionar novo copy: criar a chave nas 4 mensagens, nunca só em português — o build não falha se faltar uma chave nalgum idioma, mas o texto aparece a menos noutras línguas.

### Ementa: página do site + PDF opcional

- `src/data/menu.json` → página `/{locale}/ementa` (fonte principal, traduzida). Editar aqui para atualizar pratos/preços — não precisa de mais nada. **Exceção: a diária.** Essa é editada pelo restaurante em `/admin` e substitui os pratos da primeira categoria em tempo de execução (ver secção própria abaixo); o que está no `menu.json` é só o texto genérico de reserva.
- `npm run menu:pdf` gera `public/mira-mar-menu.pdf` via `@react-pdf/renderer` (`scripts/generate-menu-pdf.mjs`) — **só em português** (decisão do cliente: manter o PDF como download opcional, não vale a pena gerar 4 PDFs traduzidos). O script lê os campos `.pt` do `menu.json`.
- `npm run menu:qr` gera `public/qr/mira-mar-menu-qr.png` via `qrcode` (`scripts/generate-qr.mjs`), a apontar para a página `/ementa` (não para o PDF). **Antes de imprimir os QR codes definitivos**: atualizar `MENU_URL` no script para o domínio final (atualmente placeholder Vercel).

### Diárias editáveis pelo cliente (`/admin`)

O restaurante muda as diárias todos os dias e não pode depender de nós para isso. `/admin` é a página onde os funcionários as escrevem — pensada para telemóvel, que é o que têm na mão na cozinha.

- **Fluxo**: `/admin/entrar` (palavra-passe) → `/admin` (editor) → grava → o site atualiza-se sozinho. `src/lib/menu.ts` (`obterMenu()`) junta as diárias gravadas ao `menu.json`, substituindo os pratos da **primeira categoria**. Todos os consumidores passam por aí, por isso o contrato "categorias[0] é a diária" continua a valer.
- **Expiram ao fim do dia** (`src/lib/data-lisboa.ts`, fuso `Europe/Lisbon`): se as diárias guardadas não forem de hoje, o site volta ao texto genérico "pergunte ao empregado". Os funcionários esquecem-se de apagar, e mostrar o peixe de ontem é pior do que não mostrar nada. Cuidado ao mexer nisto: a Vercel corre em UTC.
- **Armazenamento** (`src/lib/diarias-store.ts`): Vercel Blob em produção (o sistema de ficheiros é só-leitura lá), ficheiro `.data/diarias.json` em desenvolvimento. O driver é escolhido pela presença de `BLOB_READ_WRITE_TOKEN` — em dev não é preciso configurar nada. Trocar de fornecedor é mexer só neste ficheiro.
- **Revalidação**: a leitura está em `unstable_cache` com a tag `diarias`; a server action chama **`updateTag("diarias")`**. Não trocar por `revalidateTag(tag, "max")` — testámos e esse tem semântica stale-while-revalidate: quem grava e vai logo ver o site ainda apanha a versão antiga na primeira visita. As páginas públicas têm `revalidate = 300` como rede de segurança para a viragem do dia.
- **Tradução automática** (`src/lib/traduzir.ts`): ao gravar, os pratos novos (ou cujo português mudou) são traduzidos para EN/FR/ES. Duas fontes, por esta ordem: (1) `src/lib/dicionario-pratos.ts`, uma lista curada à mão dos pratos portugueses que qualquer tradutor automático estraga — "arroz de cabidela", "iscas com elas", "carapau" (que sai "mackerel", que é cavala); (2) **DeepL** para o resto, incluindo as descrições, que são texto corrido. **Nunca bloqueia a gravação**: se a API falhar ou faltar a chave, os nomes que estão no dicionário aparecem traduzidos à mesma (não precisam de rede), o resto fica em português, avisa no ecrã e o funcionário escreve à mão. Uma tradução corrigida à mão fica marcada como boa e não é sobrescrita na gravação seguinte.
- **Porquê DeepL e não um modelo de linguagem**: um modelo traduz melhor os nomes de pratos, mas custa ~1 €/mês e obriga a carregar saldo. **O restaurante não pode ter despesa recorrente** — nem uma fatura pequena, nem um cartão numa conta que expira daqui a dois anos e faz as traduções deixarem de funcionar em silêncio. O plano gratuito do DeepL **bloqueia com erro quando a quota acaba, não passa a cobrar**; é essa garantia que interessa, mais do que ser barato. Ao volume deste site (3 pratos × 3 línguas, uma ou duas gravações por dia) fica-se abaixo de 10% da quota gratuita, e os pratos que estão no dicionário nem chegam a gastar quota. O dicionário é o que compensa a diferença de qualidade — **quando aparecer um prato mal traduzido, a correção é acrescentar uma entrada lá, não trocar de serviço.**
- **Autenticação** (`src/lib/auth.ts`): uma palavra-passe partilhada (`ADMIN_PASSWORD`) e um cookie assinado com HMAC-SHA256 (`ADMIN_SESSION_SECRET`), 30 dias. É deliberadamente modesto — protege contra alterações acidentais e curiosos, **não** contra um atacante determinado; não há limite de tentativas por IP (em serverless não há contagem fiável em memória), só comparação em tempo constante e um atraso fixo. Se um dia isto crescer, o passo seguinte são contas individuais com hash.
- **Onde se verifica a sessão**: na `page.tsx` e **dentro de cada server action**. Nunca no `layout.tsx` (não re-renderiza em navegações do lado do cliente) e nunca só no `proxy.ts` — as server actions são POSTs alcançáveis diretamente, e `/admin` está de propósito **fora** do matcher do `proxy.ts` (senão o next-intl reescrevia para `/pt/admin` e dava 404).
- **Variáveis de ambiente**: ver `.env.example`. Os ficheiros `.env` são lidos da raiz do projeto, nunca de `src/`.
- O **PDF continua estático e em português** — as diárias são por natureza dinâmicas e não fazem sentido num ficheiro descarregado.

### Logótipo no carregamento e transições

- `src/instrumentation-client.ts` + `src/components/ui/TransicaoRota.tsx` — usa a API estável do Next 16 `onRouterTransitionStart` (sem flags experimentais) para mostrar brevemente o logótipo (`LogoAnel.tsx`, anel dourado a girar) entre navegações (`/` ↔ `/ementa`, trocas de idioma).
- `src/components/ui/Preloader.tsx` — o mesmo logótipo no primeiro carregamento do site.
- Deliberadamente **discreto e rápido** (~700ms/450ms mínimos) — dá vida sem atrasar a navegação nem ficar "espetáculo" de luxo, coerente com o posicionamento simples/económico da marca.

### Design visual (decidido)

Paleta extraída do logótipo real (`public/logo/mira-mar-logo.jpg`): fundo creme quente, tinta escura para texto, dourado quente como destaque/CTA, azul-petróleo profundo ("mar") como cor secundária, verde-oliva como acento pontual — tema claro, definido em `src/app/globals.css`. Tipografia: **Fraunces** (serifada quente, `--font-fraunces`) para títulos + Geist Sans para corpo. Animação de scroll subtil (`src/components/ui/Reveal.tsx`, usa `motion`) + preloader/transições de rota (ver acima).

**Header + Hero — referência e lições aprendidas.** A referência acordada com o cliente é [casadaguripa.pt](https://casadaguripa.pt) (restaurante real em Angeiras, ao lado do Mira Mar).

- **Header** (`src/components/layout/Header.tsx`): logo **ao centro**, links divididos aos dois lados (grelha de 3 colunas para o logo ficar mesmo centrado), botão com contorno + seta à direita ("Ver Ementa" — o equivalente ao "Reservar" deles), e **transparente** sobre a foto do hero. Ganha fundo creme + blur ao fazer scroll, para os links continuarem legíveis sobre as secções seguintes (a referência deixa o header desaparecer, mas nós temos o seletor de idioma lá — importante para turistas — por isso mantém-se acessível).
- **Hero** (`src/components/home/Hero.tsx`): centrado e deliberadamente simples — título, tagline, **um só botão**. Sem logo no corpo (vive no header; repeti-lo punha dois logos iguais no mesmo ecrã). Movimento: zoom lento (Ken Burns) + parallax em scroll (a foto acompanha mais devagar, o texto sobe e desvanece).
- **Lição**: uma tentativa anterior de "dar vida" acrescentando peças (selo, descrição, dois botões, seta de scroll, entrada em sequência, layout assimétrico) piorou o resultado e foi rejeitada. Aqui "mais vivo" significou **mais simples e confiante** + uma foto genuinamente boa, não mais elementos. Não voltar a encher o Hero sem necessidade clara.
- **Título sobre a foto**: a foto da praia é muito clara e ocupada, e o texto escuro perdia-se. A solução é a classe `.titulo-destaque` (`globals.css`) — halo creme em camadas via `text-shadow`, mais um véu radial na faixa do texto no `Hero.tsx`. Foi preferida a um contorno duro, que numa serifada fica com ar amador.

### Ritmo de cor das secções

A paleta não muda; o que estava mal era a **distribuição** — eram quatro secções cremes seguidas e só uma cor forte no fim, o que fazia a página parecer lavada. Ordem atual, com duas âncoras escuras espaçadas:

`Hero (foto)` → `Sobre (creme)` → **`EmentaDestaque (azul-escuro)`** → `Galeria (surface)` → `Localização (creme)` → **`Contactos (azul-escuro)`** → `Rodapé (surface)`

O **verde-oliva** da paleta esteve definido sem uso nenhum até aqui; agora é a cor das réguas finas de `EtiquetaSeccao` (`src/components/ui/EtiquetaSeccao.tsx`), o componente que abre todas as secções — nas secções escuras as réguas passam a douradas (`sobreEscuro`), que é o que lê sobre o azul. Usar sempre este componente para os "eyebrows" de secção, em vez de repetir o markup.

### Idiomas: bandeiras

- `src/components/ui/Bandeira.tsx` — as 4 bandeiras em **SVG inline, nunca emoji**: o Windows não tem glifos de bandeira e mostra `🇵🇹` como as letras "PT", o que não serve num site virado a turistas. Inglês usa a bandeira do Reino Unido (convenção europeia).
- Há um seletor por tamanho de ecrã, **nunca os dois ao mesmo tempo**: no desktop o do `Header.tsx` (dentro do bloco `hidden md:grid`); no telemóvel o flutuante `src/components/ui/SeletorIdioma.tsx` (canto inferior direito, `md:hidden`, montado no layout). O menu móvel do header não tem idiomas de propósito. Ambos preservam a página ao trocar (`/en/ementa` → `/es/ementa`).
- Uma bandeira não identifica um idioma para quem usa leitor de ecrã: todos os controlos levam `aria-label` + texto `sr-only` com o nome do idioma (chaves `idiomas.*`). Manter isso em qualquer alteração.

### Secção de ementa na homepage

`src/components/home/EmentaDestaque.tsx` recebe a ementa já resolvida por `obterMenu()` (prop `menu`) — não duplica conteúdo, acompanha sempre a ementa real, incluindo as diárias do dia. Destaca a primeira categoria (a diária) com os preços e liga a `/ementa`.

## Stack

- Next.js 16 (App Router, `src/app/[locale]/...`) + React 19 + TypeScript
- Tailwind CSS v4
- `next-intl` — i18n (routing, proxy, mensagens em `messages/`)
- `@vercel/blob` — armazenamento das diárias em produção
- DeepL (plano gratuito, via `fetch` — sem SDK) — tradução automática das diárias
- `zod` — validação de formulários, do que vem do armazenamento e das respostas do DeepL
- npm

## Skills

As skills estão versionadas no repo em `.agents/skills/` (com symlinks em `.claude/skills/`, geridas via `npx skills` / `skills-lock.json`). Usar por defeito no trabalho de UI:

- **impeccable** — skill orquestradora principal para criar/rever/polir interfaces (sub-comandos: craft, audit, polish, animate, critique...).
- **emil-design-eng** + **animation-vocabulary** / **improve-animations** / **review-animations** — design engineering e qualidade de animações.
- **design-taste-frontend** / **high-end-visual-design** — critérios de bom gosto visual, evitar aspeto genérico de IA.
- **find-skills** — para descobrir e instalar novas skills quando necessário.

Nota: dado que este projeto é para um restaurante simples e económico (não premium), aplicar as skills de gosto visual com bom senso — o objetivo é "acolhedor e credível", não "luxuoso".
