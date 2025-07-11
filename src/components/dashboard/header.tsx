import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserNav } from './user-nav';
import { SidebarTrigger } from '../ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';


interface DashboardHeaderProps {
  userName: string;
  userRole: string;
  userEmail: string;
}

export function DashboardHeader({ userName, userRole, userEmail }: DashboardHeaderProps) {
  const isMobile = useIsMobile();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center px-4 md:px-6">
        {isMobile && <SidebarTrigger />}
        
        <div className="ml-auto flex items-center space-x-2 sm:space-x-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notificaciones</span>
          </Button>
          <div className="hidden sm:block">
            <UserNav userName={userName} userEmail={userEmail} />
          </div>
        </div>
      </div>
    </header>
  );
}
