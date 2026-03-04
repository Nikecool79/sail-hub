export interface SailingCondition {
  labelKey: string;
  color: string;
}

export function getSailingCondition(knots: number): SailingCondition {
  if (knots <= 2) return { labelKey: 'weather.sailing.veryLight', color: 'bg-yellow-400' };
  if (knots <= 12) return { labelKey: 'weather.sailing.good', color: 'bg-green-500' };
  if (knots <= 18) return { labelKey: 'weather.sailing.moderate', color: 'bg-yellow-400' };
  return { labelKey: 'weather.sailing.notRecommended', color: 'bg-red-500' };
}
