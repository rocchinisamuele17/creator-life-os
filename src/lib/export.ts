import { jsPDF } from "jspdf";
import type { AppState } from "../types";

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportContentCSV(state: AppState) {
  const header = "ID,Titolo,Piattaforma,Status,Hook,Data,Views,Engagement";
  const rows = state.content.map(
    (c) =>
      `${c.id},"${c.title}","${c.platform}","${c.status}","${c.hook}","${c.date}","${c.views}","${c.engagement}"`
  );
  downloadFile([header, ...rows].join("\n"), "contenuti.csv", "text/csv");
}

export function exportMoneyCSV(state: AppState) {
  let csv = "Tipo,Fonte/Voce,Importo,Categoria\n";
  for (const e of state.entrate) {
    csv += `Entrata,"${e.source}",${e.amount},"${e.type}"\n`;
  }
  for (const e of state.spese) {
    csv += `Spesa,"${e.item}",${e.amount},"${e.category}"\n`;
  }
  downloadFile(csv, "finanze.csv", "text/csv");
}

export function exportBrandsCSV(state: AppState) {
  const header = "Brand,Status,Valore,Scadenza,Deliverables,Pagato";
  const rows = state.brands.map(
    (b) =>
      `"${b.brand}","${b.status}",${b.value},"${b.deadline}","${b.deliverables}",${b.paid ? "Si" : "No"}`
  );
  downloadFile([header, ...rows].join("\n"), "brand-deals.csv", "text/csv");
}

export function exportAllPDF(state: AppState) {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  const addTitle = (text: string) => {
    doc.setFontSize(16);
    doc.setTextColor(249, 115, 22);
    doc.text(text, margin, y);
    y += 10;
  };

  const addSubtitle = (text: string) => {
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(text, margin, y);
    y += 7;
  };

  const addLine = (text: string) => {
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const lines = doc.splitTextToSize(text, 170);
    for (const line of lines) {
      if (y > 275) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 5;
    }
  };

  const addSpace = () => {
    y += 5;
  };

  // Header
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  doc.text("Creator Life OS — Report", margin, y);
  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generato il ${new Date().toLocaleDateString("it-IT")}`, margin, y);
  y += 14;

  // Finanze
  const totalIn = state.entrate.reduce((s, e) => s + e.amount, 0);
  const totalOut = state.spese.reduce((s, e) => s + e.amount, 0);
  addTitle("Finanze");
  addLine(`Entrate totali: EUR ${totalIn.toLocaleString()}`);
  addLine(`Spese totali: EUR ${totalOut}`);
  addLine(`Netto: EUR ${(totalIn - totalOut).toLocaleString()}`);
  addSpace();
  addSubtitle("Dettaglio Entrate");
  for (const e of state.entrate) {
    addLine(`  + EUR ${e.amount} — ${e.source} (${e.type})`);
  }
  addSpace();
  addSubtitle("Dettaglio Spese");
  for (const e of state.spese) {
    addLine(`  - EUR ${e.amount} — ${e.item} (${e.category})`);
  }
  y += 8;

  // Contenuti
  addTitle("Contenuti");
  for (const c of state.content) {
    addLine(`[${c.status}] ${c.title} — ${c.platform} (${c.date})`);
    if (c.hook !== "—") addLine(`  Hook: ${c.hook}`);
    if (c.views !== "—") addLine(`  Views: ${c.views} | Engagement: ${c.engagement}`);
  }
  y += 8;

  // Brand Deals
  addTitle("Brand Deals");
  for (const b of state.brands) {
    addLine(
      `${b.brand} — EUR ${b.value} [${b.status}] ${b.paid ? "(Pagato)" : "(Non pagato)"}`
    );
    addLine(`  Deliverables: ${b.deliverables} | Scadenza: ${b.deadline}`);
  }
  y += 8;

  // Obiettivi
  addTitle("Obiettivi Q2");
  for (const g of state.goals) {
    addLine(`${g.goal}: ${g.progress}%`);
  }

  doc.save("creator-life-os-report.pdf");
}
