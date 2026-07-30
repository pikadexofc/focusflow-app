import { useEffect, useRef } from 'react';

export function useWebAlarms(tasks: any[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/focus_alarm.wav');
      audioRef.current.loop = true;
    }
    const audio = audioRef.current;

    const interval = setInterval(() => {
      if (!tasks || tasks.length === 0) return;

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const currentDay = now.getDate();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      let shouldAlarm = false;

      for (const task of tasks) {
        if (task.status === 'completed') continue;
        if (!task.deadline || !task.time) continue;

        const [tYear, tMonth, tDay] = task.deadline.split('-').map(Number);
        const [tHour, tMinute] = task.time.split(':').map(Number);

        // Check if the task deadline is exactly now
        if (
          tYear === currentYear &&
          tMonth === currentMonth &&
          tDay === currentDay &&
          tHour === currentHour &&
          tMinute === currentMinute
        ) {
          // Check if already acknowledged in this session
          const alarmedTasks = JSON.parse(localStorage.getItem('alarmedTasks') || '[]');
          if (!alarmedTasks.includes(task.id)) {
            shouldAlarm = true;
            // Mark as alarmed so we don't re-trigger it endlessly
            alarmedTasks.push(task.id);
            localStorage.setItem('alarmedTasks', JSON.stringify(alarmedTasks));
            
            // Dispatch custom event for UI to catch
            window.dispatchEvent(new CustomEvent('alarm-triggered', { detail: task }));
          }
        }
      }

      if (shouldAlarm) {
        audio.play().catch(e => console.error("Web audio play failed:", e));
        
        // Auto-stop after 30 seconds if not dismissed manually
        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
        }, 30000);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [tasks]);

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return { stopAlarm };
}
