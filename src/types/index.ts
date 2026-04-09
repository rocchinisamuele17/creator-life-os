export type ContentStatus =
  | "Idea"
  | "Script"
  | "Pronto"
  | "Pubblicato"
  | "Analisi";

export interface ContentItem {
  id: number;
  title: string;
  platform: string;
  status: ContentStatus;
  hook: string;
  date: string;
  views: string;
  engagement: string;
}

export interface MoneyEntry {
  source: string;
  amount: number;
  type: string;
}

export interface MoneyExpense {
  item: string;
  amount: number;
  category: string;
}

export interface Habit {
  name: string;
  days: boolean[];
}

export type BrandStatus =
  | "Attivo"
  | "Negoziazione"
  | "Proposta"
  | "Completato";

export interface BrandDeal {
  brand: string;
  status: BrandStatus;
  value: number;
  deadline: string;
  deliverables: string;
  paid: boolean;
}

export interface Goal {
  goal: string;
  progress: number;
}

export interface JournalEntry {
  date: string;
  gratitude: string;
  focus: string;
  reflection: string;
}

export interface Reminder {
  id: number;
  text: string;
  time: string;
  enabled: boolean;
}

export interface AppState {
  content: ContentItem[];
  entrate: MoneyEntry[];
  spese: MoneyExpense[];
  habits: Habit[];
  brands: BrandDeal[];
  goals: Goal[];
  journal: JournalEntry[];
  reminders: Reminder[];
}
