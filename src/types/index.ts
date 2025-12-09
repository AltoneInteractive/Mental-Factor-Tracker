export interface MentalFactors {
  stress: number;
  mentalDarkness: number;
  sociality: number;
  affection: number;
}

export interface DailyEntry {
  id: string;
  date: string; // ISO date string
  timestamp: number;
  factors: MentalFactors;
  notes?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  time: string; // HH:mm format
  channelId?: string;
}

export interface TrendData {
  factor: keyof MentalFactors;
  trend: 'improving' | 'declining' | 'stable';
  changePercent: number;
  avgLast7Days: number;
  avgLast30Days: number;
}

export interface Pattern {
  type: 'spiral' | 'recovery' | 'stable' | 'fluctuating';
  description: string;
  confidence: number;
  detectedAt: string;
}
