#!/usr/bin/env node
/**
 * Gera public/mira-mar-menu.pdf a partir de src/data/menu.json e
 * src/data/restaurante.json. Corre com `npm run menu:pdf` sempre que a
 * ementa mudar. Usa apenas as 14 fontes standard do PDF (Times/Helvetica) —
 * sem registo de fontes remotas, para o script nunca depender de rede.
 */
import { fileURLToPath } from "node:url";
import path from "node:path";
import React from "react";
import { Document, Page, View, Text, StyleSheet, Font, renderToFile } from "@react-pdf/renderer";
import menu from "../src/data/menu.json" with { type: "json" };
import restaurante from "../src/data/restaurante.json" with { type: "json" };

// Sem hifenização: "molho de cogume-los" partido ao meio numa ementa impressa
// fica com ar de trabalho mal feito. Vale mais a linha quebrar na palavra.
Font.registerHyphenationCallback((palavra) => [palavra]);

/* Cuidado ao escrever texto corrido com "€" no menu.json: nas fontes standard
   do PDF o glifo do euro tem a largura errada e come o espaço a seguir
   ("1,00 €e sobremesa"). Por isso o texto do `incluido` está escrito de forma
   a que o "€" fique sempre no fim da frase. */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "..", "public", "mira-mar-menu.pdf");

const cor = {
  fundo: "#faf5ea",
  ink: "#2b2420",
  muted: "#7a6e5e",
  gold: "#a9762f",
  goldDeep: "#8a5f26",
  sea: "#2c4a58",
  linha: "#ddd0b8",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: cor.fundo,
    paddingHorizontal: 54,
    paddingVertical: 42,
    fontFamily: "Helvetica",
    color: cor.ink,
  },
  cabecalho: { marginBottom: 14, alignItems: "center" },
  nome: { fontFamily: "Times-Bold", fontSize: 34, color: cor.sea },
  tagline: { fontFamily: "Times-Italic", fontSize: 12.5, color: cor.gold, marginTop: 4 },
  moradaLinha: { fontSize: 9, color: cor.muted, marginTop: 8 },
  hairline: { height: 1.2, backgroundColor: cor.gold, opacity: 0.5, marginVertical: 14 },
  // Uma coluna só: a carta são cinco menus de preço fixo com poucas linhas
  // cada um. Em duas colunas sobrava meia página em branco.
  categoria: { marginBottom: 20 },
  categoriaCabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 6,
  },
  categoriaTitulo: {
    fontFamily: "Times-Bold",
    fontSize: 15,
    color: cor.goldDeep,
    textTransform: "uppercase",
    letterSpacing: 1.6,
  },
  categoriaPreco: { fontFamily: "Times-Bold", fontSize: 15, color: cor.goldDeep },
  categoriaDescricao: {
    fontFamily: "Helvetica-Oblique",
    fontSize: 9,
    color: cor.muted,
    marginTop: -4,
    marginBottom: 6,
  },
  incluido: {
    fontSize: 9,
    color: cor.muted,
    textAlign: "center",
    lineHeight: 1.5,
    marginBottom: 18,
  },
  prato: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: cor.linha,
  },
  pratoTexto: { flexDirection: "column", flex: 1, paddingRight: 12 },
  pratoNome: { fontFamily: "Helvetica-Bold", fontSize: 11 },
  pratoDescricao: { fontFamily: "Helvetica-Oblique", fontSize: 9, color: cor.muted, marginTop: 2 },
  pratoPreco: { fontFamily: "Helvetica-Bold", fontSize: 11, color: cor.goldDeep },
  rodape: { marginTop: "auto", alignItems: "center" },
  rodapeTexto: { fontSize: 9, color: cor.muted, textAlign: "center" },
  notaRascunho: {
    fontSize: 8.5,
    color: "#b23b3b",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "Helvetica-Oblique",
  },
});

// O PDF é gerado só em português (ver AGENTS.md) — a ementa completa,
// traduzida nas 4 línguas, vive na página /ementa do site.
function Prato({ prato }) {
  return React.createElement(
    View,
    { style: styles.prato },
    React.createElement(
      View,
      { style: styles.pratoTexto },
      React.createElement(Text, { style: styles.pratoNome }, prato.nome.pt),
      prato.descricao ? React.createElement(Text, { style: styles.pratoDescricao }, prato.descricao.pt) : null,
    ),
    // sem preço próprio o prato herda o do menu, que está no cabeçalho da
    // categoria — não se repete em cada linha
    prato.preco
      ? React.createElement(
          Text,
          { style: styles.pratoPreco },
          prato.precoDose ? `${prato.precoDose} / ${prato.preco}` : prato.preco,
        )
      : null,
  );
}

function Categoria({ categoria }) {
  return React.createElement(
    View,
    { style: styles.categoria, wrap: false },
    React.createElement(
      View,
      { style: styles.categoriaCabecalho },
      React.createElement(Text, { style: styles.categoriaTitulo }, categoria.nome.pt),
      categoria.preco
        ? React.createElement(Text, { style: styles.categoriaPreco }, categoria.preco)
        : null,
    ),
    categoria.descricao
      ? React.createElement(Text, { style: styles.categoriaDescricao }, categoria.descricao.pt)
      : null,
    ...categoria.pratos.map((prato, i) => React.createElement(Prato, { key: i, prato })),
  );
}

function MenuDocument() {
  return React.createElement(
    Document,
    { title: `Ementa — ${restaurante.nome}` },
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      menu.placeholder
        ? React.createElement(Text, { style: styles.notaRascunho }, menu.nota.pt)
        : null,
      React.createElement(
        View,
        { style: styles.cabecalho },
        React.createElement(Text, { style: styles.nome }, restaurante.nome),
        React.createElement(Text, { style: styles.tagline }, restaurante.tagline),
        React.createElement(
          Text,
          { style: styles.moradaLinha },
          `${restaurante.morada}, ${restaurante.localidade} · ${restaurante.telefone}`,
        ),
      ),
      React.createElement(View, { style: styles.hairline }),
      menu.incluido ? React.createElement(Text, { style: styles.incluido }, menu.incluido.pt) : null,
      React.createElement(
        View,
        null,
        ...menu.categorias.map((categoria, i) => React.createElement(Categoria, { key: i, categoria })),
      ),
      React.createElement(
        View,
        { style: styles.rodape },
        React.createElement(View, { style: [styles.hairline, { marginBottom: 10 }] }),
        React.createElement(Text, { style: styles.rodapeTexto }, restaurante.instagram.replace("https://www.", "")),
      ),
    ),
  );
}

await renderToFile(React.createElement(MenuDocument), OUTPUT_PATH);
console.log(`Ementa gerada em ${path.relative(process.cwd(), OUTPUT_PATH)}`);
