import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { toast } from "../../components/ui/Toast";

type Platform = "instagram" | "tiktok" | "youtube";

export function PreviewStudio() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [mediaUrl, setMediaUrl] = useState("https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop");
  const [caption, setCaption] = useState("Questo è un test per il mio prossimo post virale! 🚀 Segui per altri contenuti ✨ #creator #lifeos");
  const [username, setUsername] = useState("creator_pro");
  const [isMediaVideo, setIsMediaVideo] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiContext, setAiContext] = useState("");
  const [tone, setTone] = useState("Coinvolgente");

  const TONES = ["Coinvolgente", "Professionale", "Divertente", "Persuasivo", "Emozionale", "Provocatorio"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
      setIsMediaVideo(file.type.startsWith("video/"));
    }
  };

  const handleUrlChange = (url: string) => {
    setMediaUrl(url);
    // Controllo basico per video
    setIsMediaVideo(url.match(/\.(mp4|webm|ogg|mov)/i) !== null);
  };

  const generateAICaption = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const { data: { session } } = await supabase!.auth.getSession();
      if (!session) {
        toast("Sessione scaduta. Esci e rientra.", "error");
        setIsGenerating(false);
        return;
      }

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          prompt: `Generami una caption virale ed efficace per un post su ${platform}. 
          
          ARGOMENTO DEL POST: "${aiContext || 'Contenuto per creator'}"
          TONO DELLA VOCE: "${tone}"
          TESTO ATTUALE (se presente): "${caption}"

          ISTRUZIONI:
          - Scrivi una caption completa, lunga e strutturata.
          - Includi un Hook iniziale forte.
          - Usa emoji in modo strategico.
          - Aggiungi una Call to Action (CTA) alla fine.
          - Includi 5-10 hashtag rilevanti.
          - Rispondi SOLO con il testo della caption, senza commenti aggiuntivi.`,
          context: { platform, tone, subject: aiContext }
        })
      });

      const data = await response.json();
      if (data.content) {
        setCaption(data.content);
        toast("✨ Caption generata!", "success");
      } else {
        toast(data.error || "Errore AI", "error");
      }
    } catch (error) {
      toast("Errore di connessione", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderMedia = (platformStyle: React.CSSProperties) => {
    if (isMediaVideo) {
      return (
        <video 
          key={mediaUrl}
          src={mediaUrl} 
          autoPlay 
          muted 
          loop 
          playsInline 
          style={{ width: "100%", height: "100%", objectFit: "cover", ...platformStyle }} 
        />
      );
    }
    return (
      <img 
        src={mediaUrl} 
        alt="Preview" 
        style={{ width: "100%", height: "100%", objectFit: "cover", ...platformStyle }} 
        onError={(e) => {
          if (!mediaUrl.includes("via.placeholder.com")) {
             e.currentTarget.src = "https://via.placeholder.com/400x400?text=Link+Non+Valido";
          }
        }} 
      />
    );
  };

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 24 }}>
        📱 Preview Studio
      </h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
        Testa come appariranno i tuoi contenuti visivi e i testi prima di pubblicarli sui social.
      </p>

      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start" }}>
        
        {/* Pannello Controlli */}
        <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="glass-panel" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, marginBottom: 16, color: "var(--accent-color)" }}>1. Scegli Piattaforma</h3>
            <div style={{ display: "flex", gap: 10 }}>
              {(["instagram", "tiktok", "youtube"] as Platform[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 8,
                    background: platform === p ? "var(--accent-gradient)" : "rgba(255,255,255,0.05)",
                    color: platform === p ? "#000" : "#fff",
                    border: "none",
                    fontWeight: 600,
                    cursor: "pointer",
                    textTransform: "capitalize"
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, marginBottom: 16 }}>2. Contenuti</h3>
            
            <label style={{ display: "block", marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: "var(--accent-color)", display: "block", marginBottom: 8, fontWeight: 600 }}>Carica il tuo file (Foto o Video)</span>
              <div style={{ position: "relative" }}>
                 <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "2px dashed rgba(255,255,255,0.2)",
                    borderRadius: 12,
                    color: "#fff",
                    cursor: "pointer"
                  }}
                />
              </div>
            </label>

            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
              <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>OPPURE PERSONALIZZA IL TESTO</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
            </div>

            <div className="glass-panel" style={{ padding: 24, background: "rgba(124, 58, 237, 0.03)", border: "1px solid rgba(124, 58, 237, 0.1)", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, marginBottom: 16, color: "#a78bfa" }}>✨ AI Copywriter</h3>
              
              <label style={{ display: "block", marginBottom: 16 }}>
                <span style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Di cosa parla il tuo post? (Dettagli per l'AI)</span>
                <textarea
                  value={aiContext}
                  onChange={e => setAiContext(e.target.value)}
                  placeholder="Esempio: 3 segreti per crescere su Instagram partendo da zero nel 2024..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: 12,
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    color: "#fff",
                    fontSize: 13,
                    fontFamily: "inherit"
                  }}
                />
              </label>

              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Tono della voce</span>
                  <select
                    value={tone}
                    onChange={e => setTone(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 10,
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                      color: "#fff",
                      fontSize: 13,
                      cursor: "pointer"
                    }}
                  >
                    {TONES.map(t => <option key={t} value={t} style={{ background: "#111" }}>{t}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "flex-end" }}>
                  <button 
                    onClick={generateAICaption}
                    disabled={isGenerating || !aiContext.trim()}
                    style={{
                      width: "100%",
                      background: aiContext.trim() ? "var(--accent-gradient)" : "rgba(255,255,255,0.05)",
                      border: "none",
                      color: aiContext.trim() ? "#000" : "rgba(255,255,255,0.2)",
                      padding: "10px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: aiContext.trim() ? "pointer" : "default",
                      transition: "all 0.2s"
                    }}
                  >
                    {isGenerating ? "⏳ Generando..." : "✨ Genera Caption"}
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Anteprima Testo</span>
                <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{caption.length} caratteri</span>
              </div>
              
              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                rows={6}
                placeholder="La tua caption apparirà qui..."
                style={{
                  width: "100%",
                  padding: 12,
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  color: "#fff",
                  resize: "vertical",
                  fontFamily: "inherit",
                  fontSize: 14,
                  lineHeight: 1.5
                }}
              />
            </div>
          </div>
        </div>

        {/* Mockup Sandbox */}
        <div style={{ flex: 1, minWidth: 350, display: "flex", justifyContent: "center" }}>
          <div 
            style={{ 
              width: 350, 
              height: 700, 
              background: "#000", 
              borderRadius: 40, 
              border: "8px solid #222", 
              boxShadow: "0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column"
            }}
            className="animate-float"
          >
            {/* Notch */}
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 25, background: "#222", borderBottomLeftRadius: 15, borderBottomRightRadius: 15, zIndex: 10 }}></div>

            {/* Platform Mockup rendering */}
            {platform === "instagram" && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#000", color: "#fff", paddingTop: 40 }}>
                {/* IG Top */}
                <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid #222" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent-gradient)", marginRight: 10 }}></div>
                  <div style={{ fontWeight: 600, fontSize: 14, flex: 1 }}>{username}</div>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>⋮</div>
                </div>
                {/* IG Media */}
                <div style={{ width: "100%", height: 350, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {renderMedia({})}
                </div>
                {/* IG Actions & Text */}
                <div style={{ padding: 14 }}>
                  <div style={{ display: "flex", gap: 16, marginBottom: 12, fontSize: 24 }}>
                    <span>❤️</span> <span>💬</span> <span>✈️</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Piace a 1.2k persone</div>
                  <div style={{ fontSize: 14 }}>
                    <span style={{ fontWeight: 600, marginRight: 6 }}>{username}</span>
                    {caption}
                  </div>
                </div>
              </div>
            )}

            {platform === "tiktok" && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#000", color: "#fff", position: "relative" }}>
                 {renderMedia({})}
                 
                 {/* UI Overlay - Bottom Text */}
                 <div style={{ 
                   position: "absolute", 
                   bottom: 0, 
                   left: 0, 
                   right: 0, 
                   padding: "80px 16px 40px", 
                   background: "linear-gradient(transparent, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.9))",
                   pointerEvents: "none"
                 }}>
                    <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                      @{username} <span style={{ width: 14, height: 14, background: "#20D5EC", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 8 }}>✓</span>
                    </div>
                    <div style={{ 
                      fontSize: 15, 
                      lineHeight: "1.4",
                      marginBottom: 16, 
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)"
                    }}>
                      {caption}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                      <span style={{ fontSize: 18 }}>♫</span> 
                      <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
                        <div style={{ display: "inline-block", paddingLeft: "100%", animation: "marquee 10s linear infinite" }}>
                          Suono originale - {username} - {username}
                        </div>
                      </div>
                    </div>
                 </div>

                 {/* Right sidebar - Icons */}
                 <div style={{ 
                   position: "absolute", 
                   right: 8, 
                   bottom: 100, 
                   display: "flex", 
                   flexDirection: "column", 
                   gap: 20, 
                   alignItems: "center",
                   zIndex: 2
                 }}>
                    {/* Profile Icon */}
                    <div style={{ position: "relative", marginBottom: 10 }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid #fff", background: "var(--accent-gradient)", overflow: "hidden" }}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} alt="avatar" />
                      </div>
                      <div style={{ position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)", background: "#fe2c55", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: "bold" }}>+</div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ fontSize: 32, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>❤️</span>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>124.5k</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ fontSize: 32, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>💬</span>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>1,234</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ fontSize: 32, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>🔖</span>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>45.2k</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ fontSize: 32, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>⤴️</span>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>Share</span>
                    </div>

                    {/* Vinyl Record */}
                    <div style={{ 
                      width: 40, 
                      height: 40, 
                      background: "linear-gradient(45deg, #222, #444, #222)", 
                      borderRadius: "50%", 
                      border: "8px solid #333",
                      animation: "rotate 4s linear infinite",
                      marginTop: 10
                    }}></div>
                 </div>
              </div>
            )}

            {platform === "youtube" && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#0f0f0f", color: "#fff" }}>
                {/* Status Bar space */}
                <div style={{ height: 40 }}></div>

                {/* Video Player Area */}
                <div style={{ width: "100%", height: 210, background: "#000", position: "relative" }}>
                  {renderMedia({})}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.2)" }}>
                    <div style={{ width: "40%", height: "100%", background: "#f00" }}></div>
                  </div>
                </div>

                {/* Video Info */}
                <div style={{ padding: "16px 12px" }}>
                  <h1 style={{ fontSize: 18, fontWeight: 700, lineHeight: "1.3", marginBottom: 8 }}>
                    {aiContext || "Il mio nuovo video epico"}
                  </h1>
                  <div style={{ fontSize: 13, color: "#aaa", marginBottom: 16 }}>
                    1.2M visualizzazioni • 2 ore fa • #trending
                  </div>

                  {/* Channel Row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--accent-gradient)", overflow: "hidden" }}>
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} alt="avatar" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{username}</div>
                      <div style={{ fontSize: 12, color: "#aaa" }}>1.5M iscritti</div>
                    </div>
                    <button style={{ background: "#fff", color: "#000", border: "none", borderRadius: 18, padding: "8px 16px", fontSize: 13, fontWeight: 600 }}>
                      Iscriviti
                    </button>
                  </div>

                  {/* Action Buttons Scroll */}
                  <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10, marginBottom: 16 }} className="no-scrollbar">
                    <div style={{ background: "rgba(255,255,255,0.1)", padding: "8px 14px", borderRadius: 18, fontSize: 13, whiteSpace: "nowrap", display: "flex", gap: 6 }}>
                      <span>👍 12k</span> | <span>👎</span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.1)", padding: "8px 14px", borderRadius: 18, fontSize: 13, whiteSpace: "nowrap" }}>
                      ➡️ Condividi
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.1)", padding: "8px 14px", borderRadius: 18, fontSize: 13, whiteSpace: "nowrap" }}>
                      📥 Scarica
                    </div>
                  </div>

                  {/* Description Box */}
                  <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Descrizione</div>
                    <div style={{ fontSize: 13, color: "#eee", lineHeight: "1.4" }}>
                      {caption.length > 100 ? caption.substring(0, 100) + "..." : caption}
                    </div>
                  </div>
                </div>

                {/* Comments Mockup */}
                <div style={{ padding: "0 12px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Commenti • 432</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#444" }}></div>
                    <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 8, fontSize: 12, color: "#aaa" }}>
                      Aggiungi un commento...
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
