import { createContext, useContext } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { AppState } from "../types";
import { usePersistedState } from "../hooks/useLocalStorage";
import { SEED_STATE } from "../lib/seed";

interface AppContextValue {
  state: AppState;
  setState: Dispatch<SetStateAction<AppState>>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = usePersistedState<AppState>(SEED_STATE);
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
