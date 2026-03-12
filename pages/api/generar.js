const SYSTEM_PROMPT = `Eres el Asistente de extracción de contenido de Boletines de Diario AyE.

Tu trabajo es analizar el HTML fuente del boletín y extraer sus datos estructurados. NO generas HTML. Solo extraes datos.

EXTRAE:

1. tracking_pixels: los 5 <img> de Google Analytics tal cual, sin modificar
1. fecha: la fecha del encabezado (ej: “12 de marzo de 2026”)
1. bloques: array ordenado con TODOS los bloques del boletín en su orden original

Cada bloque puede ser de tipo “banner”, “hero_grid3”, “hero_grid2”, “hero_solo”, “grid2”, “grid3”, o “separador”.

Para tipo “banner”:
{
“tipo”: “banner”,
“url_click”: “URL del href del enlace”,
“url_img”: “URL del src de la imagen”,
“alt”: “texto alt”
}

Para tipo “hero_grid3” (HERO + 3 artículos en fila):
{
“tipo”: “hero_grid3”,
“hero”: {
“url”: “URL del artículo”,
“img”: “URL imagen zoomcrop,770,430”,
“alt”: “texto alt imagen”,
“titulo”: “título del artículo”,
“autor”: “nombre del autor”
},
“articulos”: [
{ “url”: “…”, “img”: “URL thumbnail,200,112”, “alt”: “…”, “titulo”: “…”, “autor”: “…” },
{ “url”: “…”, “img”: “URL thumbnail,200,112”, “alt”: “…”, “titulo”: “…”, “autor”: “…” },
{ “url”: “…”, “img”: “URL thumbnail,200,112”, “alt”: “…”, “titulo”: “…”, “autor”: “…” }
]
}

Para tipo “hero_grid2” (HERO + 2 artículos en fila):
{
“tipo”: “hero_grid2”,
“hero”: { “url”: “…”, “img”: “…”, “alt”: “…”, “titulo”: “…”, “autor”: “…” },
“articulos”: [
{ “url”: “…”, “img”: “URL thumbnail,200,112”, “alt”: “…”, “titulo”: “…”, “autor”: “…” },
{ “url”: “…”, “img”: “URL thumbnail,200,112”, “alt”: “…”, “titulo”: “…”, “autor”: “…” }
]
}

Para tipo “grid2” (solo 2 artículos sin HERO):
{
“tipo”: “grid2”,
“articulos”: [
{ “url”: “…”, “img”: “…”, “alt”: “…”, “titulo”: “…”, “autor”: “…” },
{ “url”: “…”, “img”: “…”, “alt”: “…”, “titulo”: “…”, “autor”: “…” }
]
}

Para tipo “separador”:
{ “tipo”: “separador” }

REGLAS:

- El orden del array bloques debe reflejar EXACTAMENTE el orden del HTML fuente
- NO inventes datos. Copia URLs, títulos y autores exactamente del HTML fuente
- Mantén los parámetros UTM exactamente como vengan
- NO incluyas el pixel de impresiones 1x1 en los bloques (se añade automáticamente)
- NO incluyas el bloque de cierre en los bloques

ASUNTOS Y VISTA PREVIA:

- asunto1 y asunto2: máx 49 caracteres. Prioriza IVA, cuotas, IRPF, Seguridad Social, Hacienda, sanciones, inspecciones, cambios normativos, Verifactu. Evita podcasts, entrevistas branding, lifestyle.
- vista_previa: máx 150 caracteres, resume el conjunto del boletín

RESPONDE ÚNICAMENTE con JSON válido, sin backticks, sin texto extra:
{
“tracking_pixels”: “<img …/><img …/>…”,
“fecha”: “DD de mes de YYYY”,
“bloques”: […],
“asunto1”: “texto máx 49 chars”,
“asunto1_articulo”: “título exacto”,
“asunto2”: “texto máx 49 chars”,
“asunto2_articulo”: “título exacto”,
“vista_previa”: “texto máx 150 chars”
}`;

// ── Ensamblador HTML ──────────────────────────────────────────────────────────
function renderArticulo3col(a) {
return `<td width="33.33%" valign="top" style="padding:0 5px;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td><a target="_blank" href="${a.url}" style="text-decoration:none; border:0;">
<img alt="${a.alt}" src="${a.img}" width="200" style="display:block; width:100%; height:auto; border:0; border-radius:8px;" />
</a></td></tr>
<tr><td style="padding:10px 0 0 0;">
<a target="_blank" href="${a.url}" style="color:#3D3D3D; text-decoration:none; font-size:15px; font-weight:bold; line-height:1.2; display:block;">${a.titulo}</a>
<div style="margin-top:5px; text-transform:uppercase; color:#777777; font-size:12px;">${a.autor}</div>
</td></tr>
</table></td>`;
}

function renderArticulo2col(a) {
return `<td width="50%" valign="top" style="padding:0 5px;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td><a target="_blank" href="${a.url}" style="text-decoration:none; border:0;">
<img alt="${a.alt}" src="${a.img}" width="300" style="display:block; width:100%; height:auto; border:0; border-radius:8px;" />
</a></td></tr>
<tr><td style="padding:10px 0 0 0;">
<a target="_blank" href="${a.url}" style="color:#3D3D3D; text-decoration:none; font-size:15px; font-weight:bold; line-height:1.2; display:block;">${a.titulo}</a>
<div style="margin-top:5px; text-transform:uppercase; color:#777777; font-size:12px;">${a.autor}</div>
</td></tr>
</table></td>`;
}

function renderHero(h) {
return `<tr><td style="padding:0 10px 18px 10px;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td align="center" style="padding:0;">
<a href="${h.url}" target="_blank" style="text-decoration:none; border:0;">
<img src="${h.img}" alt="${h.alt}" width="620" style="display:block; width:100%; max-width:620px; height:auto; border:0; border-radius:8px;" />
</a></td></tr>
<tr><td style="background-color:#AE191A; padding:14px 14px 12px 14px;">
<a href="${h.url}" target="_blank" style="color:#FFFFFF; text-decoration:none; display:block; font-size:18px; font-weight:bold; line-height:1.25;">${h.titulo}</a>
<div style="margin-top:6px; font-size:12px; color:#FFFFFF; text-transform:uppercase;">${h.autor}</div>
</td></tr>
</table></td></tr>`;
}

function renderGrid3(arts) {
// Asegurar padding correcto en primera y última columna
const cols = arts.map((a, i) => {
const pad = i === 0 ? “padding:0 5px 0 0” : i === arts.length - 1 ? “padding:0 0 0 5px” : “padding:0 5px”;
return `<td width="33.33%" valign="top" style="${pad};">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td><a target="_blank" href="${a.url}" style="text-decoration:none; border:0;">
<img alt="${a.alt}" src="${a.img}" width="200" style="display:block; width:100%; height:auto; border:0; border-radius:8px;" />
</a></td></tr>
<tr><td style="padding:10px 0 0 0;">
<a target="_blank" href="${a.url}" style="color:#3D3D3D; text-decoration:none; font-size:15px; font-weight:bold; line-height:1.2; display:block;">${a.titulo}</a>
<div style="margin-top:5px; text-transform:uppercase; color:#777777; font-size:12px;">${a.autor}</div>
</td></tr>
</table></td>`;
  });
  return `<tr><td style="padding:0 10px 10px 10px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>${cols.join("")}</tr>
</table></td></tr>`;
}

function renderGrid2(arts) {
const cols = arts.map((a, i) => {
const pad = i === 0 ? “padding:0 5px 0 0” : “padding:0 0 0 5px”;
return `<td width="50%" valign="top" style="${pad};">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td><a target="_blank" href="${a.url}" style="text-decoration:none; border:0;">
<img alt="${a.alt}" src="${a.img}" width="300" style="display:block; width:100%; height:auto; border:0; border-radius:8px;" />
</a></td></tr>
<tr><td style="padding:10px 0 0 0;">
<a target="_blank" href="${a.url}" style="color:#3D3D3D; text-decoration:none; font-size:15px; font-weight:bold; line-height:1.2; display:block;">${a.titulo}</a>
<div style="margin-top:5px; text-transform:uppercase; color:#777777; font-size:12px;">${a.autor}</div>
</td></tr>
</table></td>`;
  });
  return `<tr><td style="padding:0 10px 10px 10px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>${cols.join("")}</tr>
</table></td></tr>`;
}

function renderBanner(b) {
return `<tr><td style="font-size:0; line-height:0; height:18px;"> </td></tr>

<tr><td align="center" style="padding:0 10px 10px 10px;">
<a target="_blank" href="${b.url_click}" style="text-decoration:none; border:0;">
<img alt="${b.alt || ""}" src="${b.url_img}" width="600" style="display:block; width:100%; max-width:600px; height:auto; border:0;" />
</a></td></tr>`;
}

function renderSeparador() {
return `<tr><td style="font-size:0; line-height:0; height:18px;"> </td></tr>

<tr><td style="padding:10px 0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="border-bottom:4px dotted #C22D2D; font-size:0; line-height:0;">&nbsp;</td></tr>
</table></td></tr>`;
}

export function buildHtmlFromData(parsed, tipo) {
let contenido = “”;
for (const bloque of (parsed.bloques || [])) {
switch (bloque.tipo) {
case “banner”:
contenido += renderBanner(bloque);
break;
case “hero_grid3”:
contenido += renderHero(bloque.hero);
contenido += renderGrid3(bloque.articulos || []);
break;
case “hero_grid2”:
contenido += renderHero(bloque.hero);
contenido += renderGrid2(bloque.articulos || []);
break;
case “hero_solo”:
contenido += renderHero(bloque.hero);
break;
case “grid2”:
contenido += renderGrid2(bloque.articulos || []);
break;
case “grid3”:
contenido += renderGrid3(bloque.articulos || []);
break;
case “separador”:
contenido += renderSeparador();
break;
}
}

// Spacer final
contenido += `<tr><td style="font-size:0; line-height:0; height:18px;">&nbsp;</td></tr>`;

// Pixel impresiones
contenido += `<tr><td align="center" style="padding:10px;"> <a href="https://pubads.g.doubleclick.net/gampad/jump?iu=/21634166200/newsletter_impressions&sz=1x1&c=1607023636" target="_blank" style="text-decoration:none; border:0;"> <img alt="" src="https://pubads.g.doubleclick.net/gampad/ad?iu=/21634166200/newsletter_impressions&sz=1x1&c=1607023636" style="display:block; width:1px; height:1px; border:0;" /> </a></td></tr>`;

// Banner ATA si aplica
if (tipo === “ATA”) {
contenido += `<tr><td align="center" style="padding:10px;"> <a target="_blank" href="https://ata.es/convenios/" style="text-decoration:none; border:0;"> <img alt="ATA convenios" src="https://autonomosyemprendedor.opennemas.com/media/autonomosyemprendedor/images/2023/03/23/2023032311395220745.jpg" width="600" style="display:block; width:100%; max-width:600px; height:auto; border:0;" /> </a></td></tr>`;
}

return `<!doctype html>

<html lang="es">
<head><meta charset="UTF-8"/></head>
<body style="margin:0; padding:0; background-color:#F4ECE2;">
${parsed.tracking_pixels || ""}
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4ECE2; margin:0; padding:0;">
<tr><td>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px; margin:0 auto;">
<tr><td style="background-color:#C22D2D; padding:8px 0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr>
<td width="25%" style="padding-left:15px; vertical-align:middle;">
<a href="https://www.autonomosyemprendedor.es/" target="_blank" style="display:block; text-decoration:none; border:0;">
<img src="https://www.autonomosyemprendedor.es/media/autonomosyemprendedor/images/2025/06/28/2025062812113336013.png" alt="AyE Economía Real" style="display:block; width:100%; max-width:160px; height:auto; border:0;" /></a></td>
<td width="50%" style="text-align:center; vertical-align:middle; font-family:Arial,sans-serif; color:#FFFFFF; font-size:14px; font-weight:bold; line-height:1.2; padding:0 5px 0 30px;">El medio de los que mueven la economía</td>
<td width="25%" style="text-align:right; vertical-align:middle; padding-right:12px; font-family:Arial,sans-serif; color:#FFFFFF; font-size:13px; line-height:1.2;">${parsed.fecha || ""}</td>
</tr></table>
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px; margin:0 auto; padding:20px 0 0;">
<tr><td style="font-family:Arial,sans-serif; text-align:center; padding-bottom:10px;">
<span style="font-size:72px; font-weight:bold; color:#C22D2D; line-height:1; margin-right:16px;">Esta</span>
<span style="font-size:72px; font-weight:bold; color:#31312F; line-height:1;">semana\u2026</span>
</td></tr>
<tr><td style="border-bottom:4px dotted #C22D2D; font-size:0; line-height:0;">&nbsp;</td></tr>
</table>
<table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" style="width:620px; max-width:620px; margin:0 auto; background-color:#F4ECE2; font-family:Arial,Helvetica,sans-serif; border:0;">
<tr><td style="font-size:0; line-height:0; height:18px;">&nbsp;</td></tr>
${contenido}
<tr><td align="center" style="padding:18px 10px 8px 10px;">
<div style="font-weight:bold; font-size:18px; color:#AE191A; font-family:Arial,Helvetica,sans-serif;">Diario AyE | Donde se informan los que mueven la econom\u00eda</div>
<div style="margin-top:4px; font-size:12px; color:#777777; font-family:Arial,Helvetica,sans-serif;">Actualidad econ\u00f3mica, consejos pr\u00e1cticos, entrevistas\u2026 para pymes y aut\u00f3nomos.</div>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

export default async function handler(req, res) {
if (req.method !== “POST”) return res.status(405).json({ error: “Method not allowed” });
const { tipo, htmlFuente } = req.body;
if (!tipo || !htmlFuente) return res.status(400).json({ error: “Faltan parámetros” });

try {
const response = await fetch(“https://api.anthropic.com/v1/messages”, {
method: “POST”,
headers: {
“Content-Type”: “application/json”,
“x-api-key”: process.env.ANTHROPIC_API_KEY,
“anthropic-version”: “2023-06-01”,
},
body: JSON.stringify({
model: “claude-sonnet-4-20250514”,
max_tokens: 16000,
system: SYSTEM_PROMPT,
messages: [{ role: “user”, content: `Tipo: ${tipo}\n\nHTML fuente:\n${htmlFuente}` }],
}),
});

```
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
  console.error("JSON parse error:", raw.substring(0, 500));
  return res.status(500).json({ error: "La IA no devolvió JSON válido. Inténtalo de nuevo." });
}

const html = buildHtmlFromData(parsed, tipo);
return res.status(200).json({ ...parsed, html_final: html });
```

} catch (e) {
console.error(“Handler error:”, e.message);
return res.status(500).json({ error: e.message || “Error interno” });
}
}