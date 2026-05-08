export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function sendNotification(title: string, body: string) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  new Notification(title, {
    body,
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>",
  });
}

let intervalId: number | null = null;

export function startReminderScheduler(
  getReminders: () => { text: string; time: string; enabled: boolean }[]
) {
  if (intervalId) clearInterval(intervalId);

  intervalId = window.setInterval(() => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const reminders = getReminders();
    for (const r of reminders) {
      if (r.enabled && r.time === currentTime) {
        sendNotification("Creator Life OS", r.text);
      }
    }
  }, 60_000);
}

export function stopReminderScheduler() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
