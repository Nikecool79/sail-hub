import { create } from 'zustand';
import type { AppData } from '@/types';
import { fetchAllSheetData, SHEET_TABS, clearCache } from '@/services/googleSheets';
import {
  parseEvents, parseCoaches, parseEventAssignments, parseClubContacts,
  parseNews, parseMarketplace, parseLocations, parseSafetyChecklist,
  parseSkillProgression, parseSettings, parseSponsors,
} from '@/utils/parseSheet';
import { convertSampleData } from '@/utils/sampleDataAdapter';

interface DataState {
  data: AppData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  dataSource: 'google-sheets' | 'sample-data' | null;
  loadData: () => Promise<void>;
  refreshData: () => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  data: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
  dataSource: null,

  loadData: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });

    try {
      const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

      if (!sheetId || !apiKey) {
        throw new Error('Google Sheets credentials not configured');
      }

      const raw = await fetchAllSheetData();
      const data: AppData = {
        events: parseEvents(raw[SHEET_TABS.EVENTS]),
        coaches: parseCoaches(raw[SHEET_TABS.COACHES]),
        eventAssignments: parseEventAssignments(raw[SHEET_TABS.EVENT_ASSIGNMENTS]),
        clubContacts: parseClubContacts(raw[SHEET_TABS.CLUB_CONTACTS]),
        news: parseNews(raw[SHEET_TABS.NEWS]),
        marketplace: parseMarketplace(raw[SHEET_TABS.MARKETPLACE]),
        locations: parseLocations(raw[SHEET_TABS.LOCATIONS]),
        safetyChecklist: parseSafetyChecklist(raw[SHEET_TABS.SAFETY_CHECKLIST]),
        skillProgression: parseSkillProgression(raw[SHEET_TABS.SKILL_PROGRESSION]),
        settings: parseSettings(raw[SHEET_TABS.SETTINGS]),
        sponsors: parseSponsors(raw[SHEET_TABS.SPONSORS]),
      };

      set({ data, isLoading: false, lastUpdated: Date.now(), dataSource: 'google-sheets' });
    } catch (err) {
      console.warn('Google Sheets fetch failed, using sample data:', err);
      const fallback = convertSampleData();
      set({
        data: fallback,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        lastUpdated: Date.now(),
        dataSource: 'sample-data',
      });
    }
  },

  refreshData: async () => {
    clearCache();
    set({ data: null });
    await get().loadData();
  },
}));
