import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // First check direct key
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }

      // Check backward compatibility with muduo_study_v5_state
      const v5Raw = window.localStorage.getItem('muduo_study_v5_state');
      if (v5Raw) {
        const v5 = JSON.parse(v5Raw);
        if (key === 'completedAlgos' && v5?.learningSystem?.completedAlgos) {
          return v5.learningSystem.completedAlgos;
        }
        if (key === 'knowledgeMastery' && v5?.knowledgeMastery) {
          return v5.knowledgeMastery;
        }
        if (key === 'knowledgeFavorites' && v5?.knowledgeFavorites) {
          return v5.knowledgeFavorites;
        }
      }

      return initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));

      // Also mirror to muduo_study_v5_state for full 100% backward compatibility
      if (key === 'completedAlgos' || key === 'knowledgeMastery' || key === 'knowledgeFavorites') {
        try {
          const v5Raw = window.localStorage.getItem('muduo_study_v5_state');
          const v5 = v5Raw ? JSON.parse(v5Raw) : {};
          if (key === 'completedAlgos') {
            if (!v5.learningSystem) v5.learningSystem = {};
            v5.learningSystem.completedAlgos = valueToStore;
          } else {
            v5[key] = valueToStore;
          }
          window.localStorage.setItem('muduo_study_v5_state', JSON.stringify(v5));
        } catch (e) {
          // ignore mirror error
        }
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
