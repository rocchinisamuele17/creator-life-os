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

    const groqKey = process.env.GROQ_API_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !groqKey) {
      return res.status(500).json({ error: 'Configurazione server incompleta (Supabase o Groq Key mancante).' });
    }

    // Auth con Supabase
    const authClient = createClient(supabaseUrl || '', supabaseAnonKey || '');
    const { data: { user }, error: authError } = await authClient.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Non autorizzato', details: authError?.message });
    }

    const { prompt, context } = req.body;

    // Chiamata a Groq API (Ultra Veloce)
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: `Sei l'assistente AI di Prodigi, un ecosistema per Content Creator. 
            Rispondi in modo professionale, creativo e conciso in italiano. 
            Contesto dell'utente: ${JSON.stringify(context || {})}`
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return res.status(groqResponse.status).json({
        error: 'Errore Groq',
        details: data.error?.message || 'Errore durante la chiamata a Groq'
      });
    }

    return res.status(200).json({
      content: data.choices[0].message.content
    });

  } catch (error: any) {
    console.error('AI Error:', error);
    return res.status(500).json({ error: 'Errore interno del server', details: error.message });
  }
}
