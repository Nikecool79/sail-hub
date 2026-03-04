import { useThemeStore } from '@/store/useThemeStore';
import { Sun, Moon, ArrowLeftRight, Languages } from 'lucide-react';
import OptimistBoat from '@/components/OptimistBoat';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AppHeader = () => {
  const { team, mode, toggleMode, setTeam } = useThemeStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const teamLabel = team ? t(`teams.${team}`) : '';
  const currentLang = i18n.language?.startsWith('sv') ? 'sv' : 'en';

  const toggleLanguage = () => {
    const next = currentLang === 'sv' ? 'en' : 'sv';
    i18n.changeLanguage(next);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 border-b bg-card/80 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <OptimistBoat size={28} color="hsl(var(--primary))" />
        <span className="font-heading font-semibold text-lg hidden sm:inline">Kullaviks SS</span>
      </div>

      <div className="flex items-center gap-3">
        {team && (
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="hidden sm:inline">{teamLabel}</span>
          </div>
        )}

        <button
          onClick={toggleLanguage}
          className="p-2 rounded-md hover:bg-secondary transition-colors text-xs font-bold"
          aria-label="Toggle language"
        >
          {currentLang === 'sv' ? 'EN' : 'SV'}
        </button>

        <button
          onClick={toggleMode}
          className="p-2 rounded-md hover:bg-secondary transition-colors"
          aria-label="Toggle day/night mode"
        >
          {mode === 'day' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {team && (
          <button
            onClick={() => { setTeam(null); navigate('/'); }}
            className="text-xs px-2 py-1 rounded-md border hover:bg-secondary transition-colors flex items-center gap-1"
          >
            <ArrowLeftRight size={12} />
            <span className="hidden sm:inline">{t('teams.changeTeam')}</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
