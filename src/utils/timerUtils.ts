import { v4 as uuidv4 } from 'uuid';

export interface Timer {
  id: string;
  label: string;
  duration: number; // in seconds
  remaining: number; // in seconds
  isRunning: boolean;
  isCompleted: boolean;
  loop: boolean; // new property for continuous looping
  createdAt: Date;
}

export function createTimer(label: string, duration: number, loop: boolean = false): Timer {
  return {
    id: uuidv4(),
    label,
    duration,
    remaining: duration,
    isRunning: false,
    isCompleted: false,
    loop,
    createdAt: new Date(),
  };
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = hours > 0 ? `${hours}:` : '';
  const formattedMinutes = hours > 0 ? `${minutes.toString().padStart(2, '0')}:` : `${minutes}:`;
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  return `${formattedHours}${formattedMinutes}${formattedSeconds}`;
}

export function calculateProgress(timer: Timer): number {
  if (timer.duration === 0) return 0;
  const progress = ((timer.duration - timer.remaining) / timer.duration) * 100;
  return Math.min(Math.max(progress, 0), 100); // Clamp progress between 0 and 100
}

export function playNotificationSound(): void {
  try {
    // Create audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Configure the sound
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // Higher pitch
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Lower volume

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Play the sound
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5); // Play for 0.5 seconds

    // Clean up
    setTimeout(() => {
      oscillator.disconnect();
      gainNode.disconnect();
    }, 1000);
  } catch (error) {
    console.error('Failed to play notification sound:', error);
    // Fallback to audio element
    try {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(console.error);
    } catch (fallbackError) {
      console.error('Failed to play fallback sound:', fallbackError);
    }
  }
}
