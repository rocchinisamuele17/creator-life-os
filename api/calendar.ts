import { createClient } from '@supabase/supabase-js';

// Vercel Serverless Function
export default async function handler(req: any, res: any) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).send('Missing user_id');
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase env vars missing');
    return res.status(500).send('Configuration Error');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('user_data')
    .select('state')
    .eq('user_id', user_id)
    .maybeSingle();

  if (error) {
    console.error('Supabase error:', error);
    return res.status(500).send(`Database Error: ${error.message}`);
  }

  if (!data?.state) {
    return res.status(200).send('BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Creator Life OS//NONSGML v1.0//IT\r\nX-WR-CALNAME:Creator Life OS (No Data)\r\nEND:VCALENDAR');
  }

  const state = data.state;
  const settings = state.settings?.calendar || { syncContent: true, syncBrands: true, syncReminders: true, prefix: "🚀" };
  const events: string[] = [];

  const parseItalianDate = (dateStr: string) => {
    if (!dateStr) return null;
    const months: Record<string, string> = {
      'gen': 'Jan', 'feb': 'Feb', 'mar': 'Mar', 'apr': 'Apr', 'mag': 'May', 'giu': 'Jun',
      'lug': 'Jul', 'ago': 'Aug', 'set': 'Sep', 'ott': 'Oct', 'nov': 'Nov', 'dic': 'Dec'
    };
    
    let normalized = dateStr.toLowerCase();
    for (const [it, en] of Object.entries(months)) {
      if (normalized.includes(it)) {
        normalized = normalized.replace(it, en);
        break;
      }
    }
    
    const now = new Date();
    const d = new Date(`${normalized} ${now.getFullYear()}`);
    return isNaN(d.getTime()) ? null : d;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  // Sync Content
  if (settings.syncContent) {
    (state.content || []).forEach((c: any) => {
      if (c.date && c.status !== "Pubblicato") {
        const eventDate = parseItalianDate(c.date);
        if (eventDate) {
          events.push([
            "BEGIN:VEVENT",
            `SUMMARY:${settings.prefix} Pubblicazione: ${c.title}`,
            `DTSTART:${formatDate(eventDate)}`,
            `DTEND:${formatDate(new Date(eventDate.getTime() + 3600000))}`,
            `DESCRIPTION:Piattaforma: ${c.platform}\\nStatus: ${c.status}`,
            "END:VEVENT"
          ].join("\r\n"));
        }
      }
    });
  }

  // Sync Brands
  if (settings.syncBrands) {
    (state.brands || []).forEach((b: any) => {
      if (b.deadline && b.status !== "Completato") {
        const eventDate = parseItalianDate(b.deadline);
        if (eventDate) {
          events.push([
            "BEGIN:VEVENT",
            `SUMMARY:🤝 Deal: ${b.brand}`,
            `DTSTART:${formatDate(eventDate)}`,
            `DTEND:${formatDate(new Date(eventDate.getTime() + 3600000))}`,
            `DESCRIPTION:Valore: €${b.value}\\nDeliverables: ${b.deliverables}`,
            "END:VEVENT"
          ].join("\r\n"));
        }
      }
    });
  }

  // Sync Reminders
  if (settings.syncReminders) {
    (state.reminders || []).forEach((r: any) => {
      if (r.enabled && r.time) {
        const [hh, mm] = r.time.split(":").map(Number);
        const now = new Date();
        const eventDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm);
        events.push([
          "BEGIN:VEVENT",
          `SUMMARY:🔔 Reminder: ${r.text}`,
          `DTSTART:${formatDate(eventDate)}`,
          `DTEND:${formatDate(new Date(eventDate.getTime() + 1800000))}`,
          "END:VEVENT"
        ].join("\r\n"));
      }
    });
  }

  // Sync Routine (Daily)
  (state.routine || []).forEach((r: any) => {
    if (r.time && r.task) {
      const [hh, mm] = r.time.split(":").map(Number);
      const now = new Date();
      const eventDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm);
      events.push([
        "BEGIN:VEVENT",
        `SUMMARY:⏰ Routine: ${r.task}`,
        `DTSTART:${formatDate(eventDate)}`,
        `DTEND:${formatDate(new Date(eventDate.getTime() + 3600000))}`,
        "RRULE:FREQ=DAILY",
        "END:VEVENT"
      ].join("\r\n"));
    }
  });

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Creator Life OS//NONSGML v1.0//IT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Creator Life OS",
    "X-WR-TIMEZONE:Europe/Rome",
    ...events,
    "END:VCALENDAR"
  ].join("\r\n");

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="calendar.ics"');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.status(200).send(icsContent);
}
