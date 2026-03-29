import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Team = 'green' | 'blue' | 'red' | 'ilca' | null;
export type Mode = 'day' | 'night';

interface ThemeState {
  team: Team;
  mode: Mode;
  setTeam: (team: Team) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      team: null,
      mode: 'day',
      setTeam: (team) => set({ team }),
      toggleMode: () => set((s) => ({ mode: s.mode === 'day' ? 'night' : 'day' })),
    }),
    { name: 'optisail-theme' }
  )
);
