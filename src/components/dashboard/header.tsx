
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserNav } from './user-nav';
import { SidebarTrigger } from '../ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Breadcrumb } from '../ui/breadcrumb';

interface DashboardHeaderProps {
  userName: string;
  userEmail: string;
  title: string;
  description?: string;
}

export function DashboardHeader({ userName, userEmail, title, description }: DashboardHeaderProps) {
  const isMobile = useIsMobile();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur-sm">
      <div className="flex h-16 items-center px-4 md:px-6">
        {isMobile && <SidebarTrigger />}
        
        <div className='flex-1'>
            <Breadcrumb />
        </div>

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
       <div className="px-4 md:px-6 pb-4 border-b">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
        </div>
    </header>
  );
}
