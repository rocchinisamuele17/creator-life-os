import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  // Forza header JSON
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
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !openaiKey) {
      return res.status(500).json({ error: 'Configurazione server incompleta (Supabase o OpenAI Key mancante).' });
    }

    // Auth con Supabase
    const authClient = createClient(supabaseUrl || '', supabaseAnonKey || '');
    const { data: { user }, error: authError } = await authClient.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({
        error: 'Non autorizzato',
        details: authError?.message || 'Token sessione non valido'
      });
    }

    const { prompt, context } = req.body;

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey.trim()}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Sei un assistente per Content Creator. Rispondi in italiano. Contesto: ${JSON.stringify(context || {})}`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await aiResponse.json();

    if (!aiResponse.ok) {
      return res.status(aiResponse.status).json({
        error: 'Errore OpenAI',
        details: data.error?.message || 'Errore durante la chiamata a OpenAI'
      });
    }

    return res.status(200).json({
      content: data.choices[0].message.content
    });

  } catch (error: any) {
    console.error('AI Error:', error);
    return res.status(500).json({
      error: 'Errore interno del server',
      details: error.message
    });
  }
}
