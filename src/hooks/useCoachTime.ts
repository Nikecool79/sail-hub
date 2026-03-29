import { useQuery } from '@tanstack/react-query';
import { fetchExternalTab } from '@/services/googleSheets';

export interface CoachTimeEntry {
  date: string;     // YYYY-MM-DD
  dayName: string;
  regatta: string;
  coach: string;
  team: string;
  activity: string;
  hours: number;
  notes: string;
}

// Sheet structure (tab: "<year>", e.g. "2026"):
// Row 1: Logo/title (skip)
// Row 2: Empty (skip)
// Row 3: Headers — Regatta | Date | Day | Coach | Team | Activity | Hours | Notes
// Row 4+: Data (one row per coaching session; multiple rows per date = multiple coaches)

function parseCoachTime(rows: string[][]): CoachTimeEntry[] {
  if (rows.length < 4) return [];

  const entries: CoachTimeEntry[] = [];
  for (let i = 3; i < rows.length; i++) {
    const row = rows[i] || [];
    const date = row[1]?.trim() || '';
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) continue;
    const hours = parseFloat(row[6]) || 0;
    if (!hours) continue; // skip empty rows
    entries.push({
      regatta: row[0]?.trim() || '',
      date,
      dayName: row[2]?.trim() || '',
      coach: row[3]?.trim() || '',
      team: row[4]?.trim() || '',
      activity: row[5]?.trim() || '',
      hours,
      notes: row[7]?.trim() || '',
    });
  }

  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export function useCoachTime(sheetId: string) {
  const year = new Date().getFullYear().toString();

  return useQuery({
    queryKey: ['coachTime', sheetId, year],
    queryFn: async () => {
      const rows = await fetchExternalTab(sheetId, year);
      return parseCoachTime(rows);
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    enabled: !!sheetId,
  });
}
