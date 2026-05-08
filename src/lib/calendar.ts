import type { AppState } from "../types";

export function generateICS(state: AppState): string {
  const settings = { syncContent: true, syncBrands: true, syncReminders: true, prefix: "🚀" };
  const events: string[] = [];

  // Helper to format date for ICS (YYYYMMDDTHHMMSSZ)
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  // Sync Content
  if (settings.syncContent) {
    state.content.forEach(c => {
      if (c.date && c.status !== "Pubblicato") {
        // Tentative parsing of "DD MMM"
        const now = new Date();
        const eventDate = new Date(`${c.date} ${now.getFullYear()}`);
        if (isNaN(eventDate.getTime())) return;

        events.push([
          "BEGIN:VEVENT",
          `SUMMARY:${settings.prefix} Pubblicazione: ${c.title}`,
          `DTSTART:${formatDate(eventDate)}`,
          `DTEND:${formatDate(new Date(eventDate.getTime() + 3600000))}`,
          `DESCRIPTION:Piattaforma: ${c.platform}\\nStatus: ${c.status}`,
          "END:VEVENT"
        ].join("\n"));
      }
    });
  }

  // Sync Brands
  if (settings.syncBrands) {
    state.brands.forEach(b => {
      if (b.deadline && b.status !== "Completato") {
        const now = new Date();
        const eventDate = new Date(`${b.deadline} ${now.getFullYear()}`);
        if (isNaN(eventDate.getTime())) return;

        events.push([
          "BEGIN:VEVENT",
          `SUMMARY:🤝 Deal: ${b.brand}`,
          `DTSTART:${formatDate(eventDate)}`,
          `DTEND:${formatDate(new Date(eventDate.getTime() + 3600000))}`,
          `DESCRIPTION:Valore: €${b.value}\\nDeliverables: ${b.deliverables}`,
          "END:VEVENT"
        ].join("\n"));
      }
    });
  }

  // Sync Reminders
  if (settings.syncReminders) {
    (state.reminders || []).forEach(r => {
      if (r.enabled) {
        const now = new Date();
        const [hh, mm] = r.time.split(":").map(Number);
        const eventDate = new Date(now.setHours(hh, mm, 0, 0));

        events.push([
          "BEGIN:VEVENT",
          `SUMMARY:🔔 Reminder: ${r.text}`,
          `DTSTART:${formatDate(eventDate)}`,
          `DTEND:${formatDate(new Date(eventDate.getTime() + 1800000))}`,
          "RRULE:FREQ=DAILY",
          "END:VEVENT"
        ].join("\n"));
      }
    });
  }

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Creator Life OS//NONSGML v1.0//IT",
    ...events,
    "END:VCALENDAR"
  ].join("\n");
}

export function downloadICS(content: string) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", "creator-life-os-calendar.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
