export type FanStatus = 'Nouveau' | 'Habitué' | 'Fidèle' | 'Pilier'

export function getFanStatus(visitCount: number): FanStatus {
  if (visitCount >= 10) return 'Pilier'
  if (visitCount >= 5) return 'Fidèle'
  if (visitCount >= 2) return 'Habitué'
  return 'Nouveau'
}
