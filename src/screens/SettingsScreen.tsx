import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {StorageService} from '../services/storage';
import {NotificationService} from '../services/notifications';
import {NotificationSettings} from '../types';

export const SettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    time: '20:00',
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

  useEffect(() => {
    loadSettings();
    NotificationService.initialize();
  }, []);

  const loadSettings = async () => {
    const savedSettings = await StorageService.getNotificationSettings();
    setSettings(savedSettings);

    const [hours, minutes] = savedSettings.time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    setSelectedTime(date);
  };

  const toggleNotifications = async (value: boolean) => {
    const newSettings = {...settings, enabled: value};
    setSettings(newSettings);

    try {
      await StorageService.saveNotificationSettings(newSettings);
      await NotificationService.updateFromSettings();

      if (value) {
        NotificationService.requestPermissions();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update notification settings');
    }
  };

  const handleTimeChange = (date: Date) => {
    setSelectedTime(date);
  };

  const confirmTimeChange = async () => {
    const hours = selectedTime.getHours().toString().padStart(2, '0');
    const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    const newSettings = {...settings, time: timeString};
    setSettings(newSettings);
    setShowTimePicker(false);

    try {
      await StorageService.saveNotificationSettings(newSettings);
      await NotificationService.updateFromSettings();
      Alert.alert('Success', `Daily reminder set for ${timeString}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update notification time');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all your check-in data? This cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.clearAllData();
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Daily Reminders</Text>
              <Text style={styles.settingDescription}>
                Get reminded to check in with yourself
              </Text>
            </View>
            <Switch
              value={settings.enabled}
              onValueChange={toggleNotifications}
              trackColor={{false: '#D1D5DB', true: '#6C63FF'}}
              thumbColor={settings.enabled ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>

          {settings.enabled && (
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => setShowTimePicker(true)}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Reminder Time</Text>
                <Text style={styles.settingDescription}>
                  When to send daily reminders
                </Text>
              </View>
              <Text style={styles.timeValue}>{settings.time}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearData}>
            <Text style={styles.dangerButtonText}>Clear All Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Mental Health Tracker helps you monitor your emotional well-being
              by tracking four key factors: stress, mental darkness, sociality,
              and affection.
            </Text>
            <Text style={styles.infoText}>
              Regular check-ins help you notice patterns, understand triggers,
              and recognize when you might need extra support.
            </Text>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </View>
      </View>

      <DatePicker
        modal
        open={showTimePicker}
        date={selectedTime}
        mode="time"
        onConfirm={confirmTimeChange}
        onCancel={() => setShowTimePicker(false)}
      />
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
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingRow: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#999',
  },
  timeValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6C63FF',
  },
  dangerButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
