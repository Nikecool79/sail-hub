import type {
  SailEvent, Coach, EventAssignment, ClubContact, NewsItem,
  MarketplaceItem, Location, SafetyItem, SkillItem, Sponsor,
  Boat, Rib, KioskItem, KioskShift, KioskSeason, RegattaResult,
} from '@/types';

function parseArray(val: string): string[] {
  if (!val) return [];
  return val.split(',').map((s) => s.trim()).filter(Boolean);
}

function parseBool(val: string): boolean {
  if (!val) return false;
  return val.toLowerCase() === 'yes' || val.toLowerCase() === 'true' || val === '1';
}

function parseNum(val: string): number {
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}

function col(row: string[], headers: Record<string, number>, name: string): string {
  const idx = headers[name];
  return idx !== undefined ? (row[idx] ?? '') : '';
}

function buildHeaders(headerRow: string[]): Record<string, number> {
  const headers: Record<string, number> = {};
  headerRow.forEach((h, i) => {
    headers[h.trim()] = i;
  });
  return headers;
}

export function parseEvents(rows: string[][]): SailEvent[] {
  if (rows.length < 2) return [];
  const h = buildHeaders(rows[0]);
  return rows.slice(1).filter(r => r.length > 0).map((r) => ({
    eventId: col(r, h, 'Event ID'),
    nameSv: col(r, h, 'Event Name SV'),
    nameEn: col(r, h, 'Event Name EN'),
    dateStart: col(r, h, 'Date Start'),
    dateEnd: col(r, h, 'Date End') || null,
    type: col(r, h, 'Type') as SailEvent['type'],
    teams: parseArray(col(r, h, 'Team(s)')),
    locationName: col(r, h, 'Location Name'),
    latitude: parseNum(col(r, h, 'Latitude')),
    longitude: parseNum(col(r, h, 'Longitude')),
    address: col(r, h, 'Address'),
    parkingInfoSv: col(r, h, 'Parking Info SV'),
    parkingInfoEn: col(r, h, 'Parking Info EN'),
    arrivalTime: col(r, h, 'Arrival Time'),
    startTime: col(r, h, 'Start Time'),
    endTime: col(r, h, 'End Time'),
    sailarenaLink: col(r, h, 'Sailarena Link'),
    descriptionSv: col(r, h, 'Description SV'),
    descriptionEn: col(r, h, 'Description EN'),
    status: col(r, h, 'Status') || 'Planned',
  }));
}

export function parseCoaches(rows: string[][]): Coach[] {
  if (rows.length < 2) return [];
  const h = buildHeaders(rows[0]);
  return rows.slice(1).filter(r => r.length > 0).map((r) => ({
    coachId: col(r, h, 'Coach ID'),
    name: col(r, h, 'Name'),
    phone: col(r, h, 'Phone'),
    email: col(r, h, 'Email'),
    teams: parseArray(col(r, h, 'Team(s)')),
    roleSv: col(r, h, 'Role SV'),
    roleEn: col(r, h, 'Role EN'),
    bioSv: col(r, h, 'Bio SV'),
    bioEn: col(r, h, 'Bio EN'),
    photoUrl: col(r, h, 'Photo URL'),
    active: parseBool(col(r, h, 'Active')),
  }));
}

export function parseEventAssignments(rows: string[][]): EventAssignment[] {
  if (rows.length < 2) return [];
  const h = buildHeaders(rows[0]);
  return rows.slice(1).filter(r => r.length > 0).map((r) => ({
    eventId: col(r, h, 'Event ID'),
    eventName: col(r, h, 'Event Name'),
    coachId: col(r, h, 'Coach ID'),
    coachName: col(r, h, 'Coach Name'),
    roleAtEventSv: col(r, h, 'Role at Event SV'),
    roleAtEventEn: col(r, h, 'Role at Event EN'),
    rigsAvailable: parseNum(col(r, h, 'Rigs Available')),
    boatsAvailable: parseNum(col(r, h, 'Boats Available')),
    notesSv: col(r, h, 'Notes SV'),
    notesEn: col(r, h, 'Notes EN'),
  }));
}

export function parseClubContacts(rows: string[][]): ClubContact[] {
  if (rows.length < 2) return [];
  const h = buildHeaders(rows[0]);
  return rows.slice(1).filter(r => r.length > 0).map((r) => ({
    name: col(r, h, 'Name'),
    roleSv: col(r, h, 'Role SV'),
    roleEn: col(r, h, 'Role EN'),
    phone: col(r, h, 'Phone'),
    email: col(r, h, 'Email'),
    photoUrl: col(r, h, 'Photo URL'),
    order: parseNum(col(r, h, 'Order')),
  }));
}

export function parseNews(rows: string[][]): NewsItem[] {
  if (rows.length < 2) return [];
  const h = buildHeaders(rows[0]);
  return rows.slice(1).filter(r => r.length > 0).map((r) => ({
    newsId: col(r, h, 'News ID'),
    date: col(r, h, 'Date'),
    titleSv: col(r, h, 'Title SV'),
    titleEn: col(r, h, 'Title EN'),
    bodySv: col(r, h, 'Body SV'),
    bodyEn: col(r, h, 'Body EN'),
    teams: parseArray(col(r, h, 'Team(s)')),
    priority: col(r, h, 'Priority'),
    author: col(r, h, 'Author'),
    pinned: parseBool(col(r, h, 'Pinned')),
    active: parseBool(col(r, h, 'Active')),
  }));
}

export function parseMarketplace(rows: string[][]): MarketplaceItem[] {
  if (rows.length < 2) return [];
  const h = buildHeaders(rows[0]);
  return rows.slice(1).filter(r => r.length > 0).map((r) => ({
    itemId: col(r, h, 'Item ID'),
    category: col(r, h, 'Category'),
    titleSv: col(r, h, 'Title SV'),
    titleEn: col(r, h, 'Title EN'),
    descriptionSv: col(r, h, 'Description SV'),
    descriptionEn: col(r, h, 'Description EN'),
    priceSek: parseNum(col(r, h, 'Price SEK')),
    condition: col(r, h, 'Condition'),
    sellerName: col(r, h, 'Seller Name'),
    sellerPhone: col(r, h, 'Seller Phone'),
    sellerEmail: col(r, h, 'Seller Email'),
    photoUrl: col(r, h, 'Photo URL'),
    externalLink: col(r, h, 'External Link'),
    facebookLink: col(r, h, 'Facebook Link'),
    datePosted: col(r, h, 'Date Posted'),
    status: col(r, h, 'Status') || 'Active',
  }));
}

export function parseLocations(rows: string[][]): Location[] {
  if (rows.length < 2) return [];
  const h = buildHeaders(rows[0]);
  return rows.slice(1).filter(r => r.length > 0).map((r) => ({
    locationId: col(r, h, 'Location ID'),
    name: col(r, h, 'Name'),
    latitude: parseNum(col(r, h, 'Latitude')),
    longitude: parseNum(col(r, h, 'Longitude')),
    address: col(r, h, 'Address'),
    parkingInfoSv: col(r, h, 'Parking Info SV'),
    parkingInfoEn: col(r, h, 'Parking Info EN'),
    facilitiesSv: col(r, h, 'Facilities SV'),
    facilitiesEn: col(r, h, 'Facilities EN'),
    typicalArrivalTime: col(r, h, 'Typical Arrival Time'),
    webcamUrl: col(r, h, 'Webcam URL'),
    website: col(r, h, 'Website'),
    googleMapsUrl: col(r, h, 'Google Maps URL'),
    notesSv: col(r, h, 'Notes SV'),
    notesEn: col(r, h, 'Notes EN'),
  }));
}

export function parseSafetyChecklist(rows: string[][]): SafetyItem[] {
  if (rows.length < 2) return [];
  const h = buildHeaders(rows[0]);
  return rows.slice(1).filter(r => r.length > 0).map((r) => {
    const itemSv = col(r, h, 'Item SV');
    const itemEn = col(r, h, 'Item EN');
    const item = col(r, h, 'Item');
    return {
      item: item || itemSv || itemEn,
      itemSv: itemSv || item,
      itemEn: itemEn || item,
      requiredFor: parseArray(col(r, h, 'Required For')),
      descriptionSv: col(r, h, 'Description SV'),
      descriptionEn: col(r, h, 'Description EN'),
      category: col(r, h, 'Category'),
    };
  });
}

export function parseSkillProgression(rows: string[][]): SkillItem[] {
  if (rows.length < 2) return [];
  const h = buildHeaders(rows[0]);
  return rows.slice(1).filter(r => r.length > 0).map((r) => ({
    level: col(r, h, 'Level'),
    team: col(r, h, 'Team'),
    skillSv: col(r, h, 'Skill SV'),
    skillEn: col(r, h, 'Skill EN'),
    descriptionSv: col(r, h, 'Description SV'),
    descriptionEn: col(r, h, 'Description EN'),
    order: parseNum(col(r, h, 'Order')),
  }));
}

export function parseSettings(rows: string[][]): Record<string, string> {
  if (rows.length < 2) return {};
  const h = buildHeaders(rows[0]);
  const settings: Record<string, string> = {};
  rows.slice(1).filter(r => r.length > 0).forEach((r) => {
    const key = col(r, h, 'Setting');
    const value = col(r, h, 'Value');
    if (key) settings[key] = value;
  });
  return settings;
}

export function parseSponsors(rows: string[][]): Sponsor[] {
  if (rows.length < 2) return [];
  const h = buildHeaders(rows[0]);
  return rows.slice(1).filter(r => r.length > 0).map((r) => ({
    adId: col(r, h, 'Ad ID'),
    businessName: col(r, h, 'Business Name'),
    category: col(r, h, 'Category'),
    tier: col(r, h, 'Tier') as Sponsor['tier'],
    taglineSv: col(r, h, 'Tagline SV'),
    taglineEn: col(r, h, 'Tagline EN'),
    descriptionSv: col(r, h, 'Description SV'),
    descriptionEn: col(r, h, 'Description EN'),
    logoUrl: col(r, h, 'Logo URL'),
    bannerImageUrl: col(r, h, 'Banner Image URL'),
    websiteUrl: col(r, h, 'Website URL'),
    contactName: col(r, h, 'Contact Name'),
    contactPhone: col(r, h, 'Contact Phone'),
    contactEmail: col(r, h, 'Contact Email'),
    placement: col(r, h, 'Placement'),
    startDate: col(r, h, 'Start Date'),
    endDate: col(r, h, 'End Date'),
    teamAffinity: parseArray(col(r, h, 'Team Affinity')),
    clickUrl: col(r, h, 'Click URL'),
    active: parseBool(col(r, h, 'Active')),
  }));
}

const boatStatusMap: Record<string, Boat['status']> = {
  'available': 'Available', 'tillgänglig': 'Available',
  'in repair': 'In Repair', 'under reparation': 'In Repair',
  'retired': 'Retired', 'uttagen': 'Retired',
  'lent out': 'Lent Out', 'utlånad': 'Lent Out',
  'private': 'Private', 'privat': 'Private',
};

function normalizeBoatStatus(raw: string): Boat['status'] {
  return boatStatusMap[raw.trim().toLowerCase()] || 'Available';
}

const ribStatusMap: Record<string, Rib['status']> = {
  'ok': 'OK',
  'needs service': 'Needs Service', 'behöver service': 'Needs Service',
  'out of service': 'Out of Service', 'ur drift': 'Out of Service',
};

function normalizeRibStatus(raw: string): Rib['status'] {
  return ribStatusMap[raw.trim().toLowerCase()] || 'OK';
}


export function parseBoats(rows: string[][]): Boat[] {
  if (rows.length < 2) return [];
  const h = buildHeaders(rows[0]);
  return rows.slice(1).filter(r => r.length > 0).map((r) => ({
    boatId: col(r, h, 'Boat ID'),
    name: col(r, h, 'Name'),
    sailNumber: col(r, h, 'Sail Number'),
    team: col(r, h, 'Team'),
    status: normalizeBoatStatus(col(r, h, 'Status')),
    conditionNotesSv: col(r, h, 'Condition Notes SV'),
    conditionNotesEn: col(r, h, 'Condition Notes EN'),
    lastInspectionDate: col(r, h, 'Last Inspection Date'),
    space: col(r, h, 'Space'),
  }));
}

export function parseRibs(rows: string[][]): Rib[] {
  if (rows.length < 2) return [];
  const h = buildHeaders(rows[0]);
  return rows.slice(1).filter(r => r.length > 0).map((r) => ({
    ribId: col(r, h, 'RIB ID'),
    name: col(r, h, 'Name'),
    teams: parseArray(col(r, h, 'Teams')),
    status: normalizeRibStatus(col(r, h, 'Status')),
    engineCheckDate: col(r, h, 'Engine Check Date'),
    oilChangeDate: col(r, h, 'Oil Change Date'),
    sparkPlugsDate: col(r, h, 'Spark Plugs Date'),
    oilFilterDate: col(r, h, 'Oil Filter Date'),
    trailerCheckDate: col(r, h, 'Trailer Check Date'),
    batteryCheckDate: col(r, h, 'Battery Check Date'),
    cleaningDate: col(r, h, 'Cleaning Date'),
    petrolCheckDate: col(r, h, 'Petrol Check Date'),
    generalCheckDate: col(r, h, 'General Check Date'),
    notesSv: col(r, h, 'Notes SV'),
    notesEn: col(r, h, 'Notes EN'),
  }));
}

export function parseKioskMenu(rows: string[][]): KioskItem[] {
  if (rows.length < 2) return [];
  const h = buildHeaders(rows[0]);
  return rows.slice(1).filter(r => r.length > 0).map((r) => ({
    itemId: col(r, h, 'Item ID'),
    nameSv: col(r, h, 'Name SV'),
    nameEn: col(r, h, 'Name EN'),
    category: (col(r, h, 'Category').toLowerCase() || 'snack') as KioskItem['category'],
    priceSek: parseNum(col(r, h, 'Price SEK')),
    allergens: col(r, h, 'Allergens'),
    active: parseBool(col(r, h, 'Active')),
  }));
}

export function parseKioskShifts(rows: string[][]): KioskShift[] {
  if (rows.length < 2) return [];
  const h = buildHeaders(rows[0]);
  return rows.slice(1).filter(r => r.length > 0).map((r) => ({
    shiftId: col(r, h, 'Shift ID'),
    eventId: col(r, h, 'Event ID'),
    date: col(r, h, 'Date'),
    openTime: col(r, h, 'Open Time'),
    closeTime: col(r, h, 'Close Time'),
    volunteers: parseArray(col(r, h, 'Volunteers')),
    notesSv: col(r, h, 'Notes SV'),
    notesEn: col(r, h, 'Notes EN'),
  }));
}

export function parseKioskFundraising(rows: string[][]): KioskSeason[] {
  if (rows.length < 2) return [];
  const h = buildHeaders(rows[0]);
  return rows.slice(1).filter(r => r.length > 0).map((r) => ({
    teamColor: col(r, h, 'Team').toLowerCase(),
    raisedSek: parseNum(col(r, h, 'Raised SEK')),
    goalSek: parseNum(col(r, h, 'Goal SEK')),
  }));
}

export function parseRegattaResults(rows: string[][]): RegattaResult[] {
  if (rows.length < 2) return [];
  const h = buildHeaders(rows[0]);
  return rows.slice(1).filter(r => r.length > 0).map((r) => ({
    resultId: col(r, h, 'Result ID'),
    eventId: col(r, h, 'Event ID'),
    position: parseNum(col(r, h, 'Position')),
    sailorName: col(r, h, 'Sailor Name'),
    sailNumber: col(r, h, 'Sail Number'),
    team: col(r, h, 'Team').toLowerCase(),
    raceScores: col(r, h, 'Race Scores'),
    totalPoints: parseNum(col(r, h, 'Total Points')),
    notesSv: col(r, h, 'Notes SV'),
    notesEn: col(r, h, 'Notes EN'),
  }));
}
