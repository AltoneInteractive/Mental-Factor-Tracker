import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {StorageService} from '../services/storage';
import {DailyEntry, MentalFactors} from '../types';

const screenWidth = Dimensions.get('window').width;

export const HistoryScreen: React.FC = () => {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [selectedFactor, setSelectedFactor] =
    useState<keyof MentalFactors>('stress');
  const [timeRange, setTimeRange] = useState<7 | 30>(30);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const data = await StorageService.getAllEntries();
    setEntries(data);
  };

  const getChartData = () => {
    const sortedEntries = [...entries]
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-timeRange);

    if (sortedEntries.length === 0) {
      return {
        labels: [''],
        datasets: [{data: [0]}],
      };
    }

    const labels = sortedEntries.map(e => {
      const date = new Date(e.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    const data = sortedEntries.map(e => e.factors[selectedFactor]);

    return {
      labels,
      datasets: [{data}],
    };
  };

  const factorColors = {
    stress: '#FF6B6B',
    mentalDarkness: '#4A5568',
    sociality: '#4ECDC4',
    affection: '#95E1D3',
  };

  const factorLabels = {
    stress: 'Stress',
    mentalDarkness: 'Mental Darkness',
    sociality: 'Sociality',
    affection: 'Affection',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your History</Text>
        <Text style={styles.subtitle}>
          Track your mental health trends over time
        </Text>

        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No entries yet!</Text>
            <Text style={styles.emptySubtext}>
              Start tracking your mental health by checking in daily.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.controls}>
              <View style={styles.factorButtons}>
                {(Object.keys(factorLabels) as Array<keyof MentalFactors>).map(
                  factor => (
                    <TouchableOpacity
                      key={factor}
                      style={[
                        styles.factorButton,
                        selectedFactor === factor && styles.factorButtonActive,
                        {
                          borderColor: factorColors[factor],
                          backgroundColor:
                            selectedFactor === factor
                              ? factorColors[factor]
                              : 'white',
                        },
                      ]}
                      onPress={() => setSelectedFactor(factor)}>
                      <Text
                        style={[
                          styles.factorButtonText,
                          selectedFactor === factor &&
                            styles.factorButtonTextActive,
                        ]}>
                        {factorLabels[factor]}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>

              <View style={styles.timeRangeButtons}>
                <TouchableOpacity
                  style={[
                    styles.timeButton,
                    timeRange === 7 && styles.timeButtonActive,
                  ]}
                  onPress={() => setTimeRange(7)}>
                  <Text
                    style={[
                      styles.timeButtonText,
                      timeRange === 7 && styles.timeButtonTextActive,
                    ]}>
                    7 Days
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.timeButton,
                    timeRange === 30 && styles.timeButtonActive,
                  ]}
                  onPress={() => setTimeRange(30)}>
                  <Text
                    style={[
                      styles.timeButtonText,
                      timeRange === 30 && styles.timeButtonTextActive,
                    ]}>
                    30 Days
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.chartContainer}>
              <LineChart
                data={getChartData()}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 1,
                  color: (opacity = 1) =>
                    `${factorColors[selectedFactor]}${Math.round(
                      opacity * 255
                    ).toString(16)}`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '4',
                    strokeWidth: '2',
                    stroke: factorColors[selectedFactor],
                  },
                }}
                bezier
                style={styles.chart}
              />
            </View>

            <View style={styles.entriesList}>
              <Text style={styles.entriesTitle}>Recent Entries</Text>
              {entries.slice(0, 10).map(entry => {
                const date = new Date(entry.date);
                return (
                  <View key={entry.id} style={styles.entryCard}>
                    <Text style={styles.entryDate}>
                      {date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                    <View style={styles.entryFactors}>
                      <View style={styles.entryFactor}>
                        <Text style={styles.entryFactorLabel}>Stress</Text>
                        <Text
                          style={[
                            styles.entryFactorValue,
                            {color: factorColors.stress},
                          ]}>
                          {entry.factors.stress.toFixed(1)}
                        </Text>
                      </View>
                      <View style={styles.entryFactor}>
                        <Text style={styles.entryFactorLabel}>Darkness</Text>
                        <Text
                          style={[
                            styles.entryFactorValue,
                            {color: factorColors.mentalDarkness},
                          ]}>
                          {entry.factors.mentalDarkness.toFixed(1)}
                        </Text>
                      </View>
                      <View style={styles.entryFactor}>
                        <Text style={styles.entryFactorLabel}>Social</Text>
                        <Text
                          style={[
                            styles.entryFactorValue,
                            {color: factorColors.sociality},
                          ]}>
                          {entry.factors.sociality.toFixed(1)}
                        </Text>
                      </View>
                      <View style={styles.entryFactor}>
                        <Text style={styles.entryFactorLabel}>Affection</Text>
                        <Text
                          style={[
                            styles.entryFactorValue,
                            {color: factorColors.affection},
                          ]}>
                          {entry.factors.affection.toFixed(1)}
                        </Text>
                      </View>
                    </View>
                    {entry.notes && (
                      <Text style={styles.entryNotes}>{entry.notes}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </>
        )}
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
  },
  controls: {
    marginBottom: 24,
  },
  factorButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  factorButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
  },
  factorButtonActive: {},
  factorButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  factorButtonTextActive: {
    color: 'white',
  },
  timeRangeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  timeButtonActive: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  timeButtonTextActive: {
    color: 'white',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    borderRadius: 16,
  },
  entriesList: {
    marginTop: 8,
  },
  entriesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  entryCard: {
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
  entryDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  entryFactors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  entryFactor: {
    alignItems: 'center',
  },
  entryFactorLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  entryFactorValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  entryNotes: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});
