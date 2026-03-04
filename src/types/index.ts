export interface SailEvent {
  eventId: string;
  nameSv: string;
  nameEn: string;
  dateStart: string;
  dateEnd: string | null;
  type: 'Regatta' | 'Training' | 'Championship' | 'Social';
  teams: string[];
  locationName: string;
  latitude: number;
  longitude: number;
  address: string;
  parkingInfoSv: string;
  parkingInfoEn: string;
  arrivalTime: string;
  startTime: string;
  sailarenaLink: string;
  descriptionSv: string;
  descriptionEn: string;
  status: string;
}

export interface Coach {
  coachId: string;
  name: string;
  phone: string;
  email: string;
  teams: string[];
  roleSv: string;
  roleEn: string;
  bioSv: string;
  bioEn: string;
  photoUrl: string;
  active: boolean;
}

export interface EventAssignment {
  eventId: string;
  eventName: string;
  coachId: string;
  coachName: string;
  roleAtEventSv: string;
  roleAtEventEn: string;
  rigsAvailable: number;
  boatsAvailable: number;
  notesSv: string;
  notesEn: string;
}

export interface ClubContact {
  name: string;
  roleSv: string;
  roleEn: string;
  phone: string;
  email: string;
  photoUrl: string;
  order: number;
}

export interface NewsItem {
  newsId: string;
  date: string;
  titleSv: string;
  titleEn: string;
  bodySv: string;
  bodyEn: string;
  teams: string[];
  priority: string;
  author: string;
  pinned: boolean;
  active: boolean;
}

export interface MarketplaceItem {
  itemId: string;
  category: string;
  titleSv: string;
  titleEn: string;
  descriptionSv: string;
  descriptionEn: string;
  priceSek: number;
  condition: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  photoUrl: string;
  externalLink: string;
  datePosted: string;
  status: string;
}

export interface Location {
  locationId: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  parkingInfoSv: string;
  parkingInfoEn: string;
  facilitiesSv: string;
  facilitiesEn: string;
  typicalArrivalTime: string;
  webcamUrl: string;
  website: string;
  notesSv: string;
  notesEn: string;
}

export interface SafetyItem {
  item: string;
  requiredFor: string[];
  descriptionSv: string;
  descriptionEn: string;
  category: string;
}

export interface SkillItem {
  level: string;
  team: string;
  skillSv: string;
  skillEn: string;
  descriptionSv: string;
  descriptionEn: string;
  order: number;
}

export interface Sponsor {
  adId: string;
  businessName: string;
  category: string;
  tier: 'Gold' | 'Silver' | 'Bronze';
  taglineSv: string;
  taglineEn: string;
  descriptionSv: string;
  descriptionEn: string;
  logoUrl: string;
  bannerImageUrl: string;
  websiteUrl: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  placement: string;
  startDate: string;
  endDate: string;
  teamAffinity: string[];
  clickUrl: string;
  active: boolean;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitation: number;
  uvIndex: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  weatherCode: number;
  isDay: boolean;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  windSpeedMax: number;
  windDirectionDominant: number;
  weatherCode: number;
  precipitationSum: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  location: string;
  fetchedAt: number;
}

export interface AppData {
  events: SailEvent[];
  coaches: Coach[];
  eventAssignments: EventAssignment[];
  clubContacts: ClubContact[];
  news: NewsItem[];
  marketplace: MarketplaceItem[];
  locations: Location[];
  safetyChecklist: SafetyItem[];
  skillProgression: SkillItem[];
  settings: Record<string, string>;
  sponsors: Sponsor[];
}
