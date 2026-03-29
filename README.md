# Sail Hub

> Open-source dashboard for youth sailing clubs — Google Sheets powered, bilingual, multi-team.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)](https://vitejs.dev)

**[Use this template](https://github.com/Nikecool79/sail-hub/generate)** · **[Copy Google Sheet template](https://docs.google.com/spreadsheets/d/1VSlo9ut8K6HOf-4lITYY9Bm6C3vIa6JQ/copy)** · **[Live demo](https://sail-hub-production.up.railway.app)**

---

Sail Hub is a ready-to-deploy club dashboard that reads all its data from a Google Sheet. No backend required. Each club gets its own Sheet — swap the Sheet ID and you have a fully branded dashboard for a different club.

Built for **Kullaviks Segelsällskap (KKKK)** and open-sourced for the sailing community.

---

## Features

- **20 pages** — Events, Calendar, Weather, Fleet, Coaches, News, Marketplace, Skill Progression, Safety Checklist, Kiosk, Sponsors, and more
- **Google Sheets as CMS** — All club data (events, coaches, boats, news, sponsors…) lives in a single Google Sheet with 17 tabs
- **Settings-driven** — Club name, coordinates, social links, pricing, feature flags — all configurable from the Settings tab
- **Bilingual** — Swedish and English, with a toggle in the top bar. All content fields have `SV`/`EN` variants
- **Multi-team** — Green / Blue / Red / ILCA teams with colour theming and team-filtered views
- **RIB booking** — Live schedule from a separate Google Sheet showing which RIBs are booked per day
- **Coach time tracking** — Coaches log hours in a separate Google Sheet; summary displayed in the Coaches page
- **Weather widget** — Live conditions and 7-day forecast via Open-Meteo (no API key needed)
- **Sponsor system** — Gold / Silver / Bronze tiers with sidebar rotation, dashboard banner, and click tracking
- **Day / Night mode** — Persisted per browser
- **No backend** — Pure React SPA; deploys anywhere static files are served (Railway, Vercel, Netlify…)

---

## Quick Start

```sh
git clone https://github.com/Nikecool79/sail-hub.git
cd optisail-hub
npm install
cp .env.example .env          # fill in your Sheet ID and API key
npm run dev                   # http://localhost:8080
```

The app works immediately using built-in sample data. Add your Sheet credentials to connect real data.

---

## Environment Variables

```env
# Required — your club's Google Sheet
VITE_GOOGLE_SHEET_ID=your_google_sheet_id_here
VITE_GOOGLE_API_KEY=your_google_api_key_here

# Optional — separate sheets for RIB booking and coach time tracking
VITE_RIB_BOOKING_SHEET_ID=your_rib_booking_sheet_id_here
VITE_COACH_TIME_SHEET_ID=your_coach_time_sheet_id_here
```

**Getting your Sheet ID:** Open your Google Sheet → the ID is the long string in the URL between `/d/` and `/edit`.

**Making the sheet public:** Share → Anyone with the link → Viewer.

**Google API key:** [Google Cloud Console](https://console.cloud.google.com) → Enable the Google Sheets API → Create an API key → Restrict it to the Sheets API.

---

## Setting Up Your Google Sheet

The dashboard reads from a single Google Sheet with **17 tabs**. Tab names must match exactly (including spaces and capitalisation).

### General Rules

| Rule | Detail |
|------|--------|
| **Bilingual fields** | Columns ending in `SV` = Swedish, `EN` = English. Use `=GOOGLETRANSLATE(E2,"sv","en")` to auto-fill |
| **Team values** | `Green`, `Blue`, `Red`, `ILCA`, or `All`. Comma-separate for multiple: `Green, Blue` |
| **Boolean fields** | Use `yes` / `no` (or `true` / `false` / `1` / `0`) |
| **Dates** | ISO format `YYYY-MM-DD` |
| **Coordinates** | Decimal degrees, e.g. `57.4833`, `11.9333` |
| **IDs** | Consistent prefix pattern recommended: `EVT001`, `COA001`, `RES001` |
| **Empty rows** | Skipped automatically |

---

### Tab 1 — Events

| Column | Example | Notes |
|--------|---------|-------|
| Event ID | `EVT001` | Unique, referenced by other tabs |
| Event Name SV | `Vårregatta` | |
| Event Name EN | `Spring Regatta` | |
| Date Start | `2026-04-18` | |
| Date End | `2026-04-19` | Leave blank for single-day |
| Type | `Regatta` | `Regatta` / `Training` / `Championship` / `Social` |
| Team(s) | `Red, Blue` | Comma-separated or `All` |
| Location Name | `GKSS Langedrag` | Must match Locations tab |
| Latitude | `57.6600` | |
| Longitude | `11.8800` | |
| Address | `Langedragsvägen 2` | |
| Parking Info SV | `Begränsat, kom tidigt` | |
| Parking Info EN | `Limited, arrive early` | |
| Arrival Time | `08:30` | HH:MM |
| Start Time | `10:00` | HH:MM |
| End Time | `16:00` | HH:MM |
| Sailarena Link | `https://sailarena.se/...` | External registration |
| Description SV | | |
| Description EN | | |
| Status | `Confirmed` | `Planned` / `Confirmed` / `Cancelled` |

---

### Tab 2 — Coaches

| Column | Example | Notes |
|--------|---------|-------|
| Coach ID | `COA001` | |
| Name | `Erik Lindqvist` | |
| Phone | `+46 70 123 4567` | |
| Email | `erik@klubben.se` | |
| Team(s) | `Red` | Comma-separated |
| Role SV | `Huvudtränare` | |
| Role EN | `Head Coach` | |
| Bio SV | | |
| Bio EN | | |
| Photo URL | `https://...` | Leave blank for initials avatar |
| Active | `yes` | |

---

### Tab 3 — Event Assignments

| Column | Example | Notes |
|--------|---------|-------|
| Event ID | `EVT001` | Must match Events tab |
| Event Name | `Spring Regatta` | Display only |
| Coach ID | `COA001` | Must match Coaches tab |
| Coach Name | `Erik Lindqvist` | Display only |
| Role at Event SV | `Tävlingscoach` | |
| Role at Event EN | `Race Coach` | |
| Rigs Available | `6` | |
| Boats Available | `3` | |
| Notes SV | | |
| Notes EN | | |

---

### Tab 4 — Club Contacts

| Column | Example | Notes |
|--------|---------|-------|
| Name | `Per Andersson` | |
| Role SV | `Ordförande` | |
| Role EN | `Chairman` | |
| Phone | `+46 70 111 2233` | |
| Email | `per@klubben.se` | |
| Photo URL | | |
| Order | `1` | Sort order |

---

### Tab 5 — News

| Column | Example | Notes |
|--------|---------|-------|
| News ID | `NEW001` | |
| Date | `2026-03-01` | |
| Title SV | `Säsongsstart 2026` | |
| Title EN | `Season Start 2026` | |
| Body SV | | |
| Body EN | | |
| Team(s) | `All` | |
| Priority | `High` | `High` / `Normal` / `Low` |
| Author | `Helena Strand` | |
| Pinned | `yes` | |
| Active | `yes` | |

---

### Tab 6 — Marketplace

| Column | Example | Notes |
|--------|---------|-------|
| Item ID | `MKT001` | |
| Category | `Boat` | `Boat` / `Sail` / `Clothing` / `Equipment` |
| Title SV | | |
| Title EN | | |
| Description SV | | |
| Description EN | | |
| Price SEK | `8500` | |
| Condition | `Good` | `Like New` / `Good` / `Fair` |
| Seller Name | | |
| Seller Phone | | |
| Seller Email | | |
| Photo URL | | |
| External Link | | |
| Facebook Link | | |
| Date Posted | `2026-02-20` | |
| Status | `Active` | `Active` / `Sold` |

---

### Tab 7 — Locations

| Column | Example | Notes |
|--------|---------|-------|
| Location ID | `LOC001` | |
| Name | `Kullavik Hamn` | Must match `Location Name` in Events |
| Latitude | | |
| Longitude | | |
| Address | | |
| Parking Info SV | | |
| Parking Info EN | | |
| Facilities SV | | |
| Facilities EN | | |
| Typical Arrival Time | `09:30` | |
| Webcam URL | | For Live Cameras page |
| Website | | |
| Google Maps URL | | Coordinates extracted automatically |
| Notes SV | | |
| Notes EN | | |

---

### Tab 8 — Safety Checklist

| Column | Example | Notes |
|--------|---------|-------|
| Item SV | `Flytväst` | |
| Item EN | `Buoyancy Aid` | |
| Required For | `Green, Blue, Red` | |
| Description SV | | |
| Description EN | | |
| Category | `Safety` | `Safety` / `Clothing` / `Equipment` / `Protection` / `Nutrition` |

---

### Tab 9 — Skill Progression

| Column | Example | Notes |
|--------|---------|-------|
| Level | `Beginner` | `Beginner` / `Intermediate` / `Advanced` |
| Team | `Green` | `Green` / `Blue` / `Red` / `ILCA` |
| Skill SV | | |
| Skill EN | | |
| Description SV | | |
| Description EN | | |
| Order | `1` | Sort order within team |

---

### Tab 10 — Settings

Column headers: `Setting` | `Value`

| Setting Key | Example | Notes |
|-------------|---------|-------|
| Club Name SV | `Kullaviks Segelsällskap` | |
| Club Name EN | `Kullavik Sailing Club` | |
| Club Short Name | `KSS` | Header abbreviation |
| Club Address | `Hamnvägen 12, 429 44 Kullavik` | |
| Default Latitude | `57.4833` | Map center |
| Default Longitude | `11.9333` | Map center |
| Default Location Name | `Kullavik Hamn` | |
| Home Location Keyword | `Kullavik` | Used to detect home venue |
| Club Website | `https://kkkk.se` | |
| Sailarena URL | `https://sailarena.se/club/...` | |
| Club Logo URL | | |
| WhatsApp Green Group | `https://chat.whatsapp.com/...` | |
| WhatsApp Blue Group | | |
| WhatsApp Red Group | | |
| WhatsApp ILCA Group | | |
| Facebook Page | | |
| Instagram Skola | | |
| Instagram KKKK | | |
| Kiosk Signup URL | | Google Form link |
| Mailchimp Signup URL | | |
| Green Team Age Range | `6-9` | Team selection screen |
| Blue Team Age Range | `9-12` | |
| Red Team Age Range | `12-15` | |
| ILCA Team Age Range | `16+` | |
| Ad Rotation Interval Seconds | `10` | |
| Max Ads Per Page | `3` | |
| Ad Contact Email | | For BecomeSponsor page |
| Gold Tier Price SEK/Month | `500` | |
| Silver Tier Price SEK/Month | `300` | |
| Bronze Tier Price SEK/Month | `150` | |
| Default Webcam URL | | |
| Enable Kiosk | `yes` | Feature flag |
| Enable Marketplace | `yes` | |
| Enable Live Cameras | `yes` | |
| Enable Club Services | `yes` | |

---

### Tab 11 — Sponsors & Ads

| Column | Example | Notes |
|--------|---------|-------|
| Ad ID | `AD001` | |
| Business Name | `Västkusten Marina` | |
| Category | `Marina` | |
| Tier | `Gold` | `Gold` / `Silver` / `Bronze` |
| Tagline SV | | |
| Tagline EN | | |
| Description SV | | |
| Description EN | | |
| Logo URL | | Square image |
| Banner Image URL | | Wide image for Gold tier |
| Website URL | | |
| Contact Name | | |
| Contact Phone | | |
| Contact Email | | |
| Placement | `Dashboard + Sidebar` | |
| Start Date | `2026-01-01` | |
| End Date | `2026-12-31` | |
| Team Affinity | `All` | |
| Click URL | | |
| Active | `yes` | |

**Tier placement:** Gold → Dashboard banner + sidebar + Sponsors page. Silver → Sidebar + Sponsors page. Bronze → Sidebar only.

---

### Tab 12 — Boats

| Column | Example | Notes |
|--------|---------|-------|
| Boat ID | `BOA001` | |
| Name | `Solen` | |
| Sail Number | `SE 7823` | |
| Team | `Green` | |
| Space | `A3` | Storage space identifier |
| Status | `Available` | `Available` / `In Repair` / `Retired` / `Lent Out` / `Private` |
| Condition Notes SV | | |
| Condition Notes EN | | |
| Last Inspection Date | `2026-03-01` | |

---

### Tab 13 — RIBs

| Column | Example | Notes |
|--------|---------|-------|
| RIB ID | `RIB001` | |
| Name | `Räddaren` | |
| Teams | `Green, Blue` | |
| Status | `OK` | `OK` / `Needs Service` / `Out of Service` |
| Engine Check Date | | |
| Oil Change Date | | |
| Spark Plugs Date | | |
| Oil Filter Date | | |
| Trailer Check Date | | |
| Battery Check Date | | |
| Cleaning Date | | |
| Petrol Check Date | | |
| General Check Date | | |
| Notes SV | | |
| Notes EN | | |

---

### Tab 14 — Kiosk Menu

| Column | Example | Notes |
|--------|---------|-------|
| Item ID | `K001` | |
| Name SV | `Kaffe` | |
| Name EN | `Coffee` | |
| Category | `drink` | `drink` / `food` / `snack` |
| Price SEK | `15` | |
| Allergens | `Gluten` | Comma-separated |
| Active | `yes` | |

---

### Tab 15 — Kiosk Shifts

| Column | Example | Notes |
|--------|---------|-------|
| Shift ID | `SH001` | |
| Event ID | `EVT001` | |
| Date | `2026-04-18` | |
| Open Time | `08:30` | |
| Close Time | `16:00` | |
| Volunteers | `Anna L, Björn K` | Comma-separated |
| Notes SV | | |
| Notes EN | | |

---

### Tab 16 — Kiosk Fundraising

One row per team (3 rows):

| Column | Example |
|--------|---------|
| Team | `Green` |
| Raised SEK | `1650` |
| Goal SEK | `3000` |

---

### Tab 17 — Regatta Results

| Column | Example | Notes |
|--------|---------|-------|
| Result ID | `RES001` | |
| Event ID | `EVT001` | |
| Position | `1` | |
| Sailor Name | `Erik Andersson` | |
| Sail Number | `SE 7823` | |
| Team | `red` | Lowercase |
| Race Scores | `1,2,1,3,2` | Comma-separated. Supports `DSQ`, `DNF`, `DNC`, `OCS`, `BFD` |
| Total Points | `9` | Low-point scoring |
| Notes SV | | |
| Notes EN | | |

---

## Optional: RIB Booking Sheet

A separate sheet for daily RIB scheduling. Tab name: `RIB BOKNING <year>` (e.g. `RIB BOKNING 2026`).

Structure: rows 1–2 = header/logo, row 3 = column headers (`Regatta | Date | Day | RIB A | RIB B | ...`), row 4+ = data.

Dropdown values per cell: `RÖD` / `BLÅ` / `GRÖN` / `GUL` / `ILCA YOUTH` / `TRASIG, Ej tillgänglig` / `Är på service`

Set `VITE_RIB_BOOKING_SHEET_ID` to enable. Shows a widget on the Dashboard and a full grid in the Fleet page.

---

## Optional: Coach Time Sheet

A separate sheet for coach hour tracking. Tab name: `<year>` (e.g. `2026`).

Structure: rows 1–2 = header/logo, row 3 = column headers (`Regatta | Date | Day | Coach | Team | Activity | Hours | Notes`), row 4+ = data.

Multiple coaches on the same date = multiple rows with the same date.

Set `VITE_COACH_TIME_SHEET_ID` to enable. Shows total hours per coach and a full log in the Coaches & Team page.

---

## Pages

| Page | Route | Data Sources |
|------|-------|-------------|
| Dashboard | `/dashboard` | Events, News, Settings, Sponsors, RIB Booking |
| Calendar | `/calendar` | Events |
| Events & Maps | `/events` | Events, Locations, Regatta Results |
| Weather | `/weather` | Open-Meteo API |
| Live Cameras | `/cameras` | Locations (Webcam URL) |
| Coaches & Team | `/coaches` | Coaches, Event Assignments, Coach Time |
| Fleet | `/fleet` | Boats, RIBs, RIB Booking |
| Kiosk & Café | `/kiosk` | Kiosk Menu, Shifts, Fundraising |
| Club Contacts | `/contacts` | Club Contacts |
| News | `/news` | News |
| Marketplace | `/marketplace` | Marketplace |
| Skill Progression | `/skills` | Skill Progression |
| Safety Checklist | `/safety` | Safety Checklist |
| Subscribe | `/subscribe` | Settings (WhatsApp links) |
| Club Services | `/services` | Static |
| Sponsors | `/sponsors` | Sponsors & Ads |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| Data fetching | TanStack Query |
| Maps | Leaflet + OpenStreetMap |
| i18n | react-i18next (sv/en) |
| Weather | Open-Meteo (no API key) |
| Charts | Recharts |

---

## Development

```sh
npm run dev        # dev server on :8080
npm run build      # production build
npm run lint       # ESLint
npm run test       # Vitest
```

Translation files: `src/i18n/sv.json` and `src/i18n/en.json`

Club config defaults: `src/config/clubConfig.ts`

---

## Deploy Your Own Club

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/template)

**Step-by-step for a new club:**

1. Click **[Use this template](https://github.com/Nikecool79/sail-hub/generate)** on GitHub to create your own copy of the repo
2. Click **[Copy Google Sheet template](https://docs.google.com/spreadsheets/d/1VSlo9ut8K6HOf-4lITYY9Bm6C3vIa6JQ/copy)** — opens a ready-to-fill Sheet in your Google account
3. Share the Sheet: Share → Anyone with the link → **Viewer**
4. Get a Google API key: [console.cloud.google.com](https://console.cloud.google.com) → Enable Sheets API → Create API key
5. Deploy to Railway: New project → Deploy from GitHub → add the 2 env vars → done
6. Fill in the **Settings** tab in your Sheet with your club's name, coordinates, social links, etc.

The whole setup takes about 30 minutes. The dashboard updates live as you edit the Sheet.

**Railway (recommended):**
1. Fork this repo
2. New project → Deploy from GitHub repo
3. Add env vars in Railway settings
4. Done — auto-deploys on push

**Vercel / Netlify:** Connect the repo, set env vars, deploy.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

[MIT](LICENSE) © Nicolas Finsterbusch
