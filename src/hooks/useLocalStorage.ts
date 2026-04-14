import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { loadState, saveState } from "../lib/storage";

export function usePersistedState<T extends object>(initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    const loaded = loadState<Partial<T>>(initial);
    // Merge loaded state with defaults to fill missing fields from schema updates
    return { ...initial, ...loaded };
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  return [state, setState];
}
