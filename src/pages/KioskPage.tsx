import { useDataStore } from '@/store/dataStore';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/store/useThemeStore';
import LoadingSpinner from '@/components/LoadingSpinner';
import WaveDivider from '@/components/WaveDivider';
import { Coffee, Utensils, CalendarDays, Users, ExternalLink } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { KioskItem, KioskShift } from '@/types';

const TEAM_COLORS: Record<string, string> = {
  green: '#2E7D32',
  blue: '#1565C0',
  red: '#C62828',
};

const TEAM_BG: Record<string, string> = {
  green: 'bg-green-100 text-green-800',
  blue: 'bg-blue-100 text-blue-800',
  red: 'bg-red-100 text-red-800',
};

type Tab = 'menu' | 'schedule' | 'volunteers';

const KioskPage = () => {
  const { t, i18n } = useTranslation();
  const data = useDataStore((s) => s.data);
  const team = useThemeStore((s) => s.team);
  const [tab, setTab] = useState<Tab>('menu');

  const lang = i18n.language?.startsWith('sv') ? 'sv' : 'en';

  const localizeName = (item: KioskItem) =>
    lang === 'sv' ? item.nameSv || item.nameEn : item.nameEn || item.nameSv;

  const localizeNote = (shift: KioskShift) =>
    lang === 'sv' ? shift.notesSv || shift.notesEn : shift.notesEn || shift.notesSv;

  const activeMenu = useMemo(() => {
    if (!data?.kioskMenu) return [];
    return data.kioskMenu.filter((i) => i.active);
  }, [data?.kioskMenu]);

  const groupedMenu = useMemo(() => {
    const groups: Record<string, KioskItem[]> = {};
    activeMenu.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [activeMenu]);

  const upcomingShifts = useMemo(() => {
    if (!data?.kioskShifts) return [];
    const today = new Date().toISOString().slice(0, 10);
    return [...data.kioskShifts]
      .filter((s) => s.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data?.kioskShifts]);

  const eventMap = useMemo(() => {
    if (!data?.events) return {} as Record<string, string>;
    const map: Record<string, string> = {};
    data.events.forEach((e) => {
      map[e.eventId] = lang === 'sv' ? e.nameSv || e.nameEn : e.nameEn || e.nameSv;
    });
    return map;
  }, [data?.events, lang]);

  const fundraising = useMemo(() => {
    if (!data?.kioskFundraising) return [];
    return data.kioskFundraising;
  }, [data?.kioskFundraising]);

  const signupUrl = data?.settings?.['Kiosk Signup URL'] || '';
  const contactEmail = data?.clubContacts?.[0]?.email || '';

  const categoryOrder: KioskItem['category'][] = ['drink', 'food', 'snack'];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(lang === 'sv' ? 'sv-SE' : 'en-GB', {
      weekday: 'short', day: 'numeric', month: 'short',
    });
  };

  if (!data) return <LoadingSpinner />;

  const tabs: { id: Tab; label: string; Icon: React.ElementType }[] = [
    { id: 'menu', label: t('kiosk.tabMenu'), Icon: Utensils },
    { id: 'schedule', label: t('kiosk.tabSchedule'), Icon: CalendarDays },
    { id: 'volunteers', label: t('kiosk.tabVolunteers'), Icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="relative rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-8 overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <Coffee size={28} className="text-primary" />
          <h1 className="font-heading text-3xl font-bold">{t('kiosk.title')}</h1>
        </div>
        <p className="text-muted-foreground max-w-xl">{t('kiosk.subtitle')}</p>
        <WaveDivider className="absolute bottom-0 left-0" />
      </div>

      {/* Fundraising progress */}
      {fundraising.length > 0 && (
        <div className="rounded-xl bg-card border p-5">
          <h2 className="font-heading font-semibold mb-4">{t('kiosk.fundraising')}</h2>
          <div className="space-y-3">
            {fundraising.map((f) => {
              const pct = Math.min(100, Math.round((f.raisedSek / f.goalSek) * 100));
              const color = TEAM_COLORS[f.teamColor] || 'hsl(var(--primary))';
              const isCurrentTeam = team === f.teamColor;
              return (
                <div key={f.teamColor} className={`space-y-1 ${isCurrentTeam ? 'opacity-100' : 'opacity-70'}`}>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${TEAM_BG[f.teamColor] || 'bg-muted'}`}>
                      {t(`teams.${f.teamColor}`)}
                    </span>
                    <span className="text-muted-foreground">
                      {f.raisedSek.toLocaleString()} / {f.goalSek.toLocaleString()} kr
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === id
                ? 'bg-card shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab: Menu */}
      {tab === 'menu' && (
        <div className="space-y-6">
          {activeMenu.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">{t('kiosk.noMenu')}</p>
          ) : (
            categoryOrder
              .filter((cat) => groupedMenu[cat]?.length > 0)
              .map((cat) => (
                <div key={cat}>
                  <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                    {t(`kiosk.categories.${cat}`)}
                  </h3>
                  <div className="rounded-xl bg-card border overflow-hidden divide-y">
                    {groupedMenu[cat].map((item) => (
                      <div key={item.itemId} className="flex items-center justify-between px-4 py-3">
                        <div>
                          <p className="font-medium text-sm">{localizeName(item)}</p>
                          {item.allergens && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {t('kiosk.allergens')}: {item.allergens}
                            </p>
                          )}
                        </div>
                        <span className="font-heading font-bold text-primary ml-4 whitespace-nowrap">
                          {item.priceSek} kr
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* Tab: Schedule */}
      {tab === 'schedule' && (
        <div className="space-y-4">
          {upcomingShifts.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">{t('kiosk.noShifts')}</p>
          ) : (
            upcomingShifts.map((shift) => {
              const eventName = eventMap[shift.eventId] || shift.eventId;
              const note = localizeNote(shift);
              return (
                <div key={shift.shiftId} className="rounded-xl bg-card border p-5 team-border-top">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-heading font-semibold">{eventName}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(shift.date)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground mb-0.5">{t('kiosk.shiftOpen')}</p>
                      <p className="font-medium text-sm">{shift.openTime} – {shift.closeTime}</p>
                    </div>
                  </div>
                  {shift.volunteers.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {shift.volunteers.map((v) => (
                        <span key={v} className="text-xs bg-secondary px-2 py-0.5 rounded-full">{v}</span>
                      ))}
                    </div>
                  )}
                  {note && (
                    <p className="text-xs text-muted-foreground italic">{note}</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab: Volunteers */}
      {tab === 'volunteers' && (
        <div className="space-y-6">
          {/* Sign-up CTA */}
          <div className="rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border p-6 text-center">
            <Users size={32} className="mx-auto mb-3 text-primary" />
            <h2 className="font-heading text-xl font-bold mb-2">{t('kiosk.signUp')}</h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">{t('kiosk.signUpDesc')}</p>
            {signupUrl ? (
              <a
                href={signupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
              >
                <ExternalLink size={15} />
                {t('kiosk.signUpButton')}
              </a>
            ) : contactEmail ? (
              <a
                href={`mailto:${contactEmail}?subject=Kiosk%20Volunteer`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
              >
                {t('kiosk.contactForSignup')}
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">{t('kiosk.contactForSignup')}</p>
            )}
          </div>

          {/* Upcoming shifts with volunteer slots */}
          {upcomingShifts.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">{t('kiosk.noShifts')}</p>
          ) : (
            <div className="space-y-3">
              {upcomingShifts.map((shift) => {
                const eventName = eventMap[shift.eventId] || shift.eventId;
                return (
                  <div key={shift.shiftId} className="rounded-xl bg-card border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm">{eventName}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(shift.date)} · {shift.openTime} – {shift.closeTime}</p>
                      </div>
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded-full shrink-0">
                        {shift.volunteers.length} {t('kiosk.shiftVolunteers').toLowerCase()}
                      </span>
                    </div>
                    {shift.volunteers.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {shift.volunteers.map((v) => (
                          <span key={v} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{v}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">— {lang === 'sv' ? 'Inga volontärer ännu' : 'No volunteers yet'} —</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KioskPage;
