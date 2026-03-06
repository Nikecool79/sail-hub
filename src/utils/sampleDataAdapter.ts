import * as sample from '@/data/sampleData';
import type { AppData, SailEvent, Coach, EventAssignment, ClubContact, NewsItem, MarketplaceItem, Location, SafetyItem, SkillItem, Sponsor, RegattaResult } from '@/types';

export function convertSampleData(): AppData {
  const events: SailEvent[] = sample.events.map((e) => ({
    eventId: String(e.id),
    nameSv: '',
    nameEn: e.name,
    dateStart: e.date,
    dateEnd: (e as any).endDate || null,
    type: (e.type.charAt(0).toUpperCase() + e.type.slice(1)) as SailEvent['type'],
    teams: e.team ? [e.team.charAt(0).toUpperCase() + e.team.slice(1)] : ['All'],
    locationName: e.location,
    latitude: sample.venues.find((v) => v.name === e.location)?.lat || 0,
    longitude: sample.venues.find((v) => v.name === e.location)?.lng || 0,
    address: sample.venues.find((v) => v.name === e.location)?.address || '',
    parkingInfoSv: '',
    parkingInfoEn: sample.venues.find((v) => v.name === e.location)?.parking || '',
    arrivalTime: '',
    startTime: '',
    endTime: '',
    sailarenaLink: '',
    descriptionSv: '',
    descriptionEn: e.description,
    status: 'Confirmed',
  }));

  const coaches: Coach[] = sample.coaches.map((c, i) => ({
    coachId: `COA${String(i + 1).padStart(3, '0')}`,
    name: c.name,
    phone: c.phone,
    email: c.email,
    teams: [],
    roleSv: '',
    roleEn: c.role,
    bioSv: '',
    bioEn: c.bio,
    photoUrl: '',
    active: true,
  }));

  const eventAssignments: EventAssignment[] = [];

  const clubContacts: ClubContact[] = sample.contacts.map((c, i) => ({
    name: c.name,
    roleSv: '',
    roleEn: c.role,
    phone: c.phone,
    email: c.email,
    photoUrl: '',
    order: i + 1,
  }));

  const news: NewsItem[] = sample.newsItems.map((n) => ({
    newsId: String(n.id),
    date: n.date,
    titleSv: '',
    titleEn: n.title,
    bodySv: '',
    bodyEn: n.body,
    teams: n.team ? [n.team.charAt(0).toUpperCase() + n.team.slice(1)] : ['All'],
    priority: n.pinned ? 'High' : 'Normal',
    author: n.author,
    pinned: n.pinned,
    active: true,
  }));

  const marketplace: MarketplaceItem[] = sample.marketplaceItems.map((m) => ({
    itemId: String(m.id),
    category: m.category.charAt(0).toUpperCase() + m.category.slice(1),
    titleSv: '',
    titleEn: m.title,
    descriptionSv: '',
    descriptionEn: m.description,
    priceSek: m.price,
    condition: m.condition,
    sellerName: m.seller,
    sellerPhone: '',
    sellerEmail: '',
    photoUrl: '',
    externalLink: '',
    facebookLink: '',
    datePosted: m.date,
    status: 'Active',
  }));

  const locations: Location[] = sample.venues.map((v, i) => ({
    locationId: `LOC${String(i + 1).padStart(3, '0')}`,
    name: v.name,
    latitude: v.lat,
    longitude: v.lng,
    address: v.address,
    parkingInfoSv: '',
    parkingInfoEn: v.parking,
    facilitiesSv: '',
    facilitiesEn: v.facilities,
    typicalArrivalTime: '',
    webcamUrl: '',
    website: '',
    googleMapsUrl: '',
    notesSv: '',
    notesEn: '',
  }));

  const safetyChecklist: SafetyItem[] = [];
  sample.safetyItems.forEach((cat) => {
    cat.items.forEach((item) => {
      safetyChecklist.push({
        item: item.name,
        itemSv: '',
        itemEn: item.name,
        requiredFor: item.teams.map((t) => t.charAt(0).toUpperCase() + t.slice(1)),
        descriptionSv: '',
        descriptionEn: item.description,
        category: cat.category,
      });
    });
  });

  const skillProgression: SkillItem[] = [];
  const teamMap: Record<string, string> = { green: 'Green', blue: 'Blue', red: 'Red' };
  const levelMap: Record<string, string> = { green: 'Beginner', blue: 'Intermediate', red: 'Advanced' };
  Object.entries(sample.skills).forEach(([team, skills]) => {
    skills.forEach((s, i) => {
      skillProgression.push({
        level: levelMap[team] || team,
        team: teamMap[team] || team,
        skillSv: '',
        skillEn: s.name,
        descriptionSv: '',
        descriptionEn: s.description,
        order: i + 1,
      });
    });
  });

  const allSponsors: Sponsor[] = [];
  let adIdx = 1;
  const makeSponsor = (s: any, tier: 'Gold' | 'Silver' | 'Bronze'): Sponsor => ({
    adId: `AD${String(adIdx++).padStart(3, '0')}`,
    businessName: s.name,
    category: '',
    tier,
    taglineSv: '',
    taglineEn: s.tagline || '',
    descriptionSv: '',
    descriptionEn: s.description || '',
    logoUrl: '',
    bannerImageUrl: '',
    websiteUrl: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    placement: 'Dashboard + Sidebar',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    teamAffinity: ['All'],
    clickUrl: '',
    active: true,
  });

  sample.sponsors.gold.forEach((s) => allSponsors.push(makeSponsor(s, 'Gold')));
  sample.sponsors.silver.forEach((s) => allSponsors.push(makeSponsor(s, 'Silver')));
  sample.sponsors.bronze.forEach((s) => allSponsors.push(makeSponsor(s, 'Bronze')));

  const settings: Record<string, string> = {
    'Club Name SV': 'Kullaviks Segelsällskap',
    'Club Name EN': 'Kullavik Sailing Club',
    'Default Latitude': '57.4833',
    'Default Longitude': '11.9333',
    'Club Website': '',
    'Sailarena URL': '',
    'Green Team Age Range': '6-9',
    'Blue Team Age Range': '9-12',
    'Red Team Age Range': '12-15',
    'Ad Rotation Interval Seconds': '10',
    'Instagram Skola': 'https://www.instagram.com/kullaviksseglarskola/',
    'Instagram KKKK': 'https://www.instagram.com/kkkk__se/',
    'Facebook Page': 'https://www.facebook.com/kullaviksegelsallskap/',
  };

  return {
    events, coaches, eventAssignments, clubContacts, news,
    marketplace, locations, safetyChecklist, skillProgression, settings, sponsors: allSponsors,
    boats: [],
    ribs: [],
    kioskMenu: sample.kioskMenu,
    kioskShifts: sample.kioskShifts.map((s) => ({ ...s, volunteers: s.volunteers })),
    kioskFundraising: sample.kioskFundraising,
    regattaResults: sample.regattaResults as RegattaResult[],
  };
}
