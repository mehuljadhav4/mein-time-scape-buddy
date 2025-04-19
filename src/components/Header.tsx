
import React from 'react';
import { ModeToggle } from './ThemeToggle';
import { Bell } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">Meintimer</h1>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
