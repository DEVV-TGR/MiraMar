# Mira Mar

Site do Restaurante Mira Mar (Angeiras/Lavra, Matosinhos): landing page institucional + ementa digital acessível por QR code. Ver [`AGENTS.md`](./AGENTS.md) para o contexto completo do projeto e do negócio.

> Projeto em fase de organização de base — design visual e páginas ainda por definir.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- npm

## Desenvolvimento

```bash
npm install
cp .env.example .env.local   # preencher ADMIN_PASSWORD e ADMIN_SESSION_SECRET
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

A área onde o restaurante escreve as diárias do dia está em
[http://localhost:3000/admin](http://localhost:3000/admin). Em desenvolvimento as
diárias são guardadas em `.data/diarias.json` (não versionado) — não é preciso
configurar armazenamento nem chave de tradução para trabalhar no site.

A tradução das diárias para EN/FR/ES usa o **plano gratuito do DeepL**
(`DEEPL_API_KEY`), escolhido para o restaurante não ficar com despesa recorrente:
quando a quota acaba, bloqueia com erro em vez de cobrar. Os pratos portugueses
que a tradução automática estraga estão curados à mão em
`src/lib/dicionario-pratos.ts` — é aí que se acrescenta um prato mal traduzido.

Outros comandos:

```bash
npm run build   # build de produção
npm run lint    # eslint
```
                