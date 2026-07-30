import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <html lang="pt-PT">
      <body>
        <div style={{ padding: 40, textAlign: "center", fontFamily: "system-ui" }}>
          <p>Página não encontrada.</p>
          <Link href="/">Voltar ao início</Link>
        </div>
      </body>
    </html>
  );
}
