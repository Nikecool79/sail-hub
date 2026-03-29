import { useQuery } from '@tanstack/react-query';
import { fetchExternalTab } from '@/services/googleSheets';

export interface CoachTimeEntry {
  date: string;     // YYYY-MM-DD
  coach: string;
  team: string;
  activity: string;
  hours: number;
  notes: string;
}

// Expected sheet structure (tab: "Time Log"):
// Row 1 = headers: Date | Coach | Team | Activity | Hours | Notes
// Row 2+ = data

function parseCoachTime(rows: string[][]): CoachTimeEntry[] {
  if (rows.length < 2) return [];

  const entries: CoachTimeEntry[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] || [];
    const date = row[0]?.trim() || '';
    if (!date) continue;
    entries.push({
      date,
      coach: row[1]?.trim() || '',
      team: row[2]?.trim() || '',
      activity: row[3]?.trim() || '',
      hours: parseFloat(row[4]) || 0,
      notes: row[5]?.trim() || '',
    });
  }

  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export function useCoachTime(sheetId: string) {
  return useQuery({
    queryKey: ['coachTime', sheetId],
    queryFn: async () => {
      const rows = await fetchExternalTab(sheetId, 'Time Log');
      return parseCoachTime(rows);
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    enabled: !!sheetId,
  });
}
