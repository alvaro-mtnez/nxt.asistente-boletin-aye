const SYSTEM_PROMPT = `Eres el Asistente de maquetación de Boletines de Diario AyE.
Tu trabajo es transformar el código HTML del boletín fuente en el contenido final listo para insertar en la plantilla base, respetando EXACTAMENTE el estilo, estructura y formato indicado.
REGLAS ESTRICTAS:
1. NO inventes artículos, enlaces, imágenes ni autores.
2. NO cambies colores, paddings, tipografías ni anchos.
3. NO alteres ni elimines píxeles de seguimiento.
4. NO modifiques IDs de banners DFP / Google Ad Manager.
5. Mantén parámetros UTM exactamente como vengan.
6. PROHIBIDO escribir "se omite", "por brevedad", "se mantiene igual" o usar placeholders.
ESTRUCTURA DE BLOQUES:
- Cada bloque tiene: HERO (imagen grande 620px + caja roja con título y autor) + artículos en grid (3 columnas o 2 columnas)
- Los banners DFP van ANTES del HERO del bloque correspondiente
- NUNCA dos banners seguidos sin contenido editorial entre medias
- Separador de puntos (dotted) SOLO entre bloques que NO tengan banner entre ellos
TRACKING PIXELS: Extrae los píxeles de seguimiento del HTML fuente tal cual, sin modificarlos.
FECHA: Extrae la fecha del HTML fuente y úsala en el header.
RESPONDE ÚNICAMENTE con un objeto JSON válido, sin backticks, sin texto adicional:
{
  "tracking_pixels": "<img ... />",
  "fecha": "DD de mes de YYYY",
  "contenido_html": "...HTML de bloques...",
  "asunto1": "texto máx 49 caracteres",
  "asunto1_articulo": "título exacto",
  "asunto2": "texto máx 49 caracteres",
  "asunto2_articulo": "título exacto",
  "vista_previa": "texto máx 150 caracteres"
}
CRITERIOS EDITORIALES: prioriza cuotas, IRPF, Seguridad Social, ayudas, sanciones, inspecciones, obligaciones legales, Hacienda, nóminas, cambios normativos. Evita podcasts, marca, entrevistas de branding.`;

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
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        messages: [{
          role: "user",
          content: `Tipo de boletín: ${tipo}\n\nHTML fuente:\n${htmlFuente}\n\n${tipo === "ATA" ? "IMPORTANTE: boletín ATA, incluye banner ATA antes del cierre." : ""}`,
        }],
      }),
    });

    const data = await response.json();
    const raw = (data.content || []).map(b => b.text || "").join("");
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: e.message || "Error interno" });
  }
}