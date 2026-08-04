import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import sharp from "sharp";
import { routing } from "@/i18n/routing";
import { restaurante } from "@/data/restaurante";

/**
 * Cartão de partilha (Open Graph) — é isto que aparece quando alguém manda o
 * link do restaurante num grupo de WhatsApp, no Facebook ou no Instagram.
 * Sem ele o link ia como um retângulo cinzento sem imagem nem título, e é
 * exatamente assim que este restaurante é divulgado.
 *
 * Gerado por código, e não como ficheiro fixo, por duas razões: acompanha as
 * quatro línguas (o Next chama isto uma vez por locale) e acompanha a foto —
 * quando as fotos reais substituírem as de stock, o cartão atualiza-se sozinho.
 *
 * A foto é a do peixe grelhado e **não** a do hero. Começou por ser uma questão
 * de licença (a foto do hero de então não a tinha); hoje o hero é uma foto real
 * do restaurante, mas fica na mesma o peixe: num cartão de WhatsApp a comida
 * convida mais do que uma fachada, e a foto do hero é pequena (768 px) para os
 * 1200×630 disto. Reavaliar quando chegar o original em resolução alta.
 */

export const size = { width: 1200, height: 630 };
/* JPEG e não PNG: em PNG esta imagem dava 1,8 MB — uma fotografia não comprime
   em formato sem perdas — e o WhatsApp ignora pré-visualizações grandes.
   O `ImageResponse` só sabe produzir PNG, por isso o resultado é reconvertido
   com o sharp antes de sair. */
export const contentType = "image/jpeg";
export const alt = `${restaurante.nome} — ${restaurante.localidade}`;

/* Sem isto o cartão era gerado a pedido: cada partilha nova punha o servidor a
   compor uma imagem de 1200×630. Assim ficam as quatro pré-construídas. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/* A paleta do site vive em oklch() no globals.css, que o Satori não interpreta.
   Estes são os mesmos valores convertidos para sRGB. */
const CREME = "#FAF5EA";
const MAR_FUNDO = "#052739";
const DOURADO = "#D39747";

/** Largura da faixa da fotografia, à direita. O texto ocupa o que sobra. */
const LARGURA_FOTO = 560;

/* O Satori não entende o atalho `inset` nem o atalho `background` — com eles
   as camadas do véu saíam simplesmente invisíveis, com o texto pousado em cima
   da fotografia clara. Daí as propriedades todas escritas por extenso, e
   `backgroundColor`/`backgroundImage` em vez de `background`. */
const CAMADA = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  width: size.width,
  height: size.height,
};

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const [fraunces, medalhao, foto] = await Promise.all([
    readFile(join(process.cwd(), "assets/Fraunces-SemiBold.ttf")),
    readFile(join(process.cwd(), "src/app/icon.png")),
    /* A foto entra já cortada à medida da faixa da direita, em vez de esticada
       por trás do cartão inteiro. Com um véu por cima da largura toda o peixe
       ficava escuro e sem apetite — e uma fotografia de comida que não abre o
       apetite não serve de nada num cartão de restaurante. `position: "right"`
       fica com o lado do prato onde os peixes estão inteiros. */
    sharp(join(process.cwd(), "public/fotos/peixe-grelhado.jpg"))
      .resize(LARGURA_FOTO, size.height, { fit: "cover", position: "right" })
      .jpeg({ quality: 88 })
      .toBuffer(),
  ]);

  const comoDataUri = (dados: Buffer, tipo: string) =>
    `data:${tipo};base64,${dados.toString("base64")}`;

  const png = new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative" }}>
        {/* Painel do texto: azul-mar cheio por baixo de tudo. */}
        <div style={{ ...CAMADA, backgroundColor: MAR_FUNDO }} />

        <img
          src={comoDataUri(foto, "image/jpeg")}
          alt=""
          width={LARGURA_FOTO}
          height={size.height}
          style={{
            position: "absolute",
            top: 0,
            left: size.width - LARGURA_FOTO,
            objectFit: "cover",
          }}
        />

        {/* Passagem esbatida do painel para a foto — um corte a direito no meio
            do prato lia-se como um erro. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: size.width - LARGURA_FOTO,
            width: 180,
            height: size.height,
            backgroundImage:
              "linear-gradient(90deg, rgba(5,39,57,1) 0%," +
              " rgba(5,39,57,0.75) 35%, rgba(5,39,57,0) 100%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            width: size.width - LARGURA_FOTO,
            height: "100%",
            padding: "0 72px",
          }}
        >
          <img
            src={comoDataUri(medalhao, "image/png")}
            alt=""
            width={104}
            height={104}
            style={{ borderRadius: 52 }}
          />

          <div
            style={{
              display: "flex",
              fontFamily: "Fraunces",
              fontSize: 92,
              lineHeight: 1,
              color: CREME,
              marginTop: 30,
              letterSpacing: "-0.015em",
            }}
          >
            {restaurante.nome}
          </div>

          <div
            style={{
              display: "flex",
              width: 96,
              height: 3,
              backgroundColor: DOURADO,
              marginTop: 28,
            }}
          />

          <div
            style={{
              display: "flex",
              fontSize: 31,
              lineHeight: 1.3,
              color: CREME,
              opacity: 0.92,
              marginTop: 30,
            }}
          >
            {t("ogSubtitulo")}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: DOURADO,
              marginTop: 22,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {restaurante.localidade.split(", ").slice(-1)[0]} · {restaurante.horarios[0].horas}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Fraunces", data: fraunces, style: "normal", weight: 600 }],
    },
  );

  const jpeg = await sharp(Buffer.from(await png.arrayBuffer()))
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: { "Content-Type": contentType },
  });
}
