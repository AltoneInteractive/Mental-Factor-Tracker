import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {FactorSlider} from '../components/FactorSlider';
import {StorageService} from '../services/storage';
import {MentalFactors, DailyEntry} from '../types';

export const CheckInScreen: React.FC = () => {
  const [factors, setFactors] = useState<MentalFactors>({
    stress: 5,
    mentalDarkness: 5,
    sociality: 5,
    affection: 5,
  });
  const [notes, setNotes] = useState('');
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  useEffect(() => {
    loadTodayEntry();
  }, []);

  const loadTodayEntry = async () => {
    const today = new Date().toISOString().split('T')[0];
    const entry = await StorageService.getEntryByDate(today);

    if (entry) {
      setFactors(entry.factors);
      setNotes(entry.notes || '');
      setHasCheckedInToday(true);
    }
  };

  const handleSave = async () => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    const entry: DailyEntry = {
      id: `${dateStr}-${Date.now()}`,
      date: dateStr,
      timestamp: today.getTime(),
      factors,
      notes: notes.trim() || undefined,
    };

    try {
      await StorageService.saveEntry(entry);
      setHasCheckedInToday(true);
      Alert.alert(
        'Success',
        'Your daily check-in has been saved!',
        [{text: 'OK'}]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to save your check-in. Please try again.',
        [{text: 'OK'}]
      );
    }
  };

  const updateFactor = (key: keyof MentalFactors) => (value: number) => {
    setFactors(prev => ({...prev, [key]: value}));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Daily Check-In</Text>
          <Text style={styles.subtitle}>
            How are you feeling today? Rate each factor from 0-10.
          </Text>

          {hasCheckedInToday && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>✓ Checked in today</Text>
            </View>
          )}

          <View style={styles.factors}>
            <FactorSlider
              label="Stress"
              value={factors.stress}
              onChange={updateFactor('stress')}
              color="#FF6B6B"
              description="How stressed or anxious do you feel?"
            />

            <FactorSlider
              label="Mental Darkness"
              value={factors.mentalDarkness}
              onChange={updateFactor('mentalDarkness')}
              color="#4A5568"
              description="How dark or heavy do your thoughts feel?"
            />

            <FactorSlider
              label="Sociality"
              value={factors.sociality}
              onChange={updateFactor('sociality')}
              color="#4ECDC4"
              description="How connected and social do you feel?"
            />

            <FactorSlider
              label="Affection"
              value={factors.affection}
              onChange={updateFactor('affection')}
              color="#95E1D3"
              description="How much love and care do you feel?"
            />
          </View>

          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes (optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Any thoughts or observations about today?"
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {hasCheckedInToday ? 'Update Check-In' : 'Save Check-In'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  scrollView: {
    flex: 1,
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
  badge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  badgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  factors: {
    marginBottom: 24,
  },
  notesSection: {
    marginBottom: 24,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 100,
  },
  saveButton: {
    backgroundColor: '#6C63FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
