# OptiSail Hub — Kullaviks Segelsällskap Dashboard

A youth sailing club dashboard for Kullaviks Segelsällskap (KKKK).
Built with React 18, TypeScript, Vite, Tailwind CSS, and shadcn/ui.

---

## Quick Start

```sh
git clone <YOUR_GIT_URL>
cd optisail-hub
npm install
cp .env.example .env          # add your Google Sheet ID and API key
npm run dev                   # http://localhost:8080
```

### Environment Variables

Create a `.env` file in the project root:

```
VITE_GOOGLE_SHEET_ID=your_google_sheet_id_here
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

If either variable is missing or the sheet is not reachable, the app automatically falls back to built-in sample data so it always works.

**Getting your Sheet ID:** Open your Google Sheet → the ID is the long string in the URL between `/d/` and `/edit`.

**Making the sheet public:** Share → Anyone with the link → Viewer.

---

## Google Sheets Data Template

The dashboard reads from a single Google Sheet with **17 tabs**. Tab names must match exactly (including spaces and capitalisation). Column headers in row 1 must also match exactly — the parser maps them by name, not by position.

### General Rules

| Rule | Detail |
|------|--------|
| **Bilingual fields** | Columns ending in `SV` = Swedish, `EN` = English. Fill both for the language toggle to work. Tip: `=GOOGLETRANSLATE(E2,"sv","en")` |
| **Team values** | `Green`, `Blue`, `Red`, or `All`. Comma-separate for multiple: `Green, Blue` |
| **Boolean fields** | Use `yes` / `no` (or `true` / `false` / `1` / `0`) |
| **Coordinates** | Decimal degrees, e.g. `57.4833`, `11.9333`. Find at latlong.net |
| **IDs** | Use a consistent prefix pattern, e.g. `EVT001`, `COA001`, `RES001` |
| **Empty rows** | Blank rows are skipped automatically |

---

### Tab 1 — Events

Regattas, training sessions, championships, and social events.

| Column | Example | Notes |
|--------|---------|-------|
| Event ID | `EVT001` | Unique identifier, referenced by other tabs |
| Event Name SV | `Vårregatta` | |
| Event Name EN | `Spring Regatta` | |
| Date Start | `2026-04-18` | ISO format YYYY-MM-DD |
| Date End | `2026-04-19` | Leave blank for single-day events |
| Type | `Regatta` | `Regatta` / `Training` / `Championship` / `Social` |
| Team(s) | `Red, Blue` | Comma-separated. Use `All` for all teams |
| Location Name | `GKSS Langedrag` | Must match a name in the Locations tab to show venue details |
| Latitude | `57.6600` | Decimal degrees |
| Longitude | `11.8800` | Decimal degrees |
| Address | `Langedragsvägen 2` | |
| Parking Info SV | `Begränsat, kom tidigt` | |
| Parking Info EN | `Limited, arrive early` | |
| Arrival Time | `08:30` | HH:MM |
| Start Time | `10:00` | HH:MM |
| End Time | `16:00` | HH:MM |
| Sailarena Link | `https://sailarena.se/...` | External registration link |
| Description SV | `Vår regatta för alla klasser` | |
| Description EN | `Spring regatta for all classes` | |
| Status | `Confirmed` | `Planned` / `Confirmed` / `Cancelled` |

---

### Tab 2 — Coaches

Coach profiles shown on the Coaches & Team page.

| Column | Example | Notes |
|--------|---------|-------|
| Coach ID | `COA001` | |
| Name | `Erik Lindqvist` | |
| Phone | `+46 70 123 4567` | |
| Email | `erik@klubben.se` | |
| Team(s) | `Red` | Comma-separated |
| Role SV | `Huvudtränare` | |
| Role EN | `Head Coach` | |
| Bio SV | `Före detta OS-seglare...` | |
| Bio EN | `Former Olympic sailor...` | |
| Photo URL | `https://...` | Direct image URL (leave blank for initials avatar) |
| Active | `yes` | `yes` / `no` |

---

### Tab 3 — Event Assignments

Links coaches to events. Drives the coaching section on event detail cards.

| Column | Example | Notes |
|--------|---------|-------|
| Event ID | `EVT001` | Must match Events tab |
| Event Name | `Spring Regatta` | Display name (not parsed, for your reference) |
| Coach ID | `COA001` | Must match Coaches tab |
| Coach Name | `Erik Lindqvist` | Display name (not parsed, for your reference) |
| Role at Event SV | `Tävlingscoach` | |
| Role at Event EN | `Race Coach` | |
| Rigs Available | `6` | Number of rigs the coach is bringing |
| Boats Available | `3` | Number of boats available |
| Notes SV | `Ta med extra fall` | |
| Notes EN | `Bring extra halyards` | |

---

### Tab 4 — Club Contacts

Board members and key contacts shown on the Club Contacts page.

| Column | Example | Notes |
|--------|---------|-------|
| Name | `Per Andersson` | |
| Role SV | `Ordförande` | |
| Role EN | `Chairman` | |
| Phone | `+46 70 111 2233` | |
| Email | `per@klubben.se` | |
| Photo URL | `https://...` | Leave blank for initials avatar |
| Order | `1` | Sort order (lower = first) |

---

### Tab 5 — News

Club announcements, pinned posts, and team-specific messages.

| Column | Example | Notes |
|--------|---------|-------|
| News ID | `NEW001` | |
| Date | `2026-03-01` | ISO format |
| Title SV | `Säsongsstart 2026` | |
| Title EN | `Season Start 2026` | |
| Body SV | `Registreringen är nu öppen...` | Plain text or simple line breaks |
| Body EN | `Registration is now open...` | |
| Team(s) | `All` | Comma-separated or `All` |
| Priority | `High` | `High` / `Normal` / `Low` |
| Author | `Helena Strand` | |
| Pinned | `yes` | Pinned posts appear at the top |
| Active | `yes` | Set to `no` to hide without deleting |

---

### Tab 6 — Marketplace

Buy/sell listings for boats, sails, and equipment.

| Column | Example | Notes |
|--------|---------|-------|
| Item ID | `MKT001` | |
| Category | `Boat` | `Boat` / `Sail` / `Clothing` / `Equipment` |
| Title SV | `Optimistjolle — tävlingsklar` | |
| Title EN | `Optimist Dinghy — Race Ready` | |
| Description SV | `Välskött, ny segel 2025` | |
| Description EN | `Well maintained, new sail 2025` | |
| Price SEK | `8500` | Number only |
| Condition | `Good` | `Like New` / `Good` / `Fair` |
| Seller Name | `Erik P.` | |
| Seller Phone | `+46 70 ...` | |
| Seller Email | `erik@example.se` | |
| Photo URL | `https://...` | |
| External Link | `https://blocket.se/...` | |
| Facebook Link | `https://facebook.com/...` | |
| Date Posted | `2026-02-20` | ISO format |
| Status | `Active` | `Active` / `Sold` |

---

### Tab 7 — Locations

Venue details used by the Events & Maps page.

| Column | Example | Notes |
|--------|---------|-------|
| Location ID | `LOC001` | |
| Name | `Kullavik Hamn` | Should match `Location Name` in Events tab |
| Latitude | `57.4800` | |
| Longitude | `11.8800` | |
| Address | `Hamnvägen 12, 429 44 Kullavik` | |
| Parking Info SV | `Gratis parkering vid hamnen` | |
| Parking Info EN | `Free parking at harbor` | |
| Facilities SV | `Omklädningsrum, båtlager, klubbhus` | |
| Facilities EN | `Changing rooms, boat storage, club house` | |
| Typical Arrival Time | `09:30` | |
| Webcam URL | `https://...` | For the Live Cameras page |
| Website | `https://kkkk.se` | |
| Google Maps URL | `https://maps.google.com/?q=...` | Full URL; coordinates are extracted automatically |
| Notes SV | | |
| Notes EN | | |

---

### Tab 8 — Safety Checklist

Required gear per team level, shown on the Safety Checklist page.

| Column | Example | Notes |
|--------|---------|-------|
| Item SV | `Flytväst / Livräddningsväst` | |
| Item EN | `Buoyancy Aid / Life Jacket` | |
| Required For | `Green, Blue, Red` | Comma-separated team names |
| Description SV | `Ska alltid bäras på vattnet` | |
| Description EN | `Must be worn at all times on the water` | |
| Category | `Safety` | `Safety` / `Clothing` / `Equipment` / `Protection` / `Nutrition` |

---

### Tab 9 — Skill Progression

Skills needed to advance between team levels, shown on the Skill Progression page.

| Column | Example | Notes |
|--------|---------|-------|
| Level | `Beginner` | `Beginner` / `Intermediate` / `Advanced` |
| Team | `Green` | `Green` / `Blue` / `Red` |
| Skill SV | `Stiga i och ur båten säkert` | |
| Skill EN | `Board the boat safely` | |
| Description SV | `Kliv i och ur Optimisten utan att kapsejsa` | |
| Description EN | `Get in and out of the Optimist without capsizing` | |
| Order | `1` | Sort order within the team level |

---

### Tab 10 — Settings

Club-wide configuration values read by multiple pages.

| Setting Key | Example Value | Used By |
|-------------|--------------|---------|
| Club Name SV | `Kullaviks Segelsällskap` | Footer, Dashboard |
| Club Name EN | `Kullavik Sailing Club` | Footer, Dashboard |
| Default Latitude | `57.4833` | Map default center |
| Default Longitude | `11.9333` | Map default center |
| Club Website | `https://kkkk.se` | Footer |
| Sailarena URL | `https://sailarena.se/club/...` | Events |
| Green Team Age Range | `6-9` | Team selection screen |
| Blue Team Age Range | `9-12` | Team selection screen |
| Red Team Age Range | `12-15` | Team selection screen |
| Ad Rotation Interval Seconds | `10` | Sidebar sponsor widget |
| Instagram | `https://www.instagram.com/kkkk/` | Footer + Dashboard social widget |
| Instagram Skola | `https://www.instagram.com/kkkk_skola/` | Dashboard (Green Team only) |
| Instagram KKKK | `https://www.instagram.com/kkkk/` | Dashboard (Blue/Red Team) |
| Instagram Post URL | `https://www.instagram.com/p/...` | Dashboard embed |
| Facebook Page | `https://www.facebook.com/kkkk/` | Footer + Dashboard social widget |
| Facebook URL | `https://www.facebook.com/kkkk/` | Alias for Facebook Page |
| Kiosk Signup URL | `https://forms.google.com/...` | Kiosk volunteer sign-up |
| WhatsApp Green | `https://chat.whatsapp.com/...` | Subscribe page |
| WhatsApp Blue | `https://chat.whatsapp.com/...` | Subscribe page |
| WhatsApp Red | `https://chat.whatsapp.com/...` | Subscribe page |

Column headers for this tab: `Setting` | `Value`

---

### Tab 11 — Sponsors & Ads

Local business sponsors displayed in the sidebar, footer, and Dashboard.

| Column | Example | Notes |
|--------|---------|-------|
| Ad ID | `AD001` | |
| Business Name | `Västkusten Marina` | |
| Category | `Marina` | Free text |
| Tier | `Gold` | `Gold` / `Silver` / `Bronze` |
| Tagline SV | `Ditt hem på vattnet` | Short slogan |
| Tagline EN | `Your home on the water` | |
| Description SV | `Full-service marina med...` | Longer text for Sponsors page |
| Description EN | `Full-service marina with...` | |
| Logo URL | `https://...` | Square image, shown in sidebar widget |
| Banner Image URL | `https://...` | Wide image for Gold tier banner |
| Website URL | `https://vastkustenmarina.se` | |
| Contact Name | `Anna Svensson` | |
| Contact Phone | `+46 31 ...` | |
| Contact Email | `anna@...` | |
| Placement | `Dashboard + Sidebar` | Controls where the ad appears |
| Start Date | `2026-01-01` | ISO format |
| End Date | `2026-12-31` | ISO format |
| Team Affinity | `All` | `All` / `Green` / `Blue` / `Red` |
| Click URL | `https://vastkustenmarina.se` | URL opened when sponsor is clicked |
| Active | `yes` | Set to `no` to hide |

**Tier placement rules:**
- **Gold** — Dashboard banner + sidebar rotation + Sponsors page (featured)
- **Silver** — Sidebar rotation + Sponsors page
- **Bronze** — Sidebar rotation only

---

### Tab 12 — Boats

Optimist dinghy inventory shown on the Fleet page.

| Column | Example | Notes |
|--------|---------|-------|
| Boat ID | `BOA001` | |
| Name | `Solen` | Boat name |
| Sail Number | `SE 7823` | |
| Team | `Green` | Single team |
| Status | `Available` | `Available` / `In Repair` / `Retired` / `Lent Out` / `Private` |
| Condition Notes SV | `Liten repa på skrovet` | |
| Condition Notes EN | `Small scratch on hull` | |
| Last Inspection Date | `2026-03-01` | ISO format |

---

### Tab 13 — RIBs

Safety/coach RIB boats shown on the Fleet page.

| Column | Example | Notes |
|--------|---------|-------|
| RIB ID | `RIB001` | |
| Name | `Räddaren` | |
| Teams | `Green, Blue` | Comma-separated |
| Status | `OK` | `OK` / `Needs Service` / `Out of Service` |
| Engine Check Date | `2026-03-01` | ISO format |
| Oil Change Date | `2026-02-15` | ISO format |
| Spark Plugs Date | `2026-02-15` | ISO format |
| Oil Filter Date | `2026-02-15` | ISO format |
| Trailer Check Date | `2026-03-01` | ISO format |
| Notes SV | | |
| Notes EN | | |

---

### Tab 14 — Kiosk Menu

Items sold at the kiosk during events, shown on the Kiosk & Café page.

| Column | Example | Notes |
|--------|---------|-------|
| Item ID | `K001` | |
| Name SV | `Kaffe` | |
| Name EN | `Coffee` | |
| Category | `drink` | `drink` / `food` / `snack` |
| Price SEK | `15` | Number only |
| Allergens | `Gluten, Laktos` | Comma-separated, or leave blank |
| Active | `yes` | Set to `no` to hide from menu |

---

### Tab 15 — Kiosk Shifts

Scheduled kiosk opening hours linked to events.

| Column | Example | Notes |
|--------|---------|-------|
| Shift ID | `SH001` | |
| Event ID | `EVT001` | Must match Events tab |
| Date | `2026-04-18` | ISO format (can differ from event date for multi-day events) |
| Open Time | `08:30` | HH:MM |
| Close Time | `16:00` | HH:MM |
| Volunteers | `Anna L, Björn K` | Comma-separated names |
| Notes SV | `Ta med termosarna!` | |
| Notes EN | `Bring the thermoses!` | |

---

### Tab 16 — Kiosk Fundraising

Season fundraising totals per team, shown as progress bars on the Kiosk page.

| Column | Example | Notes |
|--------|---------|-------|
| Team | `Green` | `Green` / `Blue` / `Red` |
| Raised SEK | `1650` | Running total raised so far |
| Goal SEK | `3000` | Season target |

One row per team (3 rows total).

---

### Tab 17 — Regatta Results

Race results for regattas, shown on the Results tab of the Events & Maps page.
Results are linked to events by Event ID and remain visible after the event date has passed.

| Column | Example | Notes |
|--------|---------|-------|
| Result ID | `RES001` | Unique identifier |
| Event ID | `EVT001` | Must match Events tab |
| Position | `1` | Final overall ranking (1 = winner) |
| Sailor Name | `Erik Andersson` | |
| Sail Number | `SE 7823` | |
| Team | `red` | Lowercase: `green` / `blue` / `red` |
| Race Scores | `1,2,1,3,2` | Comma-separated scores per race. Supports `DSQ`, `DNF`, `DNC`, `OCS`, `BFD` (shown in red) |
| Total Points | `9` | Enter manually (low-point scoring: lower is better) |
| Notes SV | `Bra insats!` | Optional, shown with ⓘ on sailor name |
| Notes EN | `Great effort!` | |

**Variable races:** The results table auto-sizes columns to match the most races in any entry for that regatta. Each regatta can have a different number of races.

---

## Pages & Features

| Page | Route | Data Sources |
|------|-------|-------------|
| Dashboard | `/dashboard` | Events, News, Settings, Sponsors |
| Calendar | `/calendar` | Events |
| Events & Maps | `/events` | Events, Locations, Regatta Results |
| Weather | `/weather` | Open-Meteo API (live) |
| Live Cameras | `/cameras` | Locations (Webcam URL) |
| Coaches & Team | `/coaches` | Coaches, Event Assignments |
| Fleet | `/fleet` | Boats, RIBs |
| Kiosk & Café | `/kiosk` | Kiosk Menu, Kiosk Shifts, Kiosk Fundraising, Settings |
| Club Contacts | `/contacts` | Club Contacts |
| News | `/news` | News |
| Marketplace | `/marketplace` | Marketplace |
| Skill Progression | `/skills` | Skill Progression |
| Safety Checklist | `/safety` | Safety Checklist |
| Subscribe | `/subscribe` | Settings (WhatsApp links) |
| Club Services | `/services` | Static content (boat buying, harbor spots, mast storage) |
| Sponsors | `/sponsors` | Sponsors & Ads |

---

## Development

```sh
npm run dev      # dev server on :8080
npm run build    # production build
npm run lint     # ESLint
```

**Tech stack:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, react-i18next, Leaflet, Open-Meteo API.

**Languages:** Swedish (default) and English. Toggle in the top bar. Translation files: `src/i18n/sv.json` and `src/i18n/en.json`.

**Theme:** Day / Night mode + team colour theming (Green / Blue / Red). Stored in localStorage.
