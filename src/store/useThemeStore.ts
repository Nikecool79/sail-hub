import { create } from 'zustand';

export type Team = 'green' | 'blue' | 'red' | null;
export type Mode = 'day' | 'night';

interface ThemeState {
  team: Team;
  mode: Mode;
  setTeam: (team: Team) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  team: null,
  mode: 'day',
  setTeam: (team) => set({ team }),
  toggleMode: () => set((s) => ({ mode: s.mode === 'day' ? 'night' : 'day' })),
}));
