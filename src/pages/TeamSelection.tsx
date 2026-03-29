import { useNavigate } from 'react-router-dom';
import { useThemeStore, Team } from '@/store/useThemeStore';
import { useDataStore } from '@/store/dataStore';
import { useTranslation } from 'react-i18next';
import OptimistBoat from '@/components/OptimistBoat';
import WaveDivider from '@/components/WaveDivider';
import { TEAMS, getClubName, getTeamAgeRange } from '@/config/clubConfig';

const TeamSelection = () => {
  const navigate = useNavigate();
  const { setTeam } = useThemeStore();
  const { data } = useDataStore();
  const { t, i18n } = useTranslation();
  const settings = data?.settings || {};
  const lang = (i18n.language?.startsWith('sv') ? 'sv' : 'en') as 'sv' | 'en';

  const handleSelect = (team: Team) => {
    setTeam(team);
    navigate('/dashboard');
  };

  const teams = TEAMS.map(team => ({
    id: team.id,
    color: team.color,
    ageRange: getTeamAgeRange(settings, team.id),
  }));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Background wave pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg className="absolute bottom-0 left-0 w-full wave-sway" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,80 C360,140 720,20 1080,80 C1260,110 1380,60 1440,80 L1440,200 L0,200 Z" fill="hsl(var(--ocean-blue) / 0.15)" />
          <path d="M0,120 C240,160 480,60 720,120 C960,180 1200,80 1440,120 L1440,200 L0,200 Z" fill="hsl(var(--ocean-blue) / 0.08)" />
        </svg>
      </div>

      {/* Header */}
      <div className="text-center mb-10 z-10">
        <OptimistBoat size={64} color="hsl(var(--ocean-blue))" className="mx-auto mb-4" />
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">
          {getClubName(settings, lang)}
        </h1>
        <p className="text-lg text-muted-foreground font-body">Sail — {t('teamSelection.subtitle')}</p>
      </div>

      {/* Team cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto px-4 z-10">
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => handleSelect(team.id)}
            className="sail-unfurl group rounded-xl p-8 text-left border-2 border-transparent hover:border-current transition-all duration-500"
            style={{
              background: `linear-gradient(135deg, ${team.color}15, ${team.color}30)`,
              color: team.color,
            }}
          >
            <div className="mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
              <OptimistBoat size={56} color={team.color} />
            </div>
            <h2 className="font-heading text-2xl font-bold mb-1">
              {t('teamSelection.teams.' + team.id + '.name')}
            </h2>
            <p className="text-sm opacity-70 font-medium mb-2">{team.ageRange}</p>
            <p className="text-sm opacity-60 font-body">
              {t('teamSelection.teams.' + team.id + '.description')}
            </p>
          </button>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground z-10">{t('teamSelection.choosePrompt')}</p>

      <WaveDivider className="absolute bottom-0 left-0 w-full" />
    </div>
  );
};

export default TeamSelection;
