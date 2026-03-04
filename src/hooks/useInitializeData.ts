import { useEffect } from 'react';
import { useDataStore } from '@/store/dataStore';

export function useInitializeData() {
  const loadData = useDataStore((s) => s.loadData);
  const data = useDataStore((s) => s.data);

  useEffect(() => {
    if (!data) loadData();
  }, []);
}
