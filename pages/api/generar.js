const PLANTILLA_BASE = `<!doctype html>
<html lang="es">
  <body style="margin:0; padding:0; background-color:#F4ECE2;">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    {{TRACKING_PIXELS}}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4ECE2; margin:0; padding:0;">
      <tr><td>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px; margin:0 auto;">
            <tr><td style="background-color:#C22D2D; padding:8px 0;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                  <tr>
                    <td width="25%" style="padding-left:15px; vertical-align:middle;">
                      <a href="https://www.autonomosyemprendedor.es/" target="_blank" style="display:block; text-decoration:none; border:0;">
                        <img src="https://www.autonomosyemprendedor.es/media/autonomosyemprendedor/images/2025/09/03/2025090319502622678.png" alt="AyE Economía Real" style="display:block; width:100%; max-width:160px; height:auto; border:0;" />
                      </a>
                    </td>
                    <td width="50%" style="text-align:center; vertical-align:middle; font-family:Arial,sans-serif; color:#FFFFFF; font-size:14px; font-weight:bold; line-height:1.2; padding:0 5px 0 30px;">El medio de los que mueven la economía</td>
                    <td width="25%" style="text-align:right; vertical-align:middle; padding-right:12px; font-family:Arial,sans-serif; color:#FFFFFF; font-size:13px; line-height:1.2;">{{FECHA}}</td>
                  </tr>
                </table>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px; margin:0 auto; padding:20px 0 0;">
            <tr><td style="font-family:Arial,sans-serif; text-align:center; padding-bottom:10px;">
                <span style="font-size:72px; font-weight:bold; color:#C22D2D; line-height:1; margin-right:16px;">Esta</span>
                <span style="font-size:72px; font-weight:bold; color:#31312F; line-height:1;">semana…</span>
            </td></tr>
            <tr><td style="border-bottom:4px dotted #C22D2D; font-size:0; line-height:0;">&nbsp;</td></tr>
          </table>
          <table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" style="width:620px; max-width:620px; margin:0 auto; background-color:#F4ECE2; font-family:Arial, Helvetica, sans-serif; border:0;">
            <tr><td style="font-size:0; line-height:0; height:18px;">&nbsp;</td></tr>

            <!-- BLOQUE 1: HERO (imagen 620px ancho completo + caja roja con título y autor) + GRID 3 columnas -->
            <tr><td style="padding:0 10px 18px 10px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr><td align="center" style="padding:0;">
                      <a href="[URL_ARTICULO_HERO_1]" target="_blank" style="text-decoration:none; border:0;">
                        <img src="[IMG_HERO_1_770x430]" alt="[TITULO_HERO_1]" width="620" style="display:block; width:100%; max-width:620px; height:auto; border:0; border-radius:8px;" />
                      </a>
                  </td></tr>
                  <tr><td style="background-color:#AE191A; padding:14px 14px 12px 14px;">
                      <a href="[URL_ARTICULO_HERO_1]" target="_blank" style="color:#FFFFFF; text-decoration:none; display:block; font-size:18px; font-weight:bold; line-height:1.25;">[TITULO_HERO_1]</a>
                      <div style="margin-top:6px; font-size:12px; color:#FFFFFF; text-transform:uppercase;">[AUTOR_HERO_1]</div>
                  </td></tr>
                </table>
            </td></tr>
            <!-- GRID 3 columnas (cada columna: imagen thumbnail 200px + título + autor) -->
            <tr><td style="padding:0 10px 10px 10px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="33.33%" valign="top" style="padding:0 5px 0 0;">[ARTICULO_COL_1]</td>
                    <td width="33.33%" valign="top" style="padding:0 5px;">[ARTICULO_COL_2]</td>
                    <td width="33.33%" valign="top" style="padding:0 0 0 5px;">[ARTICULO_COL_3]</td>
                  </tr>
                </table>
            </td></tr>

            <tr><td style="font-size:0; line-height:0; height:18px;">&nbsp;</td></tr>

            <!-- BANNER DFP (antes del siguiente bloque) -->
            <tr><td align="center" style="padding:0 10px 10px 10px;">
                <a target="_blank" href="[URL_CLICK_BANNER]" style="text-decoration:none; border:0;">
                  <img alt="" src="[URL_IMG_BANNER]" width="600" style="display:block; width:100%; max-width:600px; height:auto; border:0;" />
                </a>
            </td></tr>

            <!-- BLOQUE 2: HERO + 2 columnas -->
            <tr><td style="padding:0 10px 18px 10px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr><td align="center" style="padding:0;">
                      <a href="[URL_ARTICULO_HERO_2]" target="_blank" style="text-decoration:none; border:0;">
                        <img src="[IMG_HERO_2_770x430]" alt="[TITULO_HERO_2]" width="620" style="display:block; width:100%; max-width:620px; height:auto; border:0; border-radius:8px;" />
                      </a>
                  </td></tr>
                  <tr><td style="background-color:#AE191A; padding:14px 14px 12px 14px;">
                      <a href="[URL_ARTICULO_HERO_2]" target="_blank" style="color:#FFFFFF; text-decoration:none; display:block; font-size:18px; font-weight:bold; line-height:1.25;">[TITULO_HERO_2]</a>
                      <div style="margin-top:6px; font-size:12px; color:#FFFFFF; text-transform:uppercase;">[AUTOR_HERO_2]</div>
                  </td></tr>
                </table>
            </td></tr>
            <!-- 2 columnas -->
            <tr><td style="padding:0 10px 10px 10px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="50%" valign="top" style="padding:0 5px 0 0;">[ARTICULO_2COL_1]</td>
                    <td width="50%" valign="top" style="padding:0 0 0 5px;">[ARTICULO_2COL_2]</td>
                  </tr>
                </table>
            </td></tr>

            <tr><td style="font-size:0; line-height:0; height:18px;">&nbsp;</td></tr>

            <!-- SEPARADOR DOTTED (solo si NO hay banner entre bloques) -->
            <tr><td style="padding:10px 0;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr><td style="border-bottom:4px dotted #C22D2D; font-size:0; line-height:0;">&nbsp;</td></tr>
                </table>
            </td></tr>

            <!-- BLOQUE N: se repite el mismo patrón BANNER + HERO + grid -->

            <!-- PIXEL IMPRESIONES 1x1 -->
            <tr><td align="center" style="padding:10px;">
                <a href="https://pubads.g.doubleclick.net/gampad/jump?iu=/21634166200/newsletter_impressions&sz=1x1&c=1607023636" target="_blank" style="text-decoration:none; border:0;">
                  <img alt="" src="https://pubads.g.doubleclick.net/gampad/ad?iu=/21634166200/newsletter_impressions&sz=1x1&c=1607023636" style="display:block; width:1px; height:1px; border:0;" />
                </a>
            </td></tr>

            <!-- CIERRE -->
            <tr><td align="center" style="padding:18px 10px 8px 10px;">
                <div style="font-weight:bold; font-size:18px; color:#AE191A; font-family:Arial, Helvetica, sans-serif;">Diario AyE | Donde se informan los que mueven la economía</div>
                <div style="margin-top:4px; font-size:12px; color:#777777; font-family:Arial, Helvetica, sans-serif;">Actualidad económica, consejos prácticos, entrevistas… para pymes y autónomos.</div>
            </td></tr>
          </table>
      </td></tr>
    </table>
  </body>
</html>`;

const SYSTEM_PROMPT = `Eres el Asistente de maquetación de Boletines de Diario AyE.

Tu trabajo es tomar el HTML fuente del boletín semanal y recomponerlo usando EXACTAMENTE la estructura de la plantilla base que se te proporciona más abajo.

== PLANTILLA BASE ==
${PLANTILLA_BASE}
== FIN PLANTILLA BASE ==

REGLAS CRÍTICAS DE ESTRUCTURA:
1. El HERO de cada bloque es SIEMPRE el artículo principal del bloque en el HTML fuente: imagen grande (zoomcrop,770,430), caja roja (#AE191A) con título en blanco y autor.
2. Las imágenes HERO usan siempre: width="620" style="display:block; width:100%; max-width:620px; height:auto; border:0; border-radius:8px;"
3. Las imágenes de grid usan siempre: width="200" (3 cols) o width="300" (2 cols), style="display:block; width:100%; height:auto; border:0; border-radius:8px;"
4. Los banners DFP van SIEMPRE antes del HERO del bloque, nunca entre artículos del grid.
5. NUNCA pongas dos banners seguidos sin contenido editorial entre medias.
6. El separador dotted (#C22D2D, 4px) va SOLO entre bloques que NO tienen banner entre ellos.
7. NO inventes artículos, imágenes, URLs ni autores. Usa EXACTAMENTE los del HTML fuente.
8. NO cambies colores, paddings ni estilos.
9. NO alteres píxeles de seguimiento ni IDs de banners DFP.
10. Mantén UTMs exactamente como vengan.
11. PROHIBIDO "se omite", "por brevedad", placeholders o fragmentos incompletos.

TRACKING PIXELS: Extrae los 5 píxeles <img> de seguimiento del HTML fuente tal cual.
FECHA: Extrae la fecha del encabezado del HTML fuente (ej: "12 de marzo de 2026").

RESPONDE ÚNICAMENTE con un objeto JSON válido, sin backticks, sin texto extra:
{
  "tracking_pixels": "<img .../><img .../><img .../><img .../><img .../>",
  "fecha": "DD de mes de YYYY",
  "contenido_html": "...HTML completo de todos los bloques, banners, separadores y pixel de impresiones...",
  "asunto1": "texto máx 49 caracteres",
  "asunto1_articulo": "título exacto del artículo",
  "asunto2": "texto máx 49 caracteres",
  "asunto2_articulo": "título exacto del artículo",
  "vista_previa": "texto máx 150 caracteres"
}

CRITERIOS EDITORIALES para asuntos: prioriza IVA, cuotas, IRPF, Seguridad Social, ayudas, sanciones, inspecciones, Hacienda, nóminas, cambios normativos, Verifactu. Evita podcasts, entrevistas de branding, artículos de salud o lifestyle.`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { tipo, htmlFuente } = req.body;
  if (!tipo || !htmlFuente) return res.status(400).json({ error: "Faltan parámetros" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 16000,
        system: SYSTEM_PROMPT,
        messages: [{
          role: "user",
          content: `Tipo de boletín: ${tipo}\n\n${tipo === "ATA" ? "IMPORTANTE: Es boletín ATA. Añade el banner ATA (https://autonomosyemprendedor.opennemas.com/media/autonomosyemprendedor/images/2023/03/23/2023032311395220745.jpg enlazando a https://ata.es/convenios/) justo antes del bloque de cierre.\n\n" : ""}HTML fuente del boletín:\n${htmlFuente}`,
        }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic error:", JSON.stringify(data));
      return res.status(500).json({ error: data?.error?.message || "Error de Anthropic" });
    }

    const raw = (data.content || []).map(b => b.text || "").join("");
    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch (e) {
      console.error("JSON parse error. Raw:", raw.substring(0, 500));
      return res.status(500).json({ error: "La IA no devolvió JSON válido. Inténtalo de nuevo." });
    }

    return res.status(200).json(parsed);
  } catch (e) {
    console.error("Handler error:", e.message);
    return res.status(500).json({ error: e.message || "Error interno" });
  }
}
