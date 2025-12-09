import {DailyEntry, MentalFactors, TrendData, Pattern} from '../types';

export class AnalyticsService {
  static calculateTrends(entries: DailyEntry[]): TrendData[] {
    if (entries.length < 2) {
      return [];
    }

    const sortedEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp);
    const factors: Array<keyof MentalFactors> = [
      'stress',
      'mentalDarkness',
      'sociality',
      'affection',
    ];

    return factors.map(factor => {
      const last7Days = sortedEntries.slice(-7);
      const last30Days = sortedEntries.slice(-30);

      const avg7 = this.calculateAverage(last7Days, factor);
      const avg30 = this.calculateAverage(last30Days, factor);

      let trend: 'improving' | 'declining' | 'stable' = 'stable';
      const changePercent = avg30 > 0 ? ((avg7 - avg30) / avg30) * 100 : 0;

      // For stress and mental darkness, lower is better
      // For sociality and affection, higher is better
      const isPositiveFactor = factor === 'sociality' || factor === 'affection';

      if (Math.abs(changePercent) < 5) {
        trend = 'stable';
      } else if (changePercent > 0) {
        trend = isPositiveFactor ? 'improving' : 'declining';
      } else {
        trend = isPositiveFactor ? 'declining' : 'improving';
      }

      return {
        factor,
        trend,
        changePercent: Math.abs(changePercent),
        avgLast7Days: avg7,
        avgLast30Days: avg30,
      };
    });
  }

  static detectPatterns(entries: DailyEntry[]): Pattern[] {
    if (entries.length < 7) {
      return [];
    }

    const patterns: Pattern[] = [];
    const sortedEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp);
    const recent = sortedEntries.slice(-14);

    // Calculate overall mental health score (lower is better)
    const scores = recent.map(e => {
      const {stress, mentalDarkness, sociality, affection} = e.factors;
      return (stress + mentalDarkness + (10 - sociality) + (10 - affection)) / 4;
    });

    // Detect spiral (consistently worsening)
    const firstHalf = scores.slice(0, 7);
    const secondHalf = scores.slice(7);
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    if (secondAvg - firstAvg > 1.5) {
      patterns.push({
        type: 'spiral',
        description:
          'Your mental health factors show a declining trend. Consider reaching out to someone you trust.',
        confidence: Math.min((secondAvg - firstAvg) / 3, 1),
        detectedAt: new Date().toISOString(),
      });
    } else if (firstAvg - secondAvg > 1.5) {
      patterns.push({
        type: 'recovery',
        description:
          "You're showing signs of improvement! Keep up with what's working.",
        confidence: Math.min((firstAvg - secondAvg) / 3, 1),
        detectedAt: new Date().toISOString(),
      });
    } else {
      // Check for fluctuation
      const variance =
        scores.reduce((sum, score) => {
          const diff = score - (firstAvg + secondAvg) / 2;
          return sum + diff * diff;
        }, 0) / scores.length;

      if (variance > 2) {
        patterns.push({
          type: 'fluctuating',
          description:
            'Your mood has been fluctuating. Try to identify triggers or patterns.',
          confidence: Math.min(variance / 4, 1),
          detectedAt: new Date().toISOString(),
        });
      } else {
        patterns.push({
          type: 'stable',
          description: 'Your mental health has been relatively stable.',
          confidence: 1 - Math.min(variance / 2, 1),
          detectedAt: new Date().toISOString(),
        });
      }
    }

    return patterns;
  }

  private static calculateAverage(
    entries: DailyEntry[],
    factor: keyof MentalFactors
  ): number {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, entry) => acc + entry.factors[factor], 0);
    return sum / entries.length;
  }

  static getStreakDays(entries: DailyEntry[]): number {
    if (entries.length === 0) return 0;

    const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if there's an entry for today
    const todayStr = today.toISOString().split('T')[0];
    if (sortedEntries[0].date !== todayStr) {
      return 0;
    }

    for (let i = 1; i < sortedEntries.length; i++) {
      const currentDate = new Date(sortedEntries[i - 1].date);
      const prevDate = new Date(sortedEntries[i].date);
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
}
