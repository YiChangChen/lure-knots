import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

// 結沿用舊的 key，升級後舊使用者的進度不會遺失；章另開一個 key。
const KNOT_KEY = 'lure-knots-learned';
const CHAPTER_KEY = 'lure-knots-chapters-learned';

type Learned = {
  learned: Set<string>;
  toggle: (id: string) => void;
  chaptersDone: Set<string>;
  toggleChapter: (id: string) => void;
};
const LearnedContext = createContext<Learned>({
  learned: new Set(), toggle: () => {}, chaptersDone: new Set(), toggleChapter: () => {},
});

function usePersistedSet(key: string) {
  const [set, setSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    AsyncStorage.getItem(key)
      .then(v => { if (v) setSet(new Set(JSON.parse(v))); })
      .catch(() => {});
  }, [key]);

  const toggle = useCallback((id: string) => {
    setSet(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      AsyncStorage.setItem(key, JSON.stringify([...next])).catch(() => {});
      return next;
    });
  }, [key]);

  return [set, toggle] as const;
}

export function LearnedProvider({ children }: { children: ReactNode }) {
  const [learned, toggle] = usePersistedSet(KNOT_KEY);
  const [chaptersDone, toggleChapter] = usePersistedSet(CHAPTER_KEY);
  return (
    <LearnedContext.Provider value={{ learned, toggle, chaptersDone, toggleChapter }}>
      {children}
    </LearnedContext.Provider>
  );
}

export const useLearned = () => useContext(LearnedContext);
