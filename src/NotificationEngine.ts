import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

// Notification icon resource name (maps to res/drawable/ic_notification.png)
const NOTIFICATION_ICON = 'ic_notification';
const NOTIFICATION_CHANNEL = 'focus_channel';
const NOTIFICATION_SOUND = 'focus_alarm';

export const NotificationEngine = {
  async init() {
    if (Capacitor.getPlatform() === 'web') return;
    
    try {
      // Force delete existing channel to pick up updated sound/importance
      await LocalNotifications.deleteChannel({ id: NOTIFICATION_CHANNEL });
      
      // importance 5 = MAX → triggers heads-up (on-screen overlay) display
      // visibility 1 = PUBLIC → shows on lock screen
      await LocalNotifications.createChannel({
        id: NOTIFICATION_CHANNEL,
        name: 'Focus Alerts',
        description: 'Loud persistent alerts for tasks and habits',
        importance: 5,
        visibility: 1,
        sound: NOTIFICATION_SOUND,
        vibration: true,
      });
      console.log('Notification channel created successfully.');
    } catch (e) {
      console.error('Failed to create notification channel:', e);
    }
  },

  async requestPermissions(): Promise<boolean> {
    if (Capacitor.getPlatform() === 'web') return true;

    try {
      const req = await LocalNotifications.requestPermissions();
      return req.display === 'granted';
    } catch (e) {
      console.error('Failed to request notification permissions:', e);
      return false;
    }
  },

  async scheduleTaskNotification(task: any) {
    if (Capacitor.getPlatform() === 'web') return;
    if (!task.deadline || !task.time) return;

    try {
      const [year, month, day] = task.deadline.split('-').map(Number);
      const [hour, minute] = task.time.split(':').map(Number);
      
      const scheduleDate = new Date(year, month - 1, day, hour, minute, 0);
      
      if (scheduleDate.getTime() < Date.now()) return;

      await LocalNotifications.schedule({
        notifications: [
          {
            title: '🎯 Task Due!',
            body: task.title,
            id: task.id,
            schedule: { at: scheduleDate },
            channelId: NOTIFICATION_CHANNEL,
            sound: NOTIFICATION_SOUND,
            smallIcon: NOTIFICATION_ICON,
            largeIcon: NOTIFICATION_ICON,
            ongoing: true,
          }
        ]
      });
    } catch (e) {
      console.error('Failed to schedule task notification:', e);
    }
  },

  async cancelTaskNotification(taskId: number) {
    if (Capacitor.getPlatform() === 'web') return;
    try {
      await LocalNotifications.cancel({ notifications: [{ id: taskId }] });
    } catch (e) {
      console.error('Failed to cancel task notification:', e);
    }
  },

  async scheduleDailyBriefing() {
    if (Capacitor.getPlatform() === 'web') return;
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: '📋 Daily Briefing',
            body: 'Time to review your targets and set your focus for the day.',
            id: 999999,
            schedule: {
              on: { hour: 8, minute: 0 }
            },
            channelId: NOTIFICATION_CHANNEL,
            sound: NOTIFICATION_SOUND,
            smallIcon: NOTIFICATION_ICON,
            largeIcon: NOTIFICATION_ICON,
            ongoing: true,
          }
        ]
      });
    } catch (e) {
      console.error('Failed to schedule daily briefing:', e);
    }
  }
};
