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
- **A ementa é a real** — transcrita em 2026-07-31 de fotografias da carta e do quadro de take away tiradas no restaurante. `placeholder: false` nos dois ficheiros. Duas coisas ficaram por confirmar com o cliente: o significado de **"t4"/"t1"** nas francesinhas e no cachorro (jargão da casa, provavelmente o tamanho do pão — está literal), e o **robalo**, que está riscado à caneta no Menu 3 mas continua no quadro do take away (mantido no take away).
- **Na reunião de 2026-08-01 apareceu uma terceira ementa**: a do **Pool Bar / esplanada**, que não sabíamos que existia. Tem marca própria ("POOL BAR — Angeiras Orbitur", Instagram [@poolbar.angeirasorbitur](https://www.instagram.com/poolbar.angeirasorbitur/)) e vive no site como a terceira aba das ementas. Transcrita das duas folhas fotografadas da carta — ver a secção das ementas.
- **Fotos**: em 2026-08-04 o cliente entregou as **primeiras fotos reais do espaço** e elas substituíram o stock em todos os sítios onde há foto do sítio — Hero (`entrada-restaurante.jpg`, a fachada vista do jardim), Sobre (`sala-restaurante.jpg`, a sala com o teto de madeira e a parede de pedra), Galeria (`placa-entrada.jpg`, a placa com o nome novo, e `esplanada.jpg`, as mesas com os chapéus). **Isto resolveu o problema de licenciamento do Hero**: a `praia-angeiras.jpg` (fornecida pelo cliente a partir de uma pesquisa na web, sem licença conhecida) saiu do repo e já não há nada por licenciar. Continuam de stock **só os quatro slots de comida e mar** — `peixe-grelhado`, `prato-do-dia`, `sobremesa-casa` e `vista-mar` (Unsplash/Pexels, licença livre para uso comercial, sem atribuição): **não são pratos do Mira Mar** e continuam à espera de fotos reais.
  - `ImagemPlaceholder` (`src/components/ui/ImagemPlaceholder.tsx`) aceita uma prop `src` opcional: com `src` mostra a foto, sem `src` mostra a caixa placeholder (nunca quebra se faltar alguma imagem). Para trocar um dos slots que faltam, basta **substituir o ficheiro em `public/fotos/` mantendo o nome** — os componentes já apontam para os caminhos certos.
  - ⚠️ **As fotos reais chegaram a 768×1024** (redimensionadas por partilha de telemóvel). Chega para a Galeria e para o Sobre, mas o Hero é servido a `sizes="100vw"` e num portátil está a esticar 768 px para ~1440: **pedir ao cliente o original da fachada** e trocar o ficheiro é a melhoria de qualidade mais barata que este site tem por fazer.
  - São todas retrato 3:4 e nenhuma vem cortada do repo: o enquadramento de cada sítio é feito pelo `object-cover` conforme o ecrã, e o crop de desktop do Hero foi escolhido por isso (a fachada fica ao centro e o título cai sobre a relva, que é a zona mais clara). Ao trocar a foto do Hero, confirmar que a faixa central continua clara — é o que faz o `.titulo-destaque` ler.

## Âmbito do produto

- **Landing page** (`/{locale}`) — página única com secções: Hero, Sobre, Galeria (placeholder), Localização (mapa embutido do Google Maps), Contactos & Horário.
- **Três ementas**, todas páginas reais do site e traduzidas nas 4 línguas: a **carta do restaurante** (`/{locale}/ementa`, com botão "Descarregar PDF" — só português, ver abaixo), o **take away** (`/{locale}/take-away`) e a **esplanada / Pool Bar** (`/{locale}/esplanada`). QR code das mesas e o CTA "Ver Ementa" apontam para a carta.
- **Multi-idioma** (PT/EN/FR/ES) — motivado por o restaurante estar dentro de um parque de campismo cheio de turistas estrangeiros. Ver secção própria abaixo.
- **Logótipo no carregamento/transições** — dá "vida" ao site, pedido explicitamente para o mesmo motivo (site visitado por muitos visitantes de fora, primeira impressão importa).
- **SEO local e partilha** — o restaurante é encontrado por pesquisa ("restaurante em Angeiras") e por links partilhados no WhatsApp, não por quem já sabe o nome. Ver secção própria abaixo.

### `NEXT_PUBLIC_SITE_URL` — fonte única do domínio

Quatro coisas têm de concordar sobre qual é o endereço do site: o `metadataBase` (que torna absolutas as imagens de partilha), o `sitemap.xml`, o `robots.txt` e o **QR code impresso**. Todas leem `NEXT_PUBLIC_SITE_URL` — via `src/lib/site.ts` no código, e diretamente do ambiente no `scripts/generate-qr.mjs`, que é Node e não importa TypeScript.

> ⚠️ **O domínio final ainda não está decidido.** Por defeito assume-se o subdomínio de demonstração da Vercel. Enquanto for esse o valor, **não mandar imprimir QR codes** — vão para as mesas plastificados e o endereço vai morrer. O `menu:qr` imprime a URL que gerou e avisa em maiúsculas quando está no valor provisório; é de propósito, para ser impossível gerar sem reparar.

### Multi-idioma (`next-intl`)

- Locales: `pt` (default, sem prefixo no URL — `/`, `/ementa`), `en`, `fr`, `es` (`/en`, `/fr`, `/es`, `/en/ementa`...). Configurado em `src/i18n/routing.ts`.
- `src/proxy.ts` (o Next 16 renomeou `middleware.ts` → `proxy.ts`) deteta o idioma do browser automaticamente na primeira visita (`Accept-Language`); um seletor no `Header` permite trocar a qualquer momento (fica guardado em cookie). **Não há ecrã de escolha bloqueante** — decisão do cliente, para não gerar fricção com turistas.
- Todo o copy da UI está em `messages/{pt,en,fr,es}.json`, usado via `useTranslations()` nos componentes. **As traduções EN/FR/ES foram feitas por mim (Claude)** — boas o suficiente para mostrar ao cliente, mas tal como o resto do conteúdo placeholder, vale a pena um nativo rever antes de publicar a sério.
- As ementas (`src/data/menu.json`, `src/data/takeaway.json`, `src/data/esplanada.json`) seguem o mesmo princípio: cada `nome`/`descricao` é um objeto `{ pt, en, fr, es }`; `preco` é universal (€, não convertido por idioma).
- Ao adicionar novo copy: criar a chave nas 4 mensagens, nunca só em português — o build não falha se faltar uma chave nalgum idioma, mas o texto aparece a menos noutras línguas.

### As três ementas: carta do restaurante + take away + esplanada/Pool Bar

O restaurante trabalha por **menus de preço fixo**, não por pratos com preço individual: "Menu 2 — 9,00 €" e por baixo cinco pratos à escolha, todos ao mesmo preço. O take away é o contrário — cada prato tem o seu preço, e a maioria tem dois (dose e meia dose). Daí a forma dos tipos em `src/lib/menu-types.ts`, onde **tudo o que é preço é opcional**:

- `CategoriaMenu.preco` — preço do menu inteiro ("7,50 €"). É o que a carta usa.
- `PratoMenu.preco` — preço do prato. É o que o take away usa. Na carta fica vazio: repetir "9,00 €" em cinco linhas seguidas só suja a ementa.
- `PratoMenu.precoDose` — **só take away**: quando existe, é a dose (para partilhar) e o `preco` passa a ser a meia dose. Quando não existe, `preco` é o preço único.
- `Menu.incluido` — o bloco de texto no topo ("todos os menus incluem pão, sopa…").
- `CategoriaMenu.diasSemana` — dias em que o menu é servido (0 = domingo, como `Date.getDay()`). Ausente, que é o caso normal, quer dizer todos os dias. Ver a secção seguinte.

**O Menu 6 (leitão, 25,00 €) só se serve ao domingo.** É o único uso de `diasSemana` (`[0]`) e funciona assim:

- **O filtro vive só em `obterMenu()`** (`src/lib/menu.ts`), que é por onde toda a app lê a carta — a página `/ementa`, a homepage e o `ListaEmenta` não sabem que isto existe. O dia vem de `diaSemanaEmLisboa()` (`src/lib/data-lisboa.ts`), **nunca de `Date.getDay()`**: a Vercel corre em UTC e no verão o domingo começaria e acabaria uma hora fora de horas.
- **Uma categoria com `diasSemana` nunca pode ser a primeira do `menu.json`** — nos dias em que não fosse servida, o contrato "`categorias[0]` é a diária" passava o lugar do Menu 1 para outro menu. O Menu 6 está no fim do array.
- Na homepage, o `EmentaDestaque` separa estas categorias da fila "Menu 2 · Menu 3 · …" e dá-lhes uma caixa própria — aparecer e desaparecer no meio da linha sem explicação parecia um erro. É uma caixa **de contorno**, não de fundo cheio como a da diária: duas caixas douradas iguais tiravam destaque ao Menu 1, que é o que traz a maioria dos clientes. O aviso ("Só aos domingos") sai da `descricao` da categoria, já traduzida — não há chave nova em `messages/*.json`.
- **O PDF mostra o Menu 6 todos os dias**, com a nota "Só aos domingos" impressa (decisão do cliente). É por isso que a restrição tem de estar escrita na `descricao` e não só no `diasSemana`: o PDF é estático e não tem lógica de dia.
- **Na viragem de sábado para domingo há um atraso.** As páginas públicas têm `revalidate = 300` (ISR, semântica stale-while-revalidate): o primeiro pedido depois de a página expirar ainda recebe a versão antiga e só dispara a regeneração; do segundo visitante em diante está certo. É aceite de propósito — a viragem é às 00:00, com o restaurante fechado (abre às 08:00), e tornar as páginas dinâmicas deitava fora a renderização estática do site inteiro por causa de uma categoria. Se um dia incomodar, baixar o `revalidate` destas páginas, não passar a dinâmico.

**A esplanada / Pool Bar (`/esplanada`) é serviço ao balcão** — e isso tem de estar dito, porque as outras duas não são: na carta do restaurante serve-se à mesa e no take away encomenda-se por telefone.

- A frase vive no **`incluido` do `esplanada.json`** ("os pedidos fazem-se e levantam-se no balcão"), que é o bloco que o `ListaEmenta` já renderiza no topo — não foi preciso componente nem chave nova. Pelo mesmo motivo, a página **não tem botão de telefone** como o take away: seria contradizer-se. Só "Voltar ao início".
- **Não há lógica de época, de propósito.** A esplanada serve esta carta todo o ano; o que fecha fora do verão é o balcão da piscina. Isso é uma diferença de sítio, não de ementa, e está resolvida na mesma frase do `incluido` ("na esplanada todo o ano; no Pool Bar da piscina em julho e agosto"). Não replicar aqui o mecanismo `diasSemana` do Menu 6 — não é o mesmo problema.
- Ordem das dez categorias pelo ritmo do dia (pastelaria e cafetaria → comida → sumos, cervejas e drinks), não pela ordem das duas folhas da carta física.
- **Só a comida tem preços.** Na carta impressa, os preços da comida estão escritos à mão a azul e o resto da folha tem só o símbolo `€`. As categorias sem preço levam `descricao: "Preços afixados no balcão"` (nas 4 línguas) e os pratos ficam sem campo `preco` — o `ListaEmenta` já lida com isso, porque `PratoMenu.preco` sempre foi opcional.
- **Termos de café e cerveja portugueses são explicados, não traduzidos à letra** (*pingo* → "espresso with a dash of milk", *abatanado* → "long black coffee", *fino* → "small draught beer", *diesel* → "beer with cola"). Um turista não sabe o que é um pingo, e é para ele que existem as 4 línguas. Marcas ficam intactas: Panike, Agros, Compal, Somersby, Aperol, Favaios, Martini.
- Esta ementa **não passa pelo `dicionario-pratos.ts`** — o dicionário só serve as diárias escritas no `/admin`, e nada disto roda no Menu 1. Não vale a pena inchá-lo com croissants.
- **Por confirmar com o cliente** (como o "t4"/"t1" da carta): (1) **os preços de toda a pastelaria, cafetaria, sumos, cervejas, drinks e acompanhamentos** — a folha impressa não os traz e os dos acompanhamentos estão escritos à mão de lado, ilegíveis na fotografia; (2) **"Caneca preta" aparece duas vezes** na lista das cervejas, erro de impressão da carta — ficou uma só; (3) **"Compais"** está escrito como **Compal**, que é quase de certeza o que é; (4) "Lanches" e "Panike misto" ficaram na leitura mais comum (pão de lanche recheado; queijo e fiambre); (5) há um rabisco a azul ("Copo") por cima da imagem dos drinks que não se percebe — ignorado.

Ficheiros e rotas:

- `src/data/menu.json` → `/{locale}/ementa`, via `obterMenu()`. **Exceção: o Menu 1 (7,50 €).** Esse muda todos os dias, é editado pelo restaurante em `/admin` e substitui os pratos da primeira categoria em tempo de execução (ver secção própria abaixo); o que está no `menu.json` é só o texto genérico de reserva.
- `src/data/takeaway.json` → `/{locale}/take-away`, via `obterTakeAway()`. Inteiramente estático: não tem diária, não passa pelo `/admin`, não precisa de `revalidate`.
- `src/data/esplanada.json` → `/{locale}/esplanada`, via `obterEsplanada()`. Estático pelos mesmos motivos do take away.
- `src/components/ementa/ListaEmenta.tsx` renderiza as três (recebe um `Menu`), e `AlternadorEmenta.tsx` são as tabs "Carta Restaurante | Take Away | Esplanada / Pool Bar" no topo das três. **Páginas separadas de propósito** — são coisas diferentes e não se misturam numa lista só; as tabs é que tornam a passagem imediata. Com a terceira aba os separadores apertam abaixo do `sm` (`px-3.5`, `text-[0.8125rem]`) e o contentor ganhou `flex-wrap`: "Carta Restaurante" já não cabia a `px-5` num telemóvel estreito. O Hero manteve os dois botões (um terceiro desfazia a hierarquia já acordada) e o `Header` ficou inalterado (acrescentar mais um link desequilibrava a grelha de 3 colunas que mantém o logo centrado).
- **As categorias minimizam-se** (`src/components/ementa/AcordeaoEmenta.tsx`), nas três ementas: cada cabeçalho alterna a sua, e um botão no topo minimiza ou mostra tudo. As ementas são compridas — a esplanada tem dez categorias e 73 itens. **Começam todas abertas de propósito**: lê-se como uma carta em papel e quem scaneia o QR na mesa vê logo os pratos; minimizar é a exceção. Três coisas a preservar: (1) o estado vive todo no pai `AcordeaoEmenta` (guarda-se o que está **fechado**), por isso o botão global não precisa que as categorias lhe reportem nada; (2) o `button` vai **dentro** do `h2` — um `button` não pode conter um título e a ementa tem de manter a estrutura de cabeçalhos; (3) o conteúdo **nunca sai do DOM**, só encolhe em altura — **não trocar por `AnimatePresence`**: é o que faz o Ctrl+F do browser encontrar um prato dentro de uma categoria minimizada e o HTML servido continuar completo. Quem trata do teclado e dos leitores de ecrã é o `inert={!aberta}`.
- **Qualquer rota de ementa tem de entrar na regex `ESTA_NUMA_EMENTA` do `src/components/ui/TransicaoRota.tsx`** — é o que impede o ecrã do logótipo de tapar a troca de aba, que deve ser um deslize da pastilha e não um carregamento de página. E o eyebrow/título de cada aba sai do mapa `NAMESPACES` em `CabecalhoEmenta.tsx` (era um booleano quando havia só duas ementas; com três, o `else` dava o título da carta a tudo o resto).
- `npm run menu:pdf` gera `public/mira-mar-menu.pdf` via `@react-pdf/renderer` (`scripts/generate-menu-pdf.mjs`) — **só a carta do restaurante e só em português** (decisão do cliente: manter o PDF como download opcional, não vale a pena gerar 4 PDFs traduzidos). O take away vive só na web. Uma coluna, não duas: com seis menus, duas colunas deixavam meia página em branco. **Cabe numa página A4, mas à justa** — o Menu 6 obrigou a apertar margens. Como as categorias têm `wrap: false`, quando transborda não parte a lista: manda um menu inteiro para a página 2. Ao acrescentar pratos, correr o script e confirmar que continua a dar uma página só.
  > ⚠️ Nas fontes standard do PDF o glifo `€` tem a largura errada e **come o espaço a seguir** ("1,00 €e sobremesa"). Ao escrever texto corrido no `menu.json`, deixar sempre o `€` no fim da frase.
- `npm run menu:qr` gera `public/qr/mira-mar-menu-qr.png` via `qrcode` (`scripts/generate-qr.mjs`), a apontar para a página `/ementa` (não para o PDF — e daí chega-se ao take away pelas tabs). **Antes de imprimir os QR codes definitivos**: atualizar `MENU_URL` no script para o domínio final (atualmente placeholder Vercel).

### Diárias editáveis pelo cliente (`/admin`)

O restaurante muda as diárias todos os dias e não pode depender de nós para isso. `/admin` é a página onde os funcionários as escrevem — pensada para telemóvel, que é o que têm na mão na cozinha.

- **Fluxo**: `/admin/entrar` (palavra-passe) → `/admin` (editor) → grava → o site atualiza-se sozinho. `src/lib/menu.ts` (`obterMenu()`) junta as diárias gravadas ao `menu.json`, substituindo os pratos da **primeira categoria** — que é o **Menu 1, 7,50 €**. Todos os consumidores passam por aí, por isso o contrato "categorias[0] é a diária" continua a valer. O take away não passa por aqui.
- **O preço por prato é opcional.** Os três pratos do Menu 1 partilham o preço do menu (`categorias[0].preco` no `menu.json`); obrigar a escrever "7,50 €" três vezes por dia num telemóvel só gera enganos. O campo continua no formulário, vazio, para o caso raro de um prato ter preço próprio.
- **Expiram ao fim do dia** (`src/lib/data-lisboa.ts`, fuso `Europe/Lisbon`): se as diárias guardadas não forem de hoje, o site volta ao texto genérico "pergunte ao empregado". Os funcionários esquecem-se de apagar, e mostrar o peixe de ontem é pior do que não mostrar nada. Cuidado ao mexer nisto: a Vercel corre em UTC.
- **Armazenamento** (`src/lib/diarias-store.ts`): Vercel Blob em produção (o sistema de ficheiros é só-leitura lá), ficheiro `.data/diarias.json` em desenvolvimento. O driver é escolhido pela presença de `BLOB_READ_WRITE_TOKEN` — em dev não é preciso configurar nada. Trocar de fornecedor é mexer só neste ficheiro.
- **Revalidação**: a leitura está em `unstable_cache` com a tag `diarias`; a server action chama **`updateTag("diarias")`**. Não trocar por `revalidateTag(tag, "max")` — testámos e esse tem semântica stale-while-revalidate: quem grava e vai logo ver o site ainda apanha a versão antiga na primeira visita. As páginas públicas têm `revalidate = 300` como rede de segurança para a viragem do dia.
- **Tradução automática** (`src/lib/traduzir.ts`): ao gravar, os pratos novos (ou cujo português mudou) são traduzidos para EN/FR/ES. Duas fontes, por esta ordem: (1) `src/lib/dicionario-pratos.ts`, uma lista curada à mão dos pratos portugueses que qualquer tradutor automático estraga — "arroz de cabidela", "iscas com elas", "carapau" (que sai "mackerel", que é cavala), "raia" (que sai "stripe"), "cachorro" (que sai "dog"); (2) **DeepL** para o resto, incluindo as descrições, que são texto corrido. **Nunca bloqueia a gravação**: se a API falhar ou faltar a chave, os nomes que estão no dicionário aparecem traduzidos à mesma (não precisam de rede), o resto fica em português, avisa no ecrã e o funcionário escreve à mão. Uma tradução corrigida à mão fica marcada como boa e não é sobrescrita na gravação seguinte.
- **Porquê DeepL e não um modelo de linguagem**: um modelo traduz melhor os nomes de pratos, mas custa ~1 €/mês e obriga a carregar saldo. **O restaurante não pode ter despesa recorrente** — nem uma fatura pequena, nem um cartão numa conta que expira daqui a dois anos e faz as traduções deixarem de funcionar em silêncio. O plano gratuito do DeepL **bloqueia com erro quando a quota acaba, não passa a cobrar**; é essa garantia que interessa, mais do que ser barato. Ao volume deste site (3 pratos × 3 línguas, uma ou duas gravações por dia) fica-se abaixo de 10% da quota gratuita, e os pratos que estão no dicionário nem chegam a gastar quota. O dicionário é o que compensa a diferença de qualidade — **quando aparecer um prato mal traduzido, a correção é acrescentar uma entrada lá, não trocar de serviço.** Todos os pratos das duas ementas já lá estão: como o Menu 1 roda entre eles, na prática a diária sai traduzida sem sequer tocar na rede.
- **Autenticação** (`src/lib/auth.ts`): uma palavra-passe partilhada (`ADMIN_PASSWORD`) e um cookie assinado com HMAC-SHA256 (`ADMIN_SESSION_SECRET`), 30 dias. É deliberadamente modesto — protege contra alterações acidentais e curiosos, **não** contra um atacante determinado; não há limite de tentativas por IP (em serverless não há contagem fiável em memória), só comparação em tempo constante e um atraso fixo. Se um dia isto crescer, o passo seguinte são contas individuais com hash.
- **Onde se verifica a sessão**: na `page.tsx` e **dentro de cada server action**. Nunca no `layout.tsx` (não re-renderiza em navegações do lado do cliente) e nunca só no `proxy.ts` — as server actions são POSTs alcançáveis diretamente, e `/admin` está de propósito **fora** do matcher do `proxy.ts` (senão o next-intl reescrevia para `/pt/admin` e dava 404).
- **Variáveis de ambiente**: ver `.env.example`. Os ficheiros `.env` são lidos da raiz do projeto, nunca de `src/`.
- O **PDF continua estático e em português** — as diárias são por natureza dinâmicas e não fazem sentido num ficheiro descarregado.

### SEO local, ícones e cartão de partilha

O site esteve funcionalmente completo durante um tempo sem nada disto, e a falta não se via a navegar — via-se ao partilhar o link (retângulo cinzento sem imagem) e ao procurar o restaurante no Google (nada). É a camada que faz o site trabalhar para o restaurante em vez de só existir.

- **Dados estruturados `Restaurant`** (`src/components/seo/DadosEstruturados.tsx`, montado na homepage). É o item de maior retorno: dá ao Google o horário, o telefone, a morada e a ementa para mostrar nos resultados e no mapa. Sai todo do `restaurante.json` — **não acrescentar conteúdo aqui**, se algo estiver errado corrige-se lá. Duas escolhas com razão: `priceRange: "€"` (reforça o posicionamento económico, que é o certo) e `containedInPlace: Campground` (o restaurante fica *dentro* do parque de campismo — é o argumento comercial e o schema tem campo próprio). O horário é **extraído** do texto de `horarios[0].horas` em vez de repetido noutro campo: dois sítios com o mesmo horário acabam sempre por divergir. As **coordenadas** (`coordenadas` no `restaurante.json`, 41.2671 / −8.7188) vieram da ficha do Google Maps em 2026-08-02 e alimentam o `geo`; esteve sem elas de propósito enquanto não eram as verdadeiras — pôr o restaurante 200 m ao lado é pior do que não o pôr, e é o mesmo critério a aplicar a qualquer campo deste bloco.

> ⚠️ **O mapa embutido da homepage continua a usar o `mapsQuery`, não as coordenadas.** É a tentação óbvia agora que elas existem, e seria uma regressão: a pesquisa por nome resolve para a *ficha* do restaurante (nome novo, horário, fotografias, avaliações), enquanto um par de coordenadas dá um alfinete anónimo. O `geo` do JSON-LD e o `mapsQuery` do iframe servem coisas diferentes.
- **`hreflang`** — quatro línguas e, até aqui, nada a dizer ao Google que são a mesma página. Vive em `src/lib/metadata.ts`: **qualquer página pública nova tem de chamar `metadataDeRota()`**, tal como tem de entrar na regex `ESTA_NUMA_EMENTA` do `TransicaoRota`. O `openGraph` vai lá dentro inteiro de propósito — os metadados do Next são fundidos *superficialmente*, e uma página que declare `openGraph` **apaga** o do layout em vez de o completar.
- **`sitemap.ts` e `robots.ts`** vivem em `src/app/`, **fora de `[locale]`**: são um por site, não um por idioma. Uma rota nova entra em `ROTAS_PUBLICAS` (`src/lib/site.ts`) e aparece nos dois sozinha, nas quatro línguas.
- **Ícones** (`npm run icons`, `scripts/generate-icons.mjs`) — o ícone **não é o logótipo inteiro**: a 16 px o lockup com "MIRA MAR / RESTAURANTE / SABORES. MAR. MOMENTOS." é uma mancha castanha. É só o medalhão do topo (sol sobre o mar), recortado por comparação a 16/32/48 px. O `apple-icon` é quadrado e opaco (o iOS compõe transparências a preto); os outros são redondos, como no header.
- **Cartão de partilha** (`src/app/[locale]/opengraph-image.tsx`) — gerado por código, um por língua, e **em JPEG**: em PNG dava 1,8 MB e o WhatsApp ignora pré-visualizações grandes. Usa a foto do **peixe grelhado e não a do hero**: escolheu-se assim quando a foto do hero tinha um problema de licença, mas mantém-se por outro motivo — num cartão de WhatsApp a comida convida mais do que uma fachada, e a foto do hero é agora uma real a 768 px, pequena de mais para um cartão de 1200×630. Quando chegar o original da fachada em resolução alta, vale a pena comparar os dois. A Fraunces está versionada em `assets/` — o `next/font` não a serve ao Satori. Duas armadilhas do Satori já pagas: não entende o atalho `inset` nem o atalho `background` (com eles as camadas do véu saem invisíveis).
- **Analytics** (`@vercel/analytics`, montado só no layout público) — para o cliente poder ver se o QR code está a ser usado. **Sem cookies**, por isso não obriga a banner de consentimento; o site não tem nenhum e não deve passar a ter. Plano gratuito, pela mesma regra do DeepL: o restaurante não pode ter despesa recorrente. Se um dia se trocar de ferramenta, tem de continuar a ser sem cookies.

### Logótipo no carregamento e transições

- `src/instrumentation-client.ts` + `src/components/ui/TransicaoRota.tsx` — usa a API estável do Next 16 `onRouterTransitionStart` (sem flags experimentais) para mostrar brevemente o logótipo (`LogoAnel.tsx`, anel dourado a girar) entre navegações (`/` ↔ `/ementa`, trocas de idioma).
- `src/components/ui/Preloader.tsx` — o mesmo logótipo no primeiro carregamento do site.
- Deliberadamente **discreto e rápido** (~700ms/450ms mínimos) — dá vida sem atrasar a navegação nem ficar "espetáculo" de luxo, coerente com o posicionamento simples/económico da marca.

### Design visual (decidido)

Paleta extraída do logótipo real (`public/logo/mira-mar-logo.jpg`): fundo creme quente, tinta escura para texto, dourado quente como destaque/CTA, azul-petróleo profundo ("mar") como cor secundária, verde-oliva como acento pontual — tema claro, definido em `src/app/globals.css`. Tipografia: **Fraunces** (serifada quente, `--font-fraunces`) para títulos + Geist Sans para corpo. Animação de scroll subtil (`src/components/ui/Reveal.tsx`, usa `motion`) + preloader/transições de rota (ver acima).

**Header + Hero — referência e lições aprendidas.** A referência acordada com o cliente é [casadaguripa.pt](https://casadaguripa.pt) (restaurante real em Angeiras, ao lado do Mira Mar).

- **Header** (`src/components/layout/Header.tsx`): logo **ao centro**, links divididos aos dois lados (grelha de 3 colunas para o logo ficar mesmo centrado), botão com contorno + seta à direita ("Ver Ementa" — o equivalente ao "Reservar" deles), e **transparente** sobre a foto do hero. Ganha fundo creme + blur ao fazer scroll, para os links continuarem legíveis sobre as secções seguintes (a referência deixa o header desaparecer, mas nós temos o seletor de idioma lá — importante para turistas — por isso mantém-se acessível).
- **Hero** (`src/components/home/Hero.tsx`): centrado e deliberadamente simples — título, tagline e **os botões das três ementas**, um por cada (carta a dourado, take away e Pool Bar a contorno). Começou com um só botão e cresceu à medida das ementas, por pedido do cliente: as três têm de estar em pé de igualdade na primeira dobra. **Três é o teto** — no telemóvel já obrigou a duas linhas (o principal sozinho, os secundários a dividirem a segunda, via `sm:contents`), e uma quarta ementa deve entrar pelas tabs e não aqui. O botão diz "Pool Bar" nas quatro línguas: é a marca deles e cabe na fila, enquanto "Esplanada / Pool Bar" (o texto da aba) não cabia. Sem logo no corpo (vive no header; repeti-lo punha dois logos iguais no mesmo ecrã). Movimento: zoom lento (Ken Burns) + parallax em scroll (a foto acompanha mais devagar, o texto sobe e desvanece).
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

`src/components/home/EmentaDestaque.tsx` recebe a ementa já resolvida por `obterMenu()` (prop `menu`) — não duplica conteúdo, acompanha sempre a ementa real, incluindo as diárias do dia. Destaca a primeira categoria (o Menu 1) com o preço do menu e liga a `/ementa`. Os restantes menus aparecem em lista com o preço ao lado: só os nomes ("Menu 2 · Menu 3 · …") não diziam nada a ninguém.

## Stack

- Next.js 16 (App Router, `src/app/[locale]/...`) + React 19 + TypeScript
- Tailwind CSS v4
- `next-intl` — i18n (routing, proxy, mensagens em `messages/`)
- `@vercel/blob` — armazenamento das diárias em produção
- DeepL (plano gratuito, via `fetch` — sem SDK) — tradução automática das diárias
- `zod` — validação de formulários, do que vem do armazenamento e das respostas do DeepL
- `sharp` — ícones (`npm run icons`) e compressão do cartão de partilha. **Manter a versão alinhada com a que o Next traz** (`next` → `optionalDependencies.sharp`): duas cópias de versões diferentes carregam duas libvips e o build avisa que pode dar "mysterious crashes".
- `@vercel/analytics` — contagem de visitas, sem cookies
- npm

## Skills

As skills estão versionadas no repo em `.agents/skills/` (com symlinks em `.claude/skills/`, geridas via `npx skills` / `skills-lock.json`). Usar por defeito no trabalho de UI:

- **impeccable** — skill orquestradora principal para criar/rever/polir interfaces (sub-comandos: craft, audit, polish, animate, critique...).
- **emil-design-eng** + **animation-vocabulary** / **improve-animations** / **review-animations** — design engineering e qualidade de animações.
- **design-taste-frontend** / **high-end-visual-design** — critérios de bom gosto visual, evitar aspeto genérico de IA.
- **find-skills** — para descobrir e instalar novas skills quando necessário.

Nota: dado que este projeto é para um restaurante simples e económico (não premium), aplicar as skills de gosto visual com bom senso — o objetivo é "acolhedor e credível", não "luxuoso".
