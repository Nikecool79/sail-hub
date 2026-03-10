import { useDataStore } from '@/store/dataStore';
import { useTranslation } from 'react-i18next';
import { useLocalizedField } from '@/hooks/useLocalizedField';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sailboat, Anchor, Wrench, AlertTriangle, CheckCircle2, XCircle, Lock } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { useMemo } from 'react';

function getDateStatus(dateStr: string): 'green' | 'yellow' | 'red' | 'none' {
  if (!dateStr) return 'none';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'none';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMonths = diffMs / (1000 * 60 * 60 * 24 * 30.44);
  if (diffMonths < 3) return 'green';
  if (diffMonths < 6) return 'yellow';
  return 'red';
}

const dateStatusColors: Record<string, string> = {
  green: 'bg-green-500/15 text-green-700 border-green-300',
  yellow: 'bg-yellow-500/15 text-yellow-700 border-yellow-300',
  red: 'bg-red-500/15 text-red-700 border-red-300',
  none: 'bg-muted text-muted-foreground border-border',
};

const dateStatusDot: Record<string, string> = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  none: 'bg-muted-foreground/40',
};

const boatStatusConfig: Record<string, { className: string; icon: typeof CheckCircle2 }> = {
  Available: { className: 'bg-green-500/15 text-green-700 border-green-300', icon: CheckCircle2 },
  'In Repair': { className: 'bg-yellow-500/15 text-yellow-700 border-yellow-300', icon: Wrench },
  Retired: { className: 'bg-muted text-muted-foreground border-border', icon: XCircle },
  'Lent Out': { className: 'bg-blue-500/15 text-blue-700 border-blue-300', icon: Sailboat },
  Private: { className: 'bg-blue-500/15 text-blue-700 border-blue-300', icon: Lock },
};

const ribStatusConfig: Record<string, { className: string; icon: typeof CheckCircle2 }> = {
  OK: { className: 'bg-green-500/15 text-green-700 border-green-300', icon: CheckCircle2 },
  'Needs Service': { className: 'bg-yellow-500/15 text-yellow-700 border-yellow-300', icon: AlertTriangle },
  'Out of Service': { className: 'bg-red-500/15 text-red-700 border-red-300', icon: XCircle },
};

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const FleetPage = () => {
  const { t } = useTranslation();
  const { localize } = useLocalizedField();
  const data = useDataStore(s => s.data);
  const { team } = useThemeStore();

  const boats = useMemo(() => {
    if (!data) return [];
    if (!team) return data.boats;
    return data.boats.filter(b => b.team?.toLowerCase() === team.toLowerCase());
  }, [data, team]);

  const ribs = useMemo(() => {
    if (!data) return [];
    const filtered = !team ? data.ribs : data.ribs.filter(r =>
      r.teams.length === 0 || r.teams.includes('All') || r.teams.some(t => t.toLowerCase() === team.toLowerCase())
    );
    return [...filtered].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [data, team]);

  const boatSummary = useMemo(() => {
    const total = boats.length;
    const available = boats.filter(b => b.status === 'Available').length;
    return { available, total };
  }, [boats]);

  if (!data) return <LoadingSpinner />;

  // Group boats by team
  const sortedBoats = [...boats].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  const boatsByTeam = sortedBoats.reduce<Record<string, typeof boats>>((acc, b) => {
    const grp = b.team || 'Unassigned';
    if (!acc[grp]) acc[grp] = [];
    acc[grp].push(b);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">{t('fleet.title')}</h1>

      <Tabs defaultValue="boats">
        <TabsList>
          <TabsTrigger value="boats" className="gap-2">
            <Sailboat size={16} /> {t('fleet.optimistBoats')}
          </TabsTrigger>
          <TabsTrigger value="ribs" className="gap-2">
            <Anchor size={16} /> {t('fleet.ribs')}
          </TabsTrigger>
        </TabsList>

        {/* === BOATS TAB === */}
        <TabsContent value="boats" className="space-y-4 mt-4">
          {boats.length === 0 ? (
            <div className="rounded-xl bg-card border p-8 text-center text-muted-foreground">
              <Sailboat size={40} className="mx-auto mb-3 opacity-40" />
              <p>{t('fleet.noBoats')}</p>
            </div>
          ) : (
            <>
              {/* Summary bar */}
              <div className="flex items-center gap-3 rounded-lg bg-card border p-4">
                <Sailboat size={20} className="text-primary" />
                <span className="text-sm font-medium">
                  {t('fleet.boatSummary', { available: boatSummary.available, total: boatSummary.total })}
                </span>
              </div>

              {/* Boats table grouped by team */}
              {Object.entries(boatsByTeam).map(([team, teamBoats]) => {
                const isPrivateTeam = team.toLowerCase() === 'blue' || team.toLowerCase() === 'red';
                return (
                <div key={team} className="space-y-2">
                  <h3 className="font-heading text-lg font-semibold">
                    {t('fleet.team')}: {team}
                  </h3>
                  <div className="rounded-xl bg-card border overflow-hidden overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary">
                        <tr>
                          {!isPrivateTeam && <th className="text-left p-3 font-medium">{t('fleet.boatId')}</th>}
                          <th className="text-left p-3 font-medium">{t('fleet.name')}</th>
                          <th className="text-left p-3 font-medium">{t('fleet.sailNumber')}</th>
                          <th className="text-left p-3 font-medium">{t('fleet.status')}</th>
                          <th className="text-left p-3 font-medium">{t('fleet.space')}</th>
                          <th className="text-left p-3 font-medium">{t('fleet.conditionNotes')}</th>
                          <th className="text-left p-3 font-medium">{t('fleet.lastInspection')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamBoats.map(b => {
                          const statusConf = boatStatusConfig[b.status] || boatStatusConfig.Available;
                          const StatusIcon = statusConf.icon;
                          const statusKey = b.status === 'Available' ? 'available' : b.status === 'In Repair' ? 'inRepair' : b.status === 'Retired' ? 'retired' : b.status === 'Private' ? 'private' : 'lentOut';
                          return (
                            <tr key={b.boatId} className="border-t">
                              {!isPrivateTeam && <td className="p-3 font-mono text-xs">{b.boatId}</td>}
                              <td className="p-3 font-medium">{b.name}</td>
                              <td className="p-3">{b.sailNumber}</td>
                              <td className="p-3 text-muted-foreground">{b.space || '—'}</td>
                              <td className="p-3">
                                <Badge variant="outline" className={`gap-1 ${statusConf.className}`}>
                                  <StatusIcon size={12} />
                                  {t(`fleet.${statusKey}`)}
                                </Badge>
                              </td>
                              <td className="p-3 text-muted-foreground max-w-[200px] truncate">
                                {localize(b, 'conditionNotes')}
                              </td>
                              <td className="p-3 text-muted-foreground">
                                {formatDate(b.lastInspectionDate)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                );
              })}
            </>
          )}
        </TabsContent>

        {/* === RIBS TAB === */}
        <TabsContent value="ribs" className="space-y-4 mt-4">
          {ribs.length === 0 ? (
            <div className="rounded-xl bg-card border p-8 text-center text-muted-foreground">
              <Anchor size={40} className="mx-auto mb-3 opacity-40" />
              <p>{t('fleet.noRibs')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {ribs.map(rib => {
                const ribStatus = rib.status?.trim() || 'OK';
                const statusConf = ribStatusConfig[ribStatus]
                  || (ribStatus.toLowerCase().includes('out') ? ribStatusConfig['Out of Service']
                    : ribStatus.toLowerCase().includes('needs') ? ribStatusConfig['Needs Service']
                    : ribStatusConfig.OK);
                const StatusIcon = statusConf.icon;

                const maintenanceDates = [
                  { key: 'engineCheck', date: rib.engineCheckDate },
                  { key: 'oilChange', date: rib.oilChangeDate },
                  { key: 'sparkPlugs', date: rib.sparkPlugsDate },
                  { key: 'oilFilter', date: rib.oilFilterDate },
                  { key: 'trailerCheck', date: rib.trailerCheckDate },
                  { key: 'batteryCheck', date: rib.batteryCheckDate },
                  { key: 'cleaning', date: rib.cleaningDate },
                  { key: 'petrolCheck', date: rib.petrolCheckDate },
                  { key: 'generalCheck', date: rib.generalCheckDate },
                ];

                const isOutOfService = ribStatus.toLowerCase().includes('out');
                const isNeedsService = ribStatus.toLowerCase().includes('needs');
                const cardBorder = isOutOfService
                  ? 'border-red-300 bg-red-50/30 dark:bg-red-950/10'
                  : isNeedsService
                    ? 'border-yellow-300 bg-yellow-50/30 dark:bg-yellow-950/10'
                    : '';

                return (
                  <div key={rib.ribId} className={`rounded-xl bg-card border p-5 card-hover team-border-top space-y-4 ${cardBorder}`}>
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Anchor size={20} className="text-primary" />
                        <h3 className="font-heading text-lg font-bold">{rib.name || rib.ribId}</h3>
                      </div>
                      <Badge variant="outline" className={`gap-1 ${statusConf.className}`}>
                        <StatusIcon size={12} />
                        {t(`fleet.${rib.status === 'OK' ? 'ok' : rib.status === 'Needs Service' ? 'needsService' : 'outOfService'}`)}
                      </Badge>
                    </div>

                    {/* Maintenance dates */}
                    <div className="space-y-2">
                      {maintenanceDates.map(({ key, date }) => {
                        // Override date status based on RIB status
                        const status = isOutOfService ? 'red'
                          : isNeedsService ? 'yellow'
                          : getDateStatus(date);
                        return (
                          <div
                            key={key}
                            className={`flex items-center justify-between rounded-md border px-3 py-1.5 text-xs ${dateStatusColors[status]}`}
                          >
                            <span className="font-medium">{t(`fleet.${key}`)}</span>
                            <div className="flex items-center gap-2">
                              <span>{formatDate(date)}</span>
                              <span className={`inline-block w-2 h-2 rounded-full ${dateStatusDot[status]}`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Notes */}
                    {localize(rib, 'notes') && (
                      <p className="text-xs text-muted-foreground border-t pt-3">
                        {localize(rib, 'notes')}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FleetPage;
