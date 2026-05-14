import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo POST consentito' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader === 'Bearer undefined') {
      return res.status(401).json({ error: 'Sessione non valida. Per favore esci e rientra.' });
    }

    const token = authHeader.replace('Bearer ', '');

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !geminiKey) {
      return res.status(500).json({ error: 'Configurazione server incompleta (Supabase o Gemini Key mancante).' });
    }

    // Auth con Supabase
    const authClient = createClient(supabaseUrl || '', supabaseAnonKey || '');
    const { data: { user }, error: authError } = await authClient.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Non autorizzato', details: authError?.message });
    }

    const { prompt, context } = req.body;

    // Chiamata a Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Sei l'assistente AI di Prodigi, un ecosistema per Content Creator. 
            Rispondi in modo professionale, creativo e conciso. 
            Contesto dell'utente: ${JSON.stringify(context || {})}
            Domanda dell'utente: ${prompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      return res.status(geminiResponse.status).json({
        error: 'Errore Gemini',
        details: data.error?.message || 'Errore durante la chiamata a Gemini'
      });
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Non sono riuscito a generare una risposta.";

    return res.status(200).json({ content: aiText });

  } catch (error: any) {
    console.error('AI Error:', error);
    return res.status(500).json({ error: 'Errore interno del server', details: error.message });
  }
}
