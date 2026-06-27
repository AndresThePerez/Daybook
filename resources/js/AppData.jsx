import { createContext, useContext, useEffect, useState } from 'react';
import { categories as categoriesApi } from './lib/api';

const AppDataContext = createContext({ categories: [] });

export function AppDataProvider({ children }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoriesApi.list().then((res) => setCategories(res.data ?? res)).catch(() => {});
  }, []);

  return <AppDataContext.Provider value={{ categories }}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  return useContext(AppDataContext);
}
