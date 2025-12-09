import AsyncStorage from '@react-native-async-storage/async-storage';
import {DailyEntry, NotificationSettings} from '../types';

const ENTRIES_KEY = '@mental_tracker_entries';
const NOTIFICATION_SETTINGS_KEY = '@mental_tracker_notifications';

export class StorageService {
  static async saveEntry(entry: DailyEntry): Promise<void> {
    try {
      const existingEntries = await this.getAllEntries();
      const filteredEntries = existingEntries.filter(e => e.date !== entry.date);
      const updatedEntries = [...filteredEntries, entry].sort(
        (a, b) => b.timestamp - a.timestamp
      );
      await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(updatedEntries));
    } catch (error) {
      console.error('Error saving entry:', error);
      throw error;
    }
  }

  static async getAllEntries(): Promise<DailyEntry[]> {
    try {
      const data = await AsyncStorage.getItem(ENTRIES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting entries:', error);
      return [];
    }
  }

  static async getEntryByDate(date: string): Promise<DailyEntry | null> {
    try {
      const entries = await this.getAllEntries();
      return entries.find(e => e.date === date) || null;
    } catch (error) {
      console.error('Error getting entry by date:', error);
      return null;
    }
  }

  static async deleteEntry(id: string): Promise<void> {
    try {
      const entries = await this.getAllEntries();
      const filtered = entries.filter(e => e.id !== id);
      await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  }

  static async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const data = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      return data
        ? JSON.parse(data)
        : {enabled: true, time: '20:00'};
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return {enabled: true, time: '20:00'};
    }
  }

  static async saveNotificationSettings(
    settings: NotificationSettings
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        NOTIFICATION_SETTINGS_KEY,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error('Error saving notification settings:', error);
      throw error;
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([ENTRIES_KEY, NOTIFICATION_SETTINGS_KEY]);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}
