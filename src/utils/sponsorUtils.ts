import type { Sponsor } from '@/types';

export function getActiveSponsors(sponsors: Sponsor[]): Sponsor[] {
  const today = new Date().toISOString().split('T')[0];
  return sponsors.filter(
    (s) => s.active && (!s.startDate || s.startDate <= today) && (!s.endDate || s.endDate >= today)
  );
}

export function getSponsorsByTier(sponsors: Sponsor[], tier: Sponsor['tier']): Sponsor[] {
  return getActiveSponsors(sponsors).filter((s) => s.tier === tier);
}

export function getSponsorsByPlacement(sponsors: Sponsor[], placement: string): Sponsor[] {
  return getActiveSponsors(sponsors).filter((s) => s.placement.includes(placement));
}

export function getSponsorsForTeam(sponsors: Sponsor[], team: string | null): Sponsor[] {
  return getActiveSponsors(sponsors).filter(
    (s) => s.teamAffinity.includes('All') || (team && s.teamAffinity.some((t) => t.toLowerCase() === team.toLowerCase()))
  );
}

const clickCounts = new Map<string, number>();

export function trackSponsorClick(adId: string, clickUrl: string): void {
  clickCounts.set(adId, (clickCounts.get(adId) || 0) + 1);
  if (clickUrl) window.open(clickUrl, '_blank', 'noopener,noreferrer');
}
