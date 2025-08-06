
'use client';

import { Button } from '@/components/ui/button';
import { UserNav } from './user-nav';
import { SidebarTrigger } from '../ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';


interface DashboardHeaderProps {
  userName: string;
  userEmail: string;
  sessionExp?: number;
}

export function DashboardHeader({ userName, userEmail, sessionExp }: DashboardHeaderProps) {
  const isMobile = useIsMobile();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 backdrop-blur-sm">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      
      <div className="ml-auto flex items-center space-x-2 sm:space-x-4">
        <UserNav userName={userName} userEmail={userEmail} sessionExp={sessionExp} />
      </div>
    </header>
  );
}
