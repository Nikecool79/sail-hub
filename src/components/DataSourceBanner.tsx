import { useTranslation } from 'react-i18next';
import { useDataStore } from '@/store/dataStore';
import { Info } from 'lucide-react';

export default function DataSourceBanner() {
  const { t } = useTranslation();
  const dataSource = useDataStore((s) => s.dataSource);

  if (dataSource !== 'sample-data') return null;

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-center text-sm text-yellow-800 flex items-center justify-center gap-2">
      <Info size={14} />
      {t('common.sampleDataBanner')}
    </div>
  );
}
