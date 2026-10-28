import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

const KEY = 'lure-knots-learned';

type Learned = { learned: Set<string>; toggle: (id: string) => void };
const LearnedContext = createContext<Learned>({ learned: new Set(), toggle: () => {} });

export function LearnedProvider({ children }: { children: ReactNode }) {
  const [learned, setLearned] = useState<Set<string>>(new Set());

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then(v => { if (v) setLearned(new Set(JSON.parse(v))); })
      .catch(() => {});
  }, []);

  const toggle = useCallback((id: string) => {
    setLearned(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      AsyncStorage.setItem(KEY, JSON.stringify([...next])).catch(() => {});
      return next;
    });
  }, []);

  return <LearnedContext.Provider value={{ learned, toggle }}>{children}</LearnedContext.Provider>;
}

export const useLearned = () => useContext(LearnedContext);
