const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export const SHEET_TABS = {
  EVENTS: 'Events',
  COACHES: 'Coaches',
  EVENT_ASSIGNMENTS: 'Event Assignments',
  CLUB_CONTACTS: 'Club Contacts',
  NEWS: 'News',
  MARKETPLACE: 'Marketplace',
  LOCATIONS: 'Locations',
  SAFETY_CHECKLIST: 'Safety Checklist',
  SKILL_PROGRESSION: 'Skill Progression',
  SETTINGS: 'Settings',
  SPONSORS: 'Sponsors & Ads',
  BOATS: 'Boats',
  RIBS: 'RIBs',
  KIOSK_MENU: 'Kiosk Menu',
  KIOSK_SHIFTS: 'Kiosk Shifts',
  KIOSK_FUNDRAISING: 'Kiosk Fundraising',
  REGATTA_RESULTS: 'Regatta Results',
} as const;

export type SheetTab = (typeof SHEET_TABS)[keyof typeof SHEET_TABS];

const cache = new Map<string, { data: string[][]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export async function fetchSheetTab(tab: SheetTab): Promise<string[][]> {
  const cached = cache.get(tab);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(tab)}?key=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${tab}: ${response.status}`);
  }

  const json = await response.json();
  const rows: string[][] = json.values || [];

  cache.set(tab, { data: rows, timestamp: Date.now() });
  return rows;
}

export async function fetchAllSheetData(): Promise<Record<SheetTab, string[][]>> {
  const tabs = Object.values(SHEET_TABS);
  const results = await Promise.allSettled(tabs.map((tab) => fetchSheetTab(tab)));

  const data: Record<string, string[][]> = {};
  tabs.forEach((tab, i) => {
    const result = results[i];
    if (result.status === 'fulfilled') {
      data[tab] = result.value;
    } else {
      console.error(`Failed to fetch tab "${tab}":`, result.reason);
      data[tab] = [];
    }
  });

  return data as Record<SheetTab, string[][]>;
}

export function clearCache(): void {
  cache.clear();
}

/**
 * Fetch a single tab from ANY Google Sheet (uses the same API key).
 * Cache key is sheetId + tab name — independent of the main club sheet cache.
 */
export async function fetchExternalTab(sheetId: string, tab: string): Promise<string[][]> {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const cacheKey = `${sheetId}::${tab}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.data;

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(tab)}?key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch "${tab}" from ${sheetId}: ${response.status}`);

  const json = await response.json();
  const rows: string[][] = json.values || [];
  cache.set(cacheKey, { data: rows, timestamp: Date.now() });
  return rows;
}
