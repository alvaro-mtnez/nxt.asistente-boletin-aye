const SYSTEM_PROMPT = `Eres el Asistente de extracción de contenido de Boletines de Diario AyE.

Tu trabajo es analizar el HTML fuente del boletín y extraer su contenido estructurado en JSON.
NO generas HTML. Solo extraes datos.

== QUÉ DEBES EXTRAER ==

1. tracking_pixels: los 5 <img> de píxeles de seguimiento de Google Analytics, copiados literalmente.
2. fecha: la fecha del boletín en formato "DD de mes de YYYY" (ej: "12 de marzo de 2026").
3. bloques: array de bloques editoriales. Cada bloque tiene:
   - hero: el artículo principal del bloque (imagen grande zoomcrop,770,430)
     - url: URL completa del artículo (con UTMs)
     - img: URL de la imagen (zoomcrop,770,430)
     - titulo: título del artículo
     - autor: nombre del autor
   - articulos: array de artículos secundarios del bloque (2 o 3)
     - url: URL completa (con UTMs)
     - img: URL thumbnail
     - titulo: título
     - autor: nombre del autor (puede ser vacío)
   - banner_antes: si hay un banner DFP ANTES de este bloque, extrae:
     - url_click: URL del enlace del banner
     - url_img: URL de la imagen del banner
     - alt: texto alt del banner

4. asunto1: texto de máx 49 caracteres para asunto de email
5. asunto1_articulo: título exacto del artículo en que se basa
6. asunto2: texto de máx 49 caracteres
7. asunto2_articulo: título exacto
8. vista_previa: texto de máx 150 caracteres resumen del boletín

== REGLAS ==
- NO inventes datos. Extrae EXACTAMENTE lo que está en el HTML fuente.
- Los banners DFP son los <img> de pubads.g.doubleclick.net con sz=600x90.
- El pixel de impresiones (sz=1x1) NO es un banner, ignóralo en bloques.
- Mantén UTMs exactamente como vengan en las URLs.
- CRITERIOS para asuntos: prioriza IVA, cuotas, IRPF, Seguridad Social, Hacienda, sanciones, inspecciones, cambios normativos, Verifactu. Evita podcasts, entrevistas de branding, lifestyle.

RESPONDE ÚNICAMENTE con JSON válido, sin backticks, sin texto extra:
{
  "tracking_pixels": "<img .../><img .../>...",
  "fecha": "DD de mes de YYYY",
  "bloques": [
    {
      "banner_antes": null,
      "hero": { "url": "...", "img": "...", "titulo": "...", "autor": "..." },
      "articulos": [
        { "url": "...", "img": "...", "titulo": "...", "autor": "..." }
      ]
    }
  ],
  "asunto1": "...",
  "asunto1_articulo": "...",
  "asunto2": "...",
  "asunto2_articulo": "...",
  "vista_previa": "..."
}`;

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
        messages: [{ role: "user", content: `Tipo: ${tipo}\n\nHTML fuente:\n${htmlFuente}` }],
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data?.error?.message || "Error de Anthropic" });

    const raw = (data.content || []).map(b => b.text || "").join("");
    let parsed;
    try { parsed = JSON.parse(raw.replace(/```json|```/g, "").trim()); }
    catch (e) { return res.status(500).json({ error: "JSON inválido. Inténtalo de nuevo." }); }

    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: e.message || "Error interno" });
  }
}
