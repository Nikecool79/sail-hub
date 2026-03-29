import { useQuery } from '@tanstack/react-query';
import { fetchExternalTab } from '@/services/googleSheets';

export interface RibBookingDay {
  date: string;      // YYYY-MM-DD
  dayName: string;   // lördag, söndag…
  regatta: string;   // optional regatta label from col A
  bookings: Record<string, string>; // ribName → booking value (RÖD, BLÅ, GRÖN…)
}

export interface RibBookingData {
  ribNames: string[];
  days: RibBookingDay[];
}

// Maps Swedish dropdown values to Tailwind classes
export const BOOKING_STYLE: Record<string, { cell: string; label: string }> = {
  'RÖD':                      { cell: 'bg-red-100 text-red-700 border-red-300',       label: 'RÖD' },
  'BLÅ':                      { cell: 'bg-blue-100 text-blue-700 border-blue-300',    label: 'BLÅ' },
  'GRÖN':                     { cell: 'bg-green-100 text-green-700 border-green-300', label: 'GRÖN' },
  'GUL':                      { cell: 'bg-yellow-100 text-yellow-700 border-yellow-300', label: 'GUL' },
  'ILCA YOUTH':               { cell: 'bg-gray-100 text-gray-600 border-gray-300',    label: 'ILCA' },
  'TRASIG, Ej tillgänglig':   { cell: 'bg-orange-100 text-orange-700 border-orange-300', label: 'TRASIG' },
  'Är på service':            { cell: 'bg-muted text-muted-foreground border-border',  label: 'SERVICE' },
};

function parseRibBooking(rows: string[][]): RibBookingData {
  if (rows.length < 4) return { ribNames: [], days: [] };

  // Row index 2 = header row; RIB names start at col index 3 (D onwards)
  const headerRow = rows[2] || [];
  const ribNames = headerRow.slice(3).map(h => h.trim()).filter(h => h !== '');

  const today = new Date().toISOString().split('T')[0];
  const days: RibBookingDay[] = [];

  for (let i = 3; i < rows.length; i++) {
    const row = rows[i] || [];
    const date = row[1]?.trim() || '';
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/) || date < today) continue;

    const bookings: Record<string, string> = {};
    ribNames.forEach((name, idx) => {
      bookings[name] = row[3 + idx]?.trim() || '';
    });

    days.push({
      date,
      dayName: row[2]?.trim() || '',
      regatta: row[0]?.trim() || '',
      bookings,
    });
  }

  return { ribNames, days };
}

export function useRibBooking(sheetId: string) {
  const year = new Date().getFullYear();
  const tab = `RIB BOKNING ${year}`;

  return useQuery({
    queryKey: ['ribBooking', sheetId, year],
    queryFn: async () => {
      const rows = await fetchExternalTab(sheetId, tab);
      return parseRibBooking(rows);
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    enabled: !!sheetId,
  });
}
