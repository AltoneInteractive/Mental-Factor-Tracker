import PushNotification, {Importance} from 'react-native-push-notification';
import {Platform} from 'react-native';
import {NotificationSettings} from '../types';
import {StorageService} from './storage';

export class NotificationService {
  private static channelId = 'mental-health-reminders';

  static initialize(): void {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    this.createChannel();
  }

  private static createChannel(): void {
    PushNotification.createChannel(
      {
        channelId: this.channelId,
        channelName: 'Daily Check-in Reminders',
        channelDescription: 'Reminders to check in with your mental health',
        playSound: true,
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      created => console.log(`Channel created: ${created}`)
    );
  }

  static async scheduleDaily(time: string): Promise<void> {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    // Cancel any existing notifications
    PushNotification.cancelAllLocalNotifications();

    PushNotification.localNotificationSchedule({
      channelId: this.channelId,
      title: 'Time for Your Daily Check-in',
      message: 'Have you checked in with yourself recently? Take a moment to reflect.',
      date: scheduledTime,
      allowWhileIdle: true,
      repeatType: 'day',
      playSound: true,
      soundName: 'default',
    });

    console.log(`Daily notification scheduled for ${time}`);
  }

  static cancelAll(): void {
    PushNotification.cancelAllLocalNotifications();
  }

  static async updateFromSettings(): Promise<void> {
    const settings = await StorageService.getNotificationSettings();

    if (settings.enabled) {
      await this.scheduleDaily(settings.time);
    } else {
      this.cancelAll();
    }
  }

  static requestPermissions(): void {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      PushNotification.requestPermissions();
    }
  }
}
