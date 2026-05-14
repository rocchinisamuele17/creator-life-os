
const SEED_STATE = {
  content: [
    { id: 1, title: "Test Video", platform: "TikTok", status: "Pronto", date: "15 May" },
  ],
  brands: [
    { brand: "Test Brand", status: "Attivo", value: 500, deadline: "20 May", deliverables: "1 Post" },
  ],
  reminders: [
    { text: "Test Reminder", time: "10:00", enabled: true },
  ],
  settings: {
    calendarEvents: [
      { title: "Custom Event", date: "2026-05-25", type: "custom" }
    ]
  }
};

function formatDate(date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function testParsing() {
  const events = [];
  const now = new Date();
  const year = now.getFullYear();

  // Content
  SEED_STATE.content.forEach(c => {
    const eventDate = new Date(`${c.date} ${year}`);
    events.push(`SUMMARY: 🚀 [${c.platform}] ${c.title}\nDTSTART:${formatDate(eventDate)}`);
  });

  // Brands
  SEED_STATE.brands.forEach(b => {
    const eventDate = new Date(`${b.deadline} ${year}`);
    events.push(`SUMMARY: 🤝 Deal: ${b.brand}\nDTSTART:${formatDate(eventDate)}`);
  });

  // Reminders
  SEED_STATE.reminders.forEach(r => {
    const [hh, mm] = r.time.split(":").map(Number);
    const eventDate = new Date(now.setHours(hh, mm, 0, 0));
    events.push(`SUMMARY: 🔔 Reminder: ${r.text}\nDTSTART:${formatDate(eventDate)}\nRRULE:FREQ=DAILY`);
  });

  console.log("=== TEST ICS OUTPUT ===");
  console.log("BEGIN:VCALENDAR\nVERSION:2.0\n" + events.join("\n") + "\nEND:VCALENDAR");
}

testParsing();
