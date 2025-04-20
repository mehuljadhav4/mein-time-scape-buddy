import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Clock, Repeat } from 'lucide-react';
import { createTimer } from '@/utils/timerUtils';

interface TimerFormProps {
  onTimerCreate: (label: string, durationInSeconds: number, loop: boolean) => void;
}

const TimerForm: React.FC<TimerFormProps> = ({ onTimerCreate }) => {
  const [label, setLabel] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [loop, setLoop] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hoursValue = parseInt(hours) || 0;
    const minutesValue = parseInt(minutes) || 0;
    const secondsValue = parseInt(seconds) || 0;
    
    const totalSeconds = hoursValue * 3600 + minutesValue * 60 + secondsValue;
    
    if (totalSeconds <= 0) {
      alert('Please set a time greater than 0 seconds');
      return;
    }
    
    if (!label.trim()) {
      alert('Please provide a label for your timer');
      return;
    }
    
    onTimerCreate(label, totalSeconds, loop);
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setLabel('');
    setHours('');
    setMinutes('');
    setSeconds('');
    setLoop(false);
  };

  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-4 w-4" /> Add Timer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Timer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="timerLabel">Timer Label</Label>
            <Input
              id="timerLabel"
              placeholder="e.g., Focus Session, Water Break"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Timer Duration</Label>
            <div className="flex gap-2 items-center">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="grid grid-cols-3 gap-2 w-full">
                <div>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Hours"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="Minutes"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="Seconds"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="loop"
              checked={loop}
              onCheckedChange={(checked) => setLoop(checked as boolean)}
            />
            <Label htmlFor="loop" className="flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              Loop continuously
            </Label>
          </div>
          
          <DialogFooter className="sm:justify-between gap-2">
            <DialogClose asChild>
              <Button variant="outline" type="button" onClick={handleClose}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Create Timer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TimerForm;
