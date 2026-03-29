# OptiSail Hub — CLAUDE.md

## Project Overview
Youth sailing club dashboard for **Kullaviks Segelsällskap**. Multi-club capable via Google Sheets Settings tab. React 18 + TypeScript + Vite + Tailwind + shadcn/ui.

---

## Architecture

### Data Flow
```
Google Sheets (17 tabs)
  → src/utils/googleSheets.ts  (fetch, 5-min cache per tab)
  → src/utils/parseSheet.ts    (typed parsers per tab)
  → src/store/dataStore.ts     (Zustand, AppData | null)
  → pages/components           (useDataStore, useLocalizedField)
```
If Google Sheets fails → `sampleDataAdapter.ts` loads built-in sample data automatically.

### Stores
- **dataStore** (`src/store/dataStore.ts`) — all club data, loading state, data source flag
- **useThemeStore** (`src/store/useThemeStore.ts`) — team (`green|blue|red|null`), mode (`day|night`), persisted to localStorage key `optisail-theme`

### Key Hooks
- `useLocalizedField` — picks `fieldSv` or `fieldEn` based on active i18n language
- `useWeather` — Open-Meteo via TanStack Query, 15-min refetch
- `useInitializeData` — fires `loadData()` on app mount

### Config
- `src/config/clubConfig.ts` — single source of truth for club identity, defaults, team definitions, tier colors, feature flags
- Settings override: read from Google Sheets "Settings" tab at runtime via `getSetting(settings, key, fallback)`

---

## Conventions

### Bilingual Fields
All content fields use `Sv`/`En` suffix: `nameSv`, `nameEn`, `descriptionSv`, `descriptionEn`.
Always provide both. Use `useLocalizedField()` to render the correct one.

### Team Filtering
Most pages filter by `useThemeStore(s => s.team)`. Null = all teams. Events with `teams: ['All']` always show.

### Dates
ISO `YYYY-MM-DD` in sheets. Timestamps in Stockholm timezone (`Europe/Stockholm`) — see Dashboard countdown logic.

### Status Enums
Boat/RIB statuses normalized via `normalizeBoatStatus()` — case-insensitive, handles Swedish and English variants.

### TypeScript
Strict mode OFF (`noImplicitAny: false`, `strictNullChecks: false`). Keep it that way — don't tighten without scoped approval.

---

## Google Sheets

**Sheet ID**: `1VSlo9ut8K6HOf-4lITYY9Bm6C3vIa6JQ`

**17 Tabs** (exact names matter — parsers read headers by name):
Events, Coaches, Event Assignments, Club Contacts, News, Marketplace, Locations, Safety Checklist, Skill Progression, Settings, Sponsors & Ads, Boats, RIBs, Kiosk Menu, Kiosk Shifts, Kiosk Fundraising, Regatta Results

### Settings Tab Keys
Club Name SV, Club Name EN, Club Short Name, Club Address, Default Latitude, Default Longitude, Default Location Name, Home Location Keyword, WhatsApp Green/Blue/Red Group, Facebook Page, Instagram Skola, Instagram KKKK, Kiosk Signup URL, Mailchimp Signup URL, Green/Blue/Red Team Age Range, Ad Rotation Interval Seconds, Max Ads Per Page, Ad Contact Email, Gold/Silver/Bronze Tier Price SEK/Month, Default Webcam URL

### Environment Variables
```
VITE_GOOGLE_SHEET_ID=...
VITE_GOOGLE_API_KEY=...
```

---

## Pages (20 total)
| Page | Purpose |
|------|---------|
| TeamSelection | Initial team picker |
| Dashboard | Next event, weather, news, sponsors |
| CalendarPage | Calendar view of events |
| EventsAndMaps | Event list + Leaflet map |
| WeatherPage | 7-day forecast, wind, UV |
| LiveCameras | Webcam feeds |
| CoachesAndTeam | Coach profiles by team |
| FleetPage | Boats + RIBs inventory |
| KioskPage | Volunteer shifts + fundraising |
| ClubContacts | Board & key contacts |
| NewsPage | Announcements feed |
| Marketplace | Buy/sell listings |
| SkillProgression | Skill levels by team |
| SafetyChecklist | Equipment checklists |
| Subscribe | Email signup |
| SponsorsPage | Full sponsor directory |
| BecomeSponsor | Sponsor info/form |
| ClubServicesPage | Club services |
| NotFound | 404 |

---

## Standing Rules

- **Do NOT rename** existing functions, variables, or constants without explicit approval
- **Do NOT refactor** broadly — keep changes scoped to what was asked
- **Settings-driven first** — if a value could vary per club, read it from `getSetting()`, not hardcoded
- **Dynamic over hardcoded** — prefer data-driven approaches
- **No strict null checks tightening** without approval
- Path alias `@/` → `./src/` — use it everywhere

---

## Dev Commands
```bash
npm run dev       # port 8080
npm run build     # production, code-split per page
npm run test      # vitest
```
