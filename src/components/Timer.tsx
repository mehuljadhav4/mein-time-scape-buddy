import React, { useEffect, useRef } from 'react';
import { formatTime, calculateProgress, Timer as TimerType, playNotificationSound } from '@/utils/timerUtils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RefreshCw, X, Repeat } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

interface TimerProps {
  timer: TimerType;
  onUpdate: (updatedTimer: TimerType) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

export const Timer: React.FC<TimerProps> = ({ timer, onUpdate, onDelete, onComplete }) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing interval when component unmounts or timer changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timer.isRunning) {
      // Clear any existing interval before starting a new one
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        const newRemaining = timer.remaining - 1;
        
        if (newRemaining <= 0) {
          if (timer.loop) {
            // If loop is enabled, reset the timer and keep it running
            onUpdate({
              ...timer,
              remaining: timer.duration,
              isRunning: true,
              isCompleted: false,
            });
            playNotificationSound();
            toast({
              title: "Timer Loop",
              description: `"${timer.label}" timer has completed a cycle.`,
            });
          } else {
            // If loop is disabled, complete the timer
            onUpdate({
              ...timer,
              remaining: 0,
              isRunning: false,
              isCompleted: true,
            });
            playNotificationSound();
            toast({
              title: "Timer Complete",
              description: `"${timer.label}" timer has finished.`,
            });
            onComplete(timer.id);
          }
        } else {
          onUpdate({
            ...timer,
            remaining: newRemaining,
          });
        }
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [timer.isRunning, timer.loop, timer.duration, timer.remaining]);

  const toggleTimer = () => {
    if (timer.isCompleted && timer.remaining === 0) {
      // Reset timer if completed
      onUpdate({
        ...timer,
        remaining: timer.duration,
        isRunning: true,
        isCompleted: false,
      });
    } else {
      // Toggle running state
      onUpdate({
        ...timer,
        isRunning: !timer.isRunning,
      });
    }
  };

  const resetTimer = () => {
    onUpdate({
      ...timer,
      remaining: timer.duration,
      isRunning: false,
      isCompleted: false,
    });
  };

  const progress = calculateProgress(timer);

  return (
    <Card className="w-full shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{timer.label}</CardTitle>
          <div className="flex items-center gap-2">
            {timer.loop && (
              <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                <Repeat className="h-3 w-3 mr-1" />
                Loop
              </Badge>
            )}
            {timer.isCompleted ? (
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                Completed
              </Badge>
            ) : timer.isRunning ? (
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                Running
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                Paused
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className={`text-3xl font-mono text-center ${timer.isRunning ? 'animate-pulse-ring' : ''}`}>
            {formatTime(timer.remaining)}
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button
          variant="outline"
          size="icon"
          onClick={resetTimer}
          disabled={timer.remaining === timer.duration && !timer.isRunning}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button 
          onClick={toggleTimer} 
          variant={timer.isRunning ? "secondary" : "default"}
          className={timer.isCompleted ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {timer.isRunning ? (
            <><Pause className="h-4 w-4 mr-2" /> Pause</>
          ) : timer.isCompleted ? (
            <><RefreshCw className="h-4 w-4 mr-2" /> Restart</>
          ) : (
            <><Play className="h-4 w-4 mr-2" /> Start</>
          )}
        </Button>
        <Button variant="outline" size="icon" onClick={() => onDelete(timer.id)}>
          <X className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Timer;
