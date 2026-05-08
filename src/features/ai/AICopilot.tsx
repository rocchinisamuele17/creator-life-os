import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { supabase } from "../../lib/supabase";
import { toast } from "../../components/ui/Toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AICopilotProps {
  showToast?: (msg: string, type?: any) => void;
}

export function AICopilot({ showToast = toast }: AICopilotProps) {
  useAuth(); // Ensure auth context is available
  const { state } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Ciao! Sono il tuo assistente AI specializzato per Content Creator. Di cosa vuoi parlare oggi? Posso aiutarti a trovare idee per nuovi video, scrivere hook accattivanti o analizzare la tua strategia attuale." 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Get auth token from supabase session
      const { data: { session } } = await supabase!.auth.getSession();
      
      if (!session) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sessione scaduta o non valida. Per favore, esci e rientra per usare l'AI." }]);
        showToast("Sessione non valida", "error");
        setLoading(false);
        return;
      }
      
      // Collect some context to help the AI be more relevant
      const context = {
        contentIdeas: state.content.filter(c => c.status === 'Idea').map(c => c.title).slice(0, 5),
        recentPlatforms: Array.from(new Set(state.content.map(c => c.platform))).slice(0, 3),
        brands: state.brands.filter(b => b.status === 'Attivo').map(b => b.brand),
        goals: state.goals.map(g => g.goal)
      };

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          prompt: userMessage,
          context: context
        })
      });

      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Risposta del server non valida (HTML/Text): ${text.slice(0, 50)}...`);
      }

      if (data.error) {
        const errorMsg = data.details ? `${data.error}: ${data.details}` : data.error;
        setMessages(prev => [...prev, { role: 'assistant', content: `Ops! C'è stato un problema: ${errorMsg}` }]);
        showToast(`Errore AI: ${data.error}`, "error");
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      }
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Errore di connessione: ${error.message}` }]);
      showToast("Errore di connessione AI", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
    // Optional: auto-send if desired, but letting user edit is safer
  };

  return (
    <div style={{ height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ marginBottom: 10 }}>
        <h2 className="text-gradient" style={{ fontSize: "clamp(24px, 6vw, 32px)", fontWeight: 800, margin: 0 }}>Brainstorming AI</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '4px 0 0' }}>Sviluppa le tue prossime hit con l'assistente intelligente.</p>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        {/* Messages area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ 
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              padding: '12px 18px',
              borderRadius: m.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              background: m.role === 'user' ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)',
              color: m.role === 'user' ? '#000' : '#fff',
              fontSize: 14,
              lineHeight: 1.6,
              border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
              whiteSpace: 'pre-wrap'
            }}>
              {m.content}
            </div>
          ))}
          {loading && (
            <div style={{ 
              alignSelf: 'flex-start',
              padding: '12px 18px',
              borderRadius: '20px 20px 20px 4px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              gap: 5
            }}>
              <div className="animate-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-color)' }}></div>
              <div className="animate-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-color)', animationDelay: '0.2s' }}></div>
              <div className="animate-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-color)', animationDelay: '0.4s' }}></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={sendMessage} style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 12 }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Chiedimi qualsiasi cosa..."
            disabled={loading}
            style={{ 
              flex: 1,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              padding: '12px 16px',
              color: '#fff',
              outline: 'none',
              fontSize: 14,
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="premium-btn primary"
            style={{ minHeight: 46, width: 46, padding: 0, borderRadius: 12, fontSize: 20 }}
          >
            {loading ? '...' : '⚡'}
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
        {[
          { label: "💡 Idee per Reel", prompt: "Generami 5 idee virali per dei Reel basati sulla mia nicchia attuale." },
          { label: "🪝 Hook Virali", prompt: "Scrivimi 3 hook diversi per un video che parla di produttività." },
          { label: "✍️ Script Veloce", prompt: "Crea uno script da 60 secondi per un video tutorial breve." },
          { label: "📈 Strategia", prompt: "Come posso migliorare il mio engagement questo mese?" }
        ].map((s, i) => (
          <button 
            key={i}
            onClick={() => handleSuggestion(s.prompt)}
            className="glass-card" 
            style={{ 
              padding: '12px 16px', 
              textAlign: 'left', 
              cursor: 'pointer', 
              fontSize: 12, 
              fontWeight: 600,
              color: 'rgba(255,255,255,0.8)',
              transition: 'all 0.2s'
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
