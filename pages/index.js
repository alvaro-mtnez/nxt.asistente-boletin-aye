import { useState, useRef } from "react";

const BANNER_ATA_BLOCK = `<!-- BANNER FINAL ATA -->
<tr><td align="center" style="padding:10px;">
  <a target="_blank" href="https://ata.es/convenios/" style="text-decoration:none; border:0;">
    <img alt="ATA convenios" src="https://autonomosyemprendedor.opennemas.com/media/autonomosyemprendedor/images/2023/03/23/2023032311395220745.jpg" width="600" style="display:block; width:100%; max-width:600px; height:auto; border:0;" />
  </a>
</td></tr>`;

function buildHtml(parsed, tipo) {
  const bannerAta = tipo === "ATA" ? BANNER_ATA_BLOCK : "";
  return `<!doctype html>
<html lang="es">
<body style="margin:0; padding:0; background-color:#F4ECE2;">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
${parsed.tracking_pixels || ""}
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4ECE2; margin:0; padding:0;">
<tr><td>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px; margin:0 auto;">
<tr><td style="background-color:#C22D2D; padding:8px 0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr>
<td width="25%" style="padding-left:15px; vertical-align:middle;">
<a href="https://www.autonomosyemprendedor.es/" target="_blank" style="display:block; text-decoration:none; border:0;">
<img src="https://www.autonomosyemprendedor.es/media/autonomosyemprendedor/images/2025/09/03/2025090319502622678.png" alt="AyE Economía Real" style="display:block; width:100%; max-width:160px; height:auto; border:0;" /></a></td>
<td width="50%" style="text-align:center; vertical-align:middle; font-family:Arial,sans-serif; color:#FFFFFF; font-size:14px; font-weight:bold; line-height:1.2; padding:0 5px 0 30px;">El medio de los que mueven la economía</td>
<td width="25%" style="text-align:right; vertical-align:middle; padding-right:12px; font-family:Arial,sans-serif; color:#FFFFFF; font-size:13px; line-height:1.2;">${parsed.fecha || ""}</td>
</tr></table></td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px; margin:0 auto; padding:20px 0 0;">
<tr><td style="font-family:Arial,sans-serif; text-align:center; padding-bottom:10px;">
<span style="font-size:72px; font-weight:bold; color:#C22D2D; line-height:1; margin-right:16px;">Esta</span>
<span style="font-size:72px; font-weight:bold; color:#31312F; line-height:1;">semana\u2026</span>
</td></tr>
<tr><td style="border-bottom:4px dotted #C22D2D; font-size:0; line-height:0;">&nbsp;</td></tr>
</table>
<table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" style="width:620px; max-width:620px; margin:0 auto; background-color:#F4ECE2; font-family:Arial,Helvetica,sans-serif; border:0;">
<tr><td style="font-size:0; line-height:0; height:18px;">&nbsp;</td></tr>
${parsed.contenido_html || ""}
${bannerAta}
<tr><td align="center" style="padding:18px 10px 8px 10px;">
<div style="font-weight:bold; font-size:18px; color:#AE191A; font-family:Arial,Helvetica,sans-serif;">Diario AyE | Donde se informan los que mueven la economía</div>
<div style="margin-top:4px; font-size:12px; color:#777777; font-family:Arial,Helvetica,sans-serif;">Actualidad económica, consejos prácticos, entrevistas\u2026 para pymes y autónomos.</div>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

export default function App() {
  const [tipo, setTipo] = useState(null);
  const [htmlFuente, setHtmlFuente] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState(null);
  const [copied, setCopied] = useState({});
  const [preview, setPreview] = useState(false);
  const outputRef = useRef(null);

  const accent = tipo === "ATA" ? "#234536" : "#C22D2D";

  const handleTipo = t => { setTipo(t); setResultado(null); setError(""); setPreview(false); };

  const handleGenerar = async () => {
    if (!htmlFuente.trim()) { setError("Pega el HTML del boletín fuente antes de continuar."); return; }
    setLoading(true); setError(""); setResultado(null); setPreview(false);
    try {
      const res = await fetch("/api/generar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, htmlFuente }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData?.error || "Error en el servidor.");
      setResultado({ html: buildHtml(resData, tipo), asunto1: resData.asunto1, art1: resData.asunto1_articulo, asunto2: resData.asunto2, art2: resData.asunto2_articulo, vp: resData.vista_previa });
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      setError(e.message || "Error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text, key) => {
    await navigator.clipboard.writeText(text);
    setCopied(p => ({ ...p, [key]: true }));
    setTimeout(() => setCopied(p => ({ ...p, [key]: false })), 1800);
  };

  const reset = () => { setTipo(null); setHtmlFuente(""); setResultado(null); setError(""); setCopied({}); setPreview(false); };

  const CopyBtn = ({ text, id, label = "Copiar" }) => (
    <button onClick={() => copy(text, id)}
      style={{ padding: "0 14px", background: copied[id] ? "#4caf50" : accent, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: "bold", whiteSpace: "nowrap", fontFamily: "Arial,sans-serif", transition: "background .2s", height: 42 }}>
      {copied[id] ? "✓ Copiado" : label}
    </button>
  );

  const CharLabel = ({ count, max }) => (
    <span style={{ color: count > max ? "#C22D2D" : "#4caf50", fontWeight: "bold" }}>{count}/{max}</span>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F4ECE2", fontFamily: "Arial,sans-serif", padding: "24px 16px" }}>

      {/* Header */}
      <div style={{ maxWidth: 680, margin: "0 auto 28px auto", textAlign: "center" }}>
        <img src="https://www.autonomosyemprendedor.es/media/autonomosyemprendedor/images/2025/06/28/2025062812113336013.png" alt="AyE" style={{ height: 52, display: "block", margin: "0 auto" }} />
        <div style={{ marginTop: 10, fontSize: 21, fontWeight: "bold", color: "#1D1D1B" }}>Maquetador de Boletines</div>
        <div style={{ marginTop: 3, fontSize: 12, color: "#999" }}>Herramienta interna · Diario AyE</div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* Paso 1 */}
        <div style={{ background: "#fff", borderRadius: 10, padding: "20px 24px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
          <div style={{ fontSize: 13, fontWeight: "bold", color: accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Paso 1 · Tipo de boletín</div>
          <div style={{ display: "flex", gap: 12 }}>
            {["AyE", "ATA"].map(t => {
              const c = t === "ATA" ? "#234536" : "#C22D2D";
              const sel = tipo === t;
              return (
                <button key={t} onClick={() => handleTipo(t)}
                  style={{ flex: 1, padding: "14px 0", fontSize: 18, fontWeight: "bold", borderRadius: 8, border: `2px solid ${sel ? c : "#ddd"}`, background: sel ? c : "#fff", color: sel ? "#fff" : "#333", cursor: "pointer", fontFamily: "Arial,sans-serif", transition: "all .15s" }}>
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Paso 2 */}
        {tipo && (
          <div style={{ background: "#fff", borderRadius: 10, padding: "20px 24px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
            <div style={{ fontSize: 13, fontWeight: "bold", color: accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Paso 2 · HTML del boletín fuente</div>
            <textarea value={htmlFuente} onChange={e => setHtmlFuente(e.target.value)}
              rows={9} placeholder="Pega aquí el código HTML completo del boletín fuente..."
              style={{ width: "100%", padding: "10px 12px", fontSize: 12, fontFamily: "monospace", borderRadius: 6, border: "1.5px solid #ddd", resize: "vertical", boxSizing: "border-box", outline: "none", background: "#FAFAFA", color: "#333" }} />
            {htmlFuente && <div style={{ marginTop: 6, fontSize: 12, color: "#999" }}>{htmlFuente.length.toLocaleString("es")} caracteres</div>}
            {error && <div style={{ marginTop: 10, padding: "10px 14px", background: "#fff0f0", borderRadius: 6, color: "#C22D2D", fontSize: 13 }}>⚠️ {error}</div>}
            <button onClick={handleGenerar} disabled={loading || !htmlFuente.trim()}
              style={{ marginTop: 14, width: "100%", padding: "14px 0", fontSize: 16, fontWeight: "bold", borderRadius: 8, border: "none", cursor: loading || !htmlFuente.trim() ? "not-allowed" : "pointer", background: loading || !htmlFuente.trim() ? "#ccc" : accent, color: "#fff", fontFamily: "Arial,sans-serif", transition: "background .3s" }}>
              {loading ? "⏳ Generando boletín…" : `🚀 Generar boletín ${tipo}`}
            </button>
          </div>
        )}

        {/* Resultado */}
        {resultado && (
          <div ref={outputRef}>

            {/* Asuntos y vista previa */}
            <div style={{ background: "#fff", borderRadius: 10, padding: "20px 24px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
              <div style={{ fontSize: 13, fontWeight: "bold", color: accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>✅ Resultado generado</div>

              {[
                { label: "Asunto 1", val: resultado.asunto1, art: resultado.art1, key: "a1", max: 49 },
                { label: "Asunto 2", val: resultado.asunto2, art: resultado.art2, key: "a2", max: 49 },
              ].map(({ label, val, art, key, max }) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#999", marginBottom: 4 }}>
                    <span>{label}</span><CharLabel count={(val || "").length} max={max} />
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                    <div style={{ flex: 1, padding: "10px 12px", background: "#F8F8F8", borderRadius: 6, fontSize: 14, fontWeight: "bold", color: "#1D1D1B", border: "1.5px solid #eee" }}>{val}</div>
                    <CopyBtn text={val} id={key} />
                  </div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>Artículo: {art}</div>
                </div>
              ))}

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#999", marginBottom: 4 }}>
                  <span>Vista previa (snippet)</span><CharLabel count={(resultado.vp || "").length} max={150} />
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                  <div style={{ flex: 1, padding: "10px 12px", background: "#F8F8F8", borderRadius: 6, fontSize: 13, color: "#1D1D1B", border: "1.5px solid #eee" }}>{resultado.vp}</div>
                  <CopyBtn text={resultado.vp} id="vp" />
                </div>
              </div>
            </div>

            {/* HTML final + previsualización */}
            <div style={{ background: "#fff", borderRadius: 10, padding: "20px 24px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: "bold", color: accent, textTransform: "uppercase", letterSpacing: 1 }}>HTML Final</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setPreview(!preview)}
                    style={{ padding: "0 14px", height: 42, background: preview ? "#555" : "#444", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: "bold", fontFamily: "Arial,sans-serif" }}>
                    {preview ? "🙈 Ocultar preview" : "👁️ Vista previa"}
                  </button>
                  <CopyBtn text={resultado.html} id="html" label="📋 Copiar HTML" />
                </div>
              </div>

              {/* Preview iframe */}
              {preview && (
                <div style={{ marginBottom: 16, border: "1.5px solid #eee", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ background: "#f0f0f0", padding: "6px 12px", fontSize: 11, color: "#888", borderBottom: "1px solid #eee" }}>
                    Vista previa del boletín generado
                  </div>
                  <iframe
                    srcDoc={resultado.html}
                    style={{ width: "100%", height: 600, border: "none", background: "#fff" }}
                    title="Vista previa del boletín"
                    sandbox="allow-same-origin"
                  />
                </div>
              )}

              <textarea readOnly value={resultado.html} rows={10}
                style={{ width: "100%", padding: "10px 12px", fontSize: 11, fontFamily: "monospace", borderRadius: 6, border: "1.5px solid #ddd", resize: "vertical", boxSizing: "border-box", background: "#FAFAFA", color: "#555" }} />
              <div style={{ marginTop: 6, fontSize: 12, color: "#999" }}>{resultado.html.length.toLocaleString("es")} caracteres totales</div>
            </div>

            <button onClick={reset}
              style={{ width: "100%", padding: "12px 0", fontSize: 14, fontWeight: "bold", borderRadius: 8, border: `2px solid ${accent}`, background: "#fff", color: accent, cursor: "pointer", fontFamily: "Arial,sans-serif", marginBottom: 24 }}>
              ↩ Nuevo boletín
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
