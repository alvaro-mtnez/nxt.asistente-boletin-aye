import { useState, useRef } from “react”;

export default function App() {
const [tipo, setTipo] = useState(null);
const [htmlFuente, setHtmlFuente] = useState(””);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(””);
const [resultado, setResultado] = useState(null);
const [copied, setCopied] = useState({});
const [preview, setPreview] = useState(false);
const [editAsunto1, setEditAsunto1] = useState(””);
const [editAsunto2, setEditAsunto2] = useState(””);
const [editVp, setEditVp] = useState(””);
const outputRef = useRef(null);

const accent = tipo === “ATA” ? “#234536” : “#C22D2D”;

const handleTipo = t => { setTipo(t); setResultado(null); setError(””); setPreview(false); };

const handleGenerar = async () => {
if (!htmlFuente.trim()) { setError(“Pega el HTML del boletín fuente antes de continuar.”); return; }
setLoading(true); setError(””); setResultado(null); setPreview(false);
try {
const res = await fetch(”/api/generar”, {
method: “POST”,
headers: { “Content-Type”: “application/json” },
body: JSON.stringify({ tipo, htmlFuente }),
});
const data = await res.json();
if (!res.ok) throw new Error(data?.error || “Error en el servidor.”);
setResultado(data);
setEditAsunto1(data.asunto1 || “”);
setEditAsunto2(data.asunto2 || “”);
setEditVp(data.vista_previa || “”);
setTimeout(() => outputRef.current?.scrollIntoView({ behavior: “smooth” }), 100);
} catch (e) {
setError(e.message || “Error inesperado.”);
} finally {
setLoading(false);
}
};

const copy = async (text, key) => {
await navigator.clipboard.writeText(text);
setCopied(p => ({ …p, [key]: true }));
setTimeout(() => setCopied(p => ({ …p, [key]: false })), 1800);
};

const reset = () => {
setTipo(null); setHtmlFuente(””); setResultado(null);
setError(””); setCopied({}); setPreview(false);
setEditAsunto1(””); setEditAsunto2(””); setEditVp(””);
};

const CopyBtn = ({ text, id, label = “Copiar” }) => (
<button onClick={() => copy(text, id)}
style={{ padding: “0 14px”, background: copied[id] ? “#4caf50” : accent, color: “#fff”, border: “none”, borderRadius: 6, cursor: “pointer”, fontSize: 13, fontWeight: “bold”, whiteSpace: “nowrap”, fontFamily: “Arial,sans-serif”, transition: “background .2s”, height: 42 }}>
{copied[id] ? “✓ Copiado” : label}
</button>
);

const CharCount = ({ val, max }) => {
const n = (val || “”).length;
return <span style={{ color: n > max ? “#C22D2D” : “#4caf50”, fontWeight: “bold”, fontSize: 12 }}>{n}/{max}</span>;
};

const inputStyle = {
width: “100%”, padding: “10px 12px”, fontSize: 14, borderRadius: 6,
border: “1.5px solid #ddd”, boxSizing: “border-box”, outline: “none”,
background: “#FAFAFA”, fontFamily: “Arial,sans-serif”, color: “#1D1D1B”
};

return (
<div style={{ minHeight: “100vh”, background: “#F4ECE2”, fontFamily: “Arial,sans-serif”, padding: “24px 16px” }}>

```
  {/* Header */}
  <div style={{ maxWidth: 680, margin: "0 auto 28px auto", textAlign: "center" }}>
    <img src="https://www.autonomosyemprendedor.es/media/autonomosyemprendedor/images/2025/09/03/2025090320300074548.png"
      alt="AyE" style={{ height: 52, display: "block", margin: "0 auto" }} />
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

        {/* Asuntos y vista previa — editables */}
        <div style={{ background: "#fff", borderRadius: 10, padding: "20px 24px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
          <div style={{ fontSize: 13, fontWeight: "bold", color: accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>✅ Resultado generado</div>

          {/* Asunto 1 */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#777", marginBottom: 5 }}>
              <span style={{ fontWeight: "bold" }}>Asunto 1</span>
              <CharCount val={editAsunto1} max={49} />
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input value={editAsunto1} onChange={e => setEditAsunto1(e.target.value)} style={inputStyle} />
              <CopyBtn text={editAsunto1} id="a1" />
            </div>
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>Artículo: {resultado.asunto1_articulo}</div>
          </div>

          {/* Asunto 2 */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#777", marginBottom: 5 }}>
              <span style={{ fontWeight: "bold" }}>Asunto 2</span>
              <CharCount val={editAsunto2} max={49} />
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input value={editAsunto2} onChange={e => setEditAsunto2(e.target.value)} style={inputStyle} />
              <CopyBtn text={editAsunto2} id="a2" />
            </div>
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>Artículo: {resultado.asunto2_articulo}</div>
          </div>

          {/* Vista previa */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#777", marginBottom: 5 }}>
              <span style={{ fontWeight: "bold" }}>Vista previa (snippet)</span>
              <CharCount val={editVp} max={150} />
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input value={editVp} onChange={e => setEditVp(e.target.value)} style={inputStyle} />
              <CopyBtn text={editVp} id="vp" />
            </div>
          </div>
        </div>

        {/* HTML final + preview */}
        <div style={{ background: "#fff", borderRadius: 10, padding: "20px 24px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontSize: 13, fontWeight: "bold", color: accent, textTransform: "uppercase", letterSpacing: 1 }}>HTML Final</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setPreview(!preview)}
                style={{ padding: "0 14px", height: 42, background: preview ? "#555" : "#444", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: "bold", fontFamily: "Arial,sans-serif" }}>
                {preview ? "🙈 Ocultar" : "👁️ Vista previa"}
              </button>
              <CopyBtn text={resultado.html_final} id="html" label="📋 Copiar HTML" />
            </div>
          </div>

          {preview && (
            <div style={{ marginBottom: 16, border: "1.5px solid #eee", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ background: "#f0f0f0", padding: "6px 12px", fontSize: 11, color: "#888", borderBottom: "1px solid #eee" }}>
                Vista previa del boletín generado
              </div>
              <iframe srcDoc={resultado.html_final} style={{ width: "100%", height: 700, border: "none", background: "#fff" }}
                title="Vista previa" sandbox="allow-same-origin" />
            </div>
          )}

          <textarea readOnly value={resultado.html_final} rows={10}
            style={{ width: "100%", padding: "10px 12px", fontSize: 11, fontFamily: "monospace", borderRadius: 6, border: "1.5px solid #ddd", resize: "vertical", boxSizing: "border-box", background: "#FAFAFA", color: "#555" }} />
          <div style={{ marginTop: 6, fontSize: 12, color: "#999" }}>
            {(resultado.html_final || "").length.toLocaleString("es")} caracteres totales
          </div>
        </div>

        <button onClick={reset}
          style={{ width: "100%", padding: "12px 0", fontSize: 14, fontWeight: "bold", borderRadius: 8, border: `2px solid ${accent}`, background: "#fff", color: accent, cursor: "pointer", fontFamily: "Arial,sans-serif", marginBottom: 24 }}>
          ↩ Nuevo boletín
        </button>
      </div>
    )}
  </div>
</div>
```

);
}