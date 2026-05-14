import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("user_id");
    const token = url.searchParams.get("token");

    // 1) Verify security token
    const expectedToken = Deno.env.get("CALENDAR_FEED_TOKEN");
    if (!expectedToken) {
      return new Response("Server misconfiguration: CALENDAR_FEED_TOKEN not set", { status: 500 });
    }
    if (!token || token !== expectedToken) {
      return new Response("Non autorizzato", { status: 401 });
    }
    if (!userId) {
      return new Response("Missing user_id", { status: 400 });
    }

    // 2) Initialize Supabase (service role)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // 3) Fetch user data
    const { data, error } = await supabase
      .from("user_data")
      .select("state")
      .eq("user_id", userId)
      .single();

    if (error || !data) return new Response("Dati non trovati", { status: 404 });

    const state: any = data.state;
    const events: string[] = [];
    const year = new Date().getFullYear();

    // Helper for ICS date: YYYYMMDDTHHMMSSZ
    const formatICSDate = (date: Date) =>
      date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    // Helper to normalize "DD MMM" (IT) -> Date
    const parseItDate = (dateStr: string) => {
      if (!dateStr || dateStr === "—") return null;
      const monthsIT: Record<string, string> = {
        Gen: "Jan",
        Feb: "Feb",
        Mar: "Mar",
        Apr: "Apr",
        Mag: "May",
        Giu: "Jun",
        Lug: "Jul",
        Ago: "Aug",
        Set: "Sep",
        Ott: "Oct",
        Nov: "Nov",
        Dic: "Dec",
      };
      let processed = dateStr;
      for (const it in monthsIT) {
        if (dateStr.includes(it)) processed = dateStr.replace(it, monthsIT[it]);
      }
      const d = new Date(`${processed} ${year}`);
      return isNaN(d.getTime()) ? null : d;
    };

    // 4) Content Machine -> Events
    state.content?.forEach((c: any) => {
      const d = parseItDate(c.date);
      if (!d) return;
      events.push(
        [
          "BEGIN:VEVENT",
          `SUMMARY:🎬 [${c.platform}] ${c.title}`,
          `DTSTART:${formatICSDate(d)}`,
          `DTEND:${formatICSDate(new Date(d.getTime() + 3600000))}`,
          `DESCRIPTION:Status: ${c.status}\\nHook: ${c.hook}`,
          "END:VEVENT",
        ].join("\n")
      );
    });

    // 5) Brand Deals -> Events
    state.brands?.forEach((b: any) => {
      const d = parseItDate(b.deadline);
      if (!d) return;
      events.push(
        [
          "BEGIN:VEVENT",
          `SUMMARY:🤝 Deal: ${b.brand}`,
          `DTSTART:${formatICSDate(d)}`,
          `DTEND:${formatICSDate(new Date(d.getTime() + 3600000))}`,
          `DESCRIPTION:Valore: €${b.value}\\nDeliverables: ${b.deliverables}`,
          "END:VEVENT",
        ].join("\n")
      );
    });

    // 6) Generate ICS
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Prodigi//Creator Life OS//IT",
      "X-WR-CALNAME:Prodigi - Creator Life OS",
      "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
      ...events,
      "END:VCALENDAR",
    ].join("\n");

    return new Response(icsContent, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/calendar; charset=utf-8",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message ?? String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
    });
  }
});
