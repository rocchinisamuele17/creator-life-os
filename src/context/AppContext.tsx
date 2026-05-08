import { createContext, useContext, useEffect, useCallback, useRef } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { AppState } from "../types";
import { usePersistedState } from "../hooks/useLocalStorage";
import { SEED_STATE } from "../lib/seed";
import { supabase, supabaseConfigured } from "../lib/supabase";
import { useAuth } from "./AuthContext";

interface AppContextValue {
  state: AppState;
  setState: Dispatch<SetStateAction<AppState>>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = usePersistedState<AppState>(SEED_STATE);
  const { user } = useAuth();
  const syncTimeoutRef = useRef<number | null>(null);
  const initialLoadDone = useRef(false);

  // Load from Supabase on login
  useEffect(() => {
    if (!supabase || !supabaseConfigured || !user) {
      initialLoadDone.current = false;
      return;
    }

    supabase
      .from("user_data")
      .select("state")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.state) {
          setState(data.state as AppState);
        } else {
          // First time: create row with current local state
          supabase!
            .from("user_data")
            .upsert({ user_id: user.id, state })
            .then(() => {});
        }
        initialLoadDone.current = true;
      });
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced sync to Supabase on state change
  const syncToSupabase = useCallback(
    (newState: AppState) => {
      if (!supabase || !supabaseConfigured || !user || !initialLoadDone.current) return;

      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = window.setTimeout(() => {
        supabase!
          .from("user_data")
          .upsert({ user_id: user.id, state: newState, updated_at: new Date().toISOString() })
          .then(({ error }) => {
            if (error) {
              console.error("Sync error:", error);
            }
          });
      }, 1500);
    },
    [user]
  );

  useEffect(() => {
    syncToSupabase(state);
  }, [state, syncToSupabase]);

  // Gestione Tema
  useEffect(() => {
    const root = document.documentElement;
    const theme = state.settings?.theme || "cyan";
    
    root.setAttribute("data-theme", theme);

    switch (theme) {
      case "cyan":
        root.style.setProperty("--accent-color", "#00f0ff");
        root.style.setProperty("--accent-gradient", "linear-gradient(135deg, #00f0ff 0%, #7000ff 100%)");
        break;
      case "orange":
        root.style.setProperty("--accent-color", "#ff7300");
        root.style.setProperty("--accent-gradient", "linear-gradient(135deg, #ff7300 0%, #ff004c 100%)");
        break;
      case "purple":
        root.style.setProperty("--accent-color", "#b026ff");
        root.style.setProperty("--accent-gradient", "linear-gradient(135deg, #b026ff 0%, #3b00ff 100%)");
        break;
      case "green":
        root.style.setProperty("--accent-color", "#00ff41");
        root.style.setProperty("--accent-gradient", "linear-gradient(135deg, #00ff41 0%, #008f11 100%)");
        break;
    }
  }, [state.settings?.theme]);

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within <AppProvider>");
  return ctx;
}
