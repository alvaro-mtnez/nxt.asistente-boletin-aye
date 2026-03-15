import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <link rel="icon" href="https://www.autonomosyemprendedor.es/media/autonomosyemprendedor/images/2026/03/15/2026031501591061981.jpg" />
        <link rel="apple-touch-icon" href="https://www.autonomosyemprendedor.es/media/autonomosyemprendedor/images/2025/09/03/2025090320300074548.png" />
        <meta name="application-name" content="Maquetador AyE" />
        <meta name="apple-mobile-web-app-title" content="Maquetador AyE" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <title>Maquetador de Boletines · Diario AyE</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
