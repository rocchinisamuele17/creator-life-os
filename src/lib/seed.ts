import type { AppState } from "../types";

export const SEED_STATE: AppState = {
  content: [
    { id: 1, title: "5 bugie che ti racconti da freelancer", platform: "Instagram Reel", status: "Pubblicato", hook: "Nessuno te lo dirà mai, ma...", date: "07 Apr", views: "12.4K", engagement: "8.2%" },
    { id: 2, title: "Come ho perso 3 clienti in una settimana", platform: "TikTok", status: "Pronto", hook: "Il giorno che ho capito tutto", date: "09 Apr", views: "—", engagement: "—" },
    { id: 3, title: "Il metodo 3-3-3 per content creator", platform: "Instagram Reel", status: "Script", hook: "Stai sprecando 4 ore al giorno", date: "11 Apr", views: "—", engagement: "—" },
    { id: 4, title: "Perché i tuoi Reel non funzionano", platform: "Instagram Carousel", status: "Idea", hook: "—", date: "13 Apr", views: "—", engagement: "—" },
    { id: 5, title: "Setup minimalista da creator", platform: "YouTube Short", status: "Idea", hook: "—", date: "15 Apr", views: "—", engagement: "—" },
    { id: 6, title: "Il tuo tempo vale più di 0€", platform: "Instagram Reel", status: "Script", hook: "Se lavori gratis, non sei generoso", date: "12 Apr", views: "—", engagement: "—" },
  ],
  entrate: [
    { source: "Template Notion — Follow-up Machine", amount: 870, type: "Prodotto" },
    { source: "Brand Deal — NordVPN", amount: 1200, type: "Sponsorship" },
    { source: "Affiliazione Canva Pro", amount: 340, type: "Affiliazione" },
    { source: "Consulenza 1:1 — Marco R.", amount: 250, type: "Servizio" },
    { source: "Freelance Client Machine", amount: 490, type: "Prodotto" },
  ],
  spese: [
    { item: "Canva Pro", amount: 12, category: "Tool" },
    { item: "N8N Cloud", amount: 20, category: "Tool" },
    { item: "Dominio + Hosting", amount: 15, category: "Infra" },
    { item: "Microfono Rode", amount: 89, category: "Attrezzatura" },
    { item: "Ring Light", amount: 35, category: "Attrezzatura" },
  ],
  habits: [
    { name: "Meditazione 10min", days: [true, true, false, true, true, true, false] },
    { name: "Palestra", days: [true, false, true, false, true, false, true] },
    { name: "Lettura 20 pagine", days: [true, true, true, true, false, true, true] },
    { name: "Niente social fino 10:00", days: [false, true, true, true, true, false, true] },
    { name: "Journaling serale", days: [true, true, false, true, true, true, true] },
  ],
  brands: [
    { brand: "NordVPN", status: "Attivo", value: 1200, deadline: "30 Apr", deliverables: "2 Reel + 1 Story", paid: true },
    { brand: "Skillshare", status: "Negoziazione", value: 800, deadline: "15 Mag", deliverables: "1 Reel + Link bio", paid: false },
    { brand: "Notion", status: "Proposta", value: 500, deadline: "—", deliverables: "1 Video tutorial", paid: false },
    { brand: "Adobe Express", status: "Completato", value: 950, deadline: "20 Mar", deliverables: "3 Reel", paid: true },
  ],
  goals: [
    { goal: "Raggiungere 10K follower Instagram", progress: 72 },
    { goal: "Lanciare Creator Life OS", progress: 45 },
    { goal: "5 brand deal chiusi", progress: 60 },
    { goal: "30 Reel pubblicati", progress: 40 },
  ],
  journal: [],
  reminders: [
    { id: 1, text: "Pubblicare Reel giornaliero", time: "09:00", enabled: true },
    { id: 2, text: "Check analytics", time: "18:00", enabled: true },
    { id: 3, text: "Review settimanale", time: "18:00", enabled: false },
  ],
};
