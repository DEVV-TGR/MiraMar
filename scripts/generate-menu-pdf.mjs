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
import { Document, Page, View, Text, StyleSheet, renderToFile } from "@react-pdf/renderer";
import menu from "../src/data/menu.json" with { type: "json" };
import restaurante from "../src/data/restaurante.json" with { type: "json" };

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
    padding: 36,
    fontFamily: "Helvetica",
    color: cor.ink,
  },
  cabecalho: { marginBottom: 14, alignItems: "center" },
  nome: { fontFamily: "Times-Bold", fontSize: 26, color: cor.sea },
  tagline: { fontFamily: "Times-Italic", fontSize: 10.5, color: cor.gold, marginTop: 3 },
  moradaLinha: { fontSize: 8, color: cor.muted, marginTop: 6 },
  hairline: { height: 1.2, backgroundColor: cor.gold, opacity: 0.5, marginVertical: 12 },
  colunas: { flexDirection: "row", gap: 28 },
  coluna: { flex: 1 },
  categoria: { marginBottom: 11 },
  categoriaTitulo: {
    fontFamily: "Times-Bold",
    fontSize: 11,
    color: cor.goldDeep,
    textTransform: "uppercase",
    letterSpacing: 1.3,
    marginBottom: 5,
  },
  prato: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 2.5,
    borderBottomWidth: 0.5,
    borderBottomColor: cor.linha,
  },
  pratoTexto: { flexDirection: "column", flex: 1, paddingRight: 10 },
  pratoNome: { fontFamily: "Helvetica-Bold", fontSize: 9 },
  pratoDescricao: { fontFamily: "Helvetica-Oblique", fontSize: 7.5, color: cor.muted, marginTop: 1 },
  pratoPreco: { fontFamily: "Helvetica-Bold", fontSize: 9, color: cor.goldDeep },
  rodape: { marginTop: 16, alignItems: "center" },
  rodapeTexto: { fontSize: 8, color: cor.muted, textAlign: "center" },
  notaRascunho: {
    fontSize: 7.5,
    color: "#b23b3b",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "Helvetica-Oblique",
  },
});

function Prato({ prato }) {
  return React.createElement(
    View,
    { style: styles.prato },
    React.createElement(
      View,
      { style: styles.pratoTexto },
      React.createElement(Text, { style: styles.pratoNome }, prato.nome),
      prato.descricao ? React.createElement(Text, { style: styles.pratoDescricao }, prato.descricao) : null,
    ),
    React.createElement(Text, { style: styles.pratoPreco }, prato.preco),
  );
}

function Categoria({ categoria }) {
  return React.createElement(
    View,
    { style: styles.categoria, wrap: false },
    React.createElement(Text, { style: styles.categoriaTitulo }, categoria.nome),
    ...categoria.pratos.map((prato) => React.createElement(Prato, { key: prato.nome, prato })),
  );
}

function MenuDocument() {
  const meio = Math.ceil(menu.categorias.length / 2);
  const colunaEsquerda = menu.categorias.slice(0, meio);
  const colunaDireita = menu.categorias.slice(meio);

  return React.createElement(
    Document,
    { title: `Ementa — ${restaurante.nome}` },
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      menu.placeholder
        ? React.createElement(Text, { style: styles.notaRascunho }, "RASCUNHO — pratos e preços por confirmar")
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
      React.createElement(
        View,
        { style: styles.colunas },
        React.createElement(
          View,
          { style: styles.coluna },
          ...colunaEsquerda.map((categoria) => React.createElement(Categoria, { key: categoria.nome, categoria })),
        ),
        React.createElement(
          View,
          { style: styles.coluna },
          ...colunaDireita.map((categoria) => React.createElement(Categoria, { key: categoria.nome, categoria })),
        ),
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
