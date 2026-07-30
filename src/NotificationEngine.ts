import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const NotificationEngine = {
  async init() {
    if (Capacitor.getPlatform() === 'web') return;
    
    // Create the FocusChannel for loud notifications
    try {
      // Force delete existing channel to update sound configurations
      await LocalNotifications.deleteChannel({ id: 'focus_channel' });
      
      await LocalNotifications.createChannel({
        id: 'focus_channel',
        name: 'Focus Alerts',
        description: 'Loud alerts for tasks and habits',
        importance: 5,
        visibility: 1,
        sound: 'focus_alarm',
        vibration: true,
      });
      console.log('Notification channel created successfully.');
    } catch (e) {
      console.error('Failed to create notification channel (Likely device specific):', e);
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
      
      // Don't schedule in the past
      if (scheduleDate.getTime() < Date.now()) return;

      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Task Due!',
            body: task.title,
            id: task.id,
            schedule: { at: scheduleDate },
            channelId: 'focus_channel',
            sound: 'focus_alarm',
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
            title: 'Daily Briefing',
            body: 'Time to review your targets and set your focus for the day.',
            id: 999999, // Static ID for daily briefing
            schedule: {
              on: { hour: 8, minute: 0 } // Every day at 8:00 AM
            },
            channelId: 'focus_channel',
            sound: 'focus_alarm',
          }
        ]
      });
    } catch (e) {
      console.error('Failed to schedule daily briefing:', e);
    }
  }
};
