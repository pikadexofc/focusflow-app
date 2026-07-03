import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pikadexofc.focusflow',
  appName: 'FocusFlow',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      iconColor: "#488AFF",
      sound: "focus_alarm.wav",
    },
  },
};

export default config;
