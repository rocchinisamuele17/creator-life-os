import { useState } from "react";

type Platform = "instagram" | "tiktok" | "youtube";

export function PreviewStudio() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [mediaUrl, setMediaUrl] = useState("https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop");
  const [caption, setCaption] = useState("Questo è un test per il mio prossimo post virale! 🚀 Segui per altri contenuti ✨ #creator #lifeos");
  const [username, setUsername] = useState("creator_pro");
  const [isMediaVideo, setIsMediaVideo] = useState(false);

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
              <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>OPPURE USA UN LINK</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
            </div>

            <label style={{ display: "block", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Nome Utente</span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{
                  width: "100%",
                  padding: 12,
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  color: "#fff"
                }}
              />
            </label>

            <label style={{ display: "block", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Immagine/Video URL</span>
              <input
                type="text"
                value={mediaUrl.startsWith("blob:") ? "" : mediaUrl}
                onChange={e => handleUrlChange(e.target.value)}
                placeholder="Incolla link diretto (es. .jpg, .mp4)"
                style={{
                  width: "100%",
                  padding: 12,
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  color: "#fff"
                }}
              />
            </label>

            <label style={{ display: "block" }}>
              <span style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Caption / Corpo del Post</span>
              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                rows={4}
                style={{
                  width: "100%",
                  padding: 12,
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  color: "#fff",
                  resize: "vertical"
                }}
              />
            </label>
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
            {/* Notch Notch Notch */}
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
                 {renderMedia({ opacity: 0.8 })}
                 {/* UI Overlay */}
                 <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}>
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>@{username}</div>
                    <div style={{ fontSize: 14, marginBottom: 16 }}>{caption}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                      🎵 Suono originale - {username}
                    </div>
                 </div>
                 {/* Right sidebar */}
                 <div style={{ position: "absolute", right: 10, bottom: 80, display: "flex", flexDirection: "column", gap: 20, alignItems: "center", fontSize: 24 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><span>❤️</span><span style={{fontSize: 12}}>12k</span></div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><span>💬</span><span style={{fontSize: 12}}>342</span></div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><span>🔖</span><span style={{fontSize: 12}}>50</span></div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><span>⤴️</span><span style={{fontSize: 12}}>21</span></div>
                 </div>
              </div>
            )}

            {platform === "youtube" && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#0f0f0f", color: "#fff", paddingTop: 40 }}>
                {/* Video Area */}
                <div style={{ width: "100%", height: 200, background: "#000", position: "relative" }}>
                  {renderMedia({})}
                  <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.8)", padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>12:04</div>
                </div>
                {/* Meta */}
                <div style={{ padding: 12, display: "flex", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent-gradient)", flexShrink: 0 }}></div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4, lineHeight: 1.2 }}>{caption.length > 50 ? caption.substring(0, 50) + "..." : caption}</div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>{username} • 14k visualizzazioni • 2 ore fa</div>
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
