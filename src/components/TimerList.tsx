
import React from 'react';
import { Timer as TimerComponent } from './Timer';
import { Timer as TimerType } from '@/utils/timerUtils';

interface TimerListProps {
  timers: TimerType[];
  onUpdate: (updatedTimer: TimerType) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

const TimerList: React.FC<TimerListProps> = ({ timers, onUpdate, onDelete, onComplete }) => {
  if (timers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center space-y-2">
        <h3 className="text-lg font-medium">No timers yet</h3>
        <p className="text-muted-foreground">Add your first timer to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-in">
      {timers.map((timer) => (
        <TimerComponent
          key={timer.id}
          timer={timer}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onComplete={onComplete}
        />
      ))}
    </div>
  );
};

export default TimerList;
