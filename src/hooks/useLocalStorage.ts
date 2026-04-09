import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { loadState, saveState } from "../lib/storage";

export function usePersistedState<T>(initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => loadState<T>(initial));

  useEffect(() => {
    saveState(state);
  }, [state]);

  return [state, setState];
}
