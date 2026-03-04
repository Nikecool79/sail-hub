export interface SailingCondition {
  labelKey: string;
  color: string;
}

export function getSailingCondition(ms: number): SailingCondition {
  if (ms <= 1) return { labelKey: 'weather.sailing.veryLight', color: 'bg-yellow-400' };
  if (ms <= 6) return { labelKey: 'weather.sailing.good', color: 'bg-green-500' };
  if (ms <= 9) return { labelKey: 'weather.sailing.moderate', color: 'bg-yellow-400' };
  return { labelKey: 'weather.sailing.notRecommended', color: 'bg-red-500' };
}
