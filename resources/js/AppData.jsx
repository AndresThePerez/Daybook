import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { categories as categoriesApi } from './lib/api';

const AppDataContext = createContext({ categories: [], reloadCategories: () => {} });

export function AppDataProvider({ children }) {
  const [categories, setCategories] = useState([]);

  const reloadCategories = useCallback(() => {
    categoriesApi.list().then((res) => setCategories(res.data ?? res)).catch(() => setCategories([]));
  }, []);

  useEffect(() => { reloadCategories(); }, [reloadCategories]);

  return (
    <AppDataContext.Provider value={{ categories, reloadCategories }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}
