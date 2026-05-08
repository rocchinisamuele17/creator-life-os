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
  date?: string;
}

export interface MoneyExpense {
  item: string;
  amount: number;
  category: string;
  date?: string;
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
  notes?: string;
}

export interface Goal {
  goal: string;
  progress: number;
}

export type Mood = "great" | "good" | "neutral" | "bad" | "awful";

export interface JournalEntry {
  date: string;
  gratitude: string;
  focus: string;
  reflection: string;
  mood?: Mood;
}

export interface CustomAction {
  id: number;
  text: string;
  completed: boolean;
}

export interface Reminder {
  id: number;
  text: string;
  time: string;
  enabled: boolean;
}

export type BackgroundType = "default" | "gradient" | "solid" | "photo";

export interface BackgroundConfig {
  type: BackgroundType;
  value: string; // gradient CSS, hex color, or base64/URL for photo
}

export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  type: 'content' | 'brand' | 'reminder' | 'custom';
}

export interface SettingsState {
  theme: "cyan" | "orange" | "purple" | "green";
  background?: BackgroundConfig;
  calendarEvents?: CalendarEvent[];
}

export interface RoutineItem {
  time: string;
  task: string;
  done?: boolean;
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
  settings: SettingsState;
  routine?: RoutineItem[];
  streak?: {
    count: number;
    lastDate: string;
  };
  checkedRoutine?: number[];
  customActions?: CustomAction[];
}

