import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {StorageService} from '../services/storage';
import {AnalyticsService} from '../services/analytics';
import {DailyEntry, TrendData, Pattern} from '../types';

export const InsightsScreen: React.FC = () => {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await StorageService.getAllEntries();
    setEntries(data);

    if (data.length > 0) {
      const trendsData = AnalyticsService.calculateTrends(data);
      const patternsData = AnalyticsService.detectPatterns(data);
      const streakDays = AnalyticsService.getStreakDays(data);

      setTrends(trendsData);
      setPatterns(patternsData);
      setStreak(streakDays);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return '📈';
      case 'declining':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return '#4CAF50';
      case 'declining':
        return '#FF6B6B';
      default:
        return '#FFA726';
    }
  };

  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'spiral':
        return '⚠️';
      case 'recovery':
        return '🌟';
      case 'stable':
        return '✅';
      case 'fluctuating':
        return '🌊';
      default:
        return '📊';
    }
  };

  const factorLabels = {
    stress: 'Stress',
    mentalDarkness: 'Mental Darkness',
    sociality: 'Sociality',
    affection: 'Affection',
  };

  if (entries.length < 2) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Insights</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Not enough data yet</Text>
            <Text style={styles.emptySubtext}>
              Keep checking in daily to see trends and patterns in your mental
              health.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Insights</Text>
        <Text style={styles.subtitle}>
          Understanding your mental health patterns
        </Text>

        {streak > 0 && (
          <View style={styles.streakCard}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <View style={styles.streakContent}>
              <Text style={styles.streakNumber}>{streak}</Text>
              <Text style={styles.streakLabel}>
                Day{streak !== 1 ? 's' : ''} Streak
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trends</Text>
          {trends.map(trend => (
            <View key={trend.factor} style={styles.trendCard}>
              <View style={styles.trendHeader}>
                <Text style={styles.trendLabel}>
                  {factorLabels[trend.factor]}
                </Text>
                <View
                  style={[
                    styles.trendBadge,
                    {backgroundColor: getTrendColor(trend.trend)},
                  ]}>
                  <Text style={styles.trendBadgeText}>
                    {getTrendIcon(trend.trend)} {trend.trend}
                  </Text>
                </View>
              </View>
              <View style={styles.trendStats}>
                <View style={styles.trendStat}>
                  <Text style={styles.trendStatLabel}>7-day avg</Text>
                  <Text style={styles.trendStatValue}>
                    {trend.avgLast7Days.toFixed(1)}
                  </Text>
                </View>
                <View style={styles.trendStat}>
                  <Text style={styles.trendStatLabel}>30-day avg</Text>
                  <Text style={styles.trendStatValue}>
                    {trend.avgLast30Days.toFixed(1)}
                  </Text>
                </View>
                <View style={styles.trendStat}>
                  <Text style={styles.trendStatLabel}>Change</Text>
                  <Text
                    style={[
                      styles.trendStatValue,
                      {color: getTrendColor(trend.trend)},
                    ]}>
                    {trend.changePercent.toFixed(1)}%
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patterns</Text>
          {patterns.map((pattern, index) => (
            <View key={index} style={styles.patternCard}>
              <View style={styles.patternHeader}>
                <Text style={styles.patternIcon}>
                  {getPatternIcon(pattern.type)}
                </Text>
                <View style={styles.patternContent}>
                  <Text style={styles.patternType}>
                    {pattern.type.charAt(0).toUpperCase() +
                      pattern.type.slice(1)}
                  </Text>
                  <Text style={styles.patternDescription}>
                    {pattern.description}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Check-ins</Text>
              <Text style={styles.summaryValue}>{entries.length}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Current Streak</Text>
              <Text style={styles.summaryValue}>{streak} days</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#BBB',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  streakCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streakEmoji: {
    fontSize: 48,
    marginRight: 20,
  },
  streakContent: {
    flex: 1,
  },
  streakNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  streakLabel: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  trendCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  trendBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  trendBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  trendStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  trendStat: {
    alignItems: 'center',
  },
  trendStatLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  trendStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  patternCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  patternHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  patternIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  patternContent: {
    flex: 1,
  },
  patternType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  patternDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
});
