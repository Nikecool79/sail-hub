/**
 * Club configuration — reads from Google Sheets Settings tab with sensible defaults.
 *
 * Every club-specific value flows through here so that a new club deployment
 * only needs its own Google Sheet (with a Settings tab) and env vars.
 */

// ── Team definitions ────────────────────────────────────────────────
export const TEAMS = [
  { id: 'green' as const, color: '#2E7D32', bgClass: 'from-green-50 to-green-100', tailwind: 'bg-green-100 text-green-800' },
  { id: 'blue' as const, color: '#1565C0', bgClass: 'from-blue-50 to-blue-100', tailwind: 'bg-blue-100 text-blue-800' },
  { id: 'red' as const, color: '#C62828', bgClass: 'from-red-50 to-red-100', tailwind: 'bg-red-100 text-red-800' },
  { id: 'ilca' as const, color: '#546E7A', bgClass: 'from-gray-50 to-gray-100', tailwind: 'bg-gray-100 text-gray-700' },
] as const;

export const TEAM_COLORS: Record<string, string> = Object.fromEntries(
  TEAMS.map(t => [t.id, t.color]),
);

export const TEAM_BG: Record<string, string> = Object.fromEntries(
  TEAMS.map(t => [t.id, t.tailwind]),
);

// ── Sponsor tier colors (constant across clubs) ─────────────────────
export const TIER_COLORS = {
  Gold: '#D4AF37',
  Silver: '#9CA3AF',
  Bronze: '#B45309',
} as const;

// ── Settings helpers ────────────────────────────────────────────────
// The Settings tab uses key/value rows. These helpers read from the
// parsed settings record with typed defaults.

type Settings = Record<string, string>;

const DEFAULTS: Settings = {
  // ── Identity (rows 2-8 in Sheet) ──
  'Club Name SV': 'My Sailing Club',
  'Club Name EN': 'My Sailing Club',
  'Club Short Name': '',
  'Club Address': '',
  'Default Latitude': '57.4833',
  'Default Longitude': '11.9333',
  'Default Location Name': '',
  'Home Location Keyword': '',
  'Club Website': '',
  'Sailarena URL': '',
  'Club Logo URL': '',
  // ── WhatsApp per team (rows 9-11) ──
  'WhatsApp Green Group': '',
  'WhatsApp Blue Group': '',
  'WhatsApp Red Group': '',
  'WhatsApp ILCA Group': '',
  // ── Social (rows 12-14) ──
  'Facebook Page': '',
  'Instagram Skola': '',
  'Instagram KKKK': '',
  // ── Signup / volunteer (rows 15-16) ──
  'Kiosk Signup URL': '',
  'Mailchimp Signup URL': '',
  // ── Teams (rows 17-19) ──
  'Green Team Age Range': '6-9',
  'Blue Team Age Range': '9-12',
  'Red Team Age Range': '12-15',
  'ILCA Team Age Range': '16+',
  // ── Ads & sponsors (rows 20-25) ──
  'Ad Rotation Interval Seconds': '10',
  'Max Ads Per Page': '3',
  'Ad Contact Email': '',
  'Gold Tier Price SEK/Month': '500',
  'Silver Tier Price SEK/Month': '300',
  'Bronze Tier Price SEK/Month': '150',
  // ── Media (row 26) ──
  'Default Webcam URL': '',
  // ── Feature flags ──
  'Enable Kiosk': 'yes',
  'Enable Marketplace': 'yes',
  'Enable Live Cameras': 'yes',
  'Enable Club Services': 'yes',
};

/** Read a single setting, falling back to DEFAULTS then to the provided fallback. */
export function getSetting(settings: Settings | undefined, key: string, fallback?: string): string {
  return settings?.[key] || DEFAULTS[key] || fallback || '';
}

/** Club name in the current UI language. */
export function getClubName(settings: Settings | undefined, lang: 'sv' | 'en'): string {
  return getSetting(settings, lang === 'sv' ? 'Club Name SV' : 'Club Name EN');
}

/** Short name for the header (e.g. "KSS"). Falls back to first word of SV name. */
export function getClubShortName(settings: Settings | undefined): string {
  const explicit = getSetting(settings, 'Club Short Name');
  if (explicit) return explicit;
  const full = getSetting(settings, 'Club Name SV');
  return full.split(' ')[0] || 'Club';
}

/** Default map center coordinates. */
export function getDefaultCoords(settings: Settings | undefined): { lat: number; lng: number } {
  return {
    lat: parseFloat(getSetting(settings, 'Default Latitude')),
    lng: parseFloat(getSetting(settings, 'Default Longitude')),
  };
}

/** Default location display name. */
export function getDefaultLocationName(settings: Settings | undefined): string {
  return getSetting(settings, 'Default Location Name');
}

/**
 * Check whether a location name is the club's "home" venue.
 * Uses the "Home Location Keyword" setting if set, otherwise
 * matches against the default location name.
 */
export function isHomeLocation(settings: Settings | undefined, locationName: string): boolean {
  const keyword = getSetting(settings, 'Home Location Keyword');
  if (keyword) return locationName.toLowerCase().includes(keyword.toLowerCase());
  const defaultName = getSetting(settings, 'Default Location Name');
  if (defaultName) return locationName.toLowerCase().includes(defaultName.toLowerCase());
  return false;
}

/** Whether a feature page is enabled. */
export function isFeatureEnabled(settings: Settings | undefined, key: string): boolean {
  const val = getSetting(settings, key);
  return val.toLowerCase() === 'yes' || val.toLowerCase() === 'true' || val === '1';
}

/** Age range string for a team, e.g. "6–9". */
export function getTeamAgeRange(settings: Settings | undefined, teamId: string): string {
  const key = `${teamId.charAt(0).toUpperCase() + teamId.slice(1)} Team Age Range`;
  return getSetting(settings, key);
}
