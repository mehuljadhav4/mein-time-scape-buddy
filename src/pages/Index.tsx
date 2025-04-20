import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TimerForm from '@/components/TimerForm';
import TimerList from '@/components/TimerList';
import { createTimer, Timer } from '@/utils/timerUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const { toast } = useToast();

  // Load timers from localStorage on component mount
  useEffect(() => {
    const savedTimers = localStorage.getItem('meintimers');
    if (savedTimers) {
      try {
        const parsedTimers = JSON.parse(savedTimers);
        // Convert string dates back to Date objects
        parsedTimers.forEach((timer: any) => {
          timer.createdAt = new Date(timer.createdAt);
        });
        setTimers(parsedTimers);
      } catch (error) {
        console.error('Failed to parse timers from localStorage:', error);
      }
    }
  }, []);

  // Save timers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('meintimers', JSON.stringify(timers));
  }, [timers]);

  const handleTimerCreate = (label: string, durationInSeconds: number, loop: boolean) => {
    const newTimer = createTimer(label, durationInSeconds, loop);
    setTimers([...timers, newTimer]);
    
    toast({
      title: "Timer created",
      description: `"${label}" timer has been created.`,
    });
  };

  const handleTimerUpdate = (updatedTimer: Timer) => {
    setTimers(timers.map(timer => 
      timer.id === updatedTimer.id ? updatedTimer : timer
    ));
  };

  const handleTimerDelete = (id: string) => {
    const timerToDelete = timers.find(timer => timer.id === id);
    setTimers(timers.filter(timer => timer.id !== id));
    
    if (timerToDelete) {
      toast({
        title: "Timer deleted",
        description: `"${timerToDelete.label}" timer has been deleted.`,
      });
    }
  };

  const handleTimerComplete = (id: string) => {
    const completedTimer = timers.find(timer => timer.id === id);
    
    if (completedTimer) {
      toast({
        title: "Timer completed",
        description: `"${completedTimer.label}" timer has finished.`,
      });
    }
  };

  const getFilteredTimers = () => {
    switch (activeTab) {
      case 'active':
        return timers.filter(timer => !timer.isCompleted);
      case 'completed':
        return timers.filter(timer => timer.isCompleted);
      default:
        return timers;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container py-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold tracking-tight">Your Timers</h2>
            <TimerForm onTimerCreate={handleTimerCreate} />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">All Timers</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              <TimerList 
                timers={getFilteredTimers()} 
                onUpdate={handleTimerUpdate} 
                onDelete={handleTimerDelete}
                onComplete={handleTimerComplete}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
