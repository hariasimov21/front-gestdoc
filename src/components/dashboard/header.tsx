import { Bell, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserNav } from './user-nav';
import Link from 'next/link';

interface DashboardHeaderProps {
  userName: string;
  userRole: string;
  userEmail: string;
}

export function DashboardHeader({ userName, userRole, userEmail }: DashboardHeaderProps) {
  const isAdmin = userRole === 'Administrador';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            <span className="font-bold text-lg hidden sm:inline-block">AuthFlow</span>
          </Link>
        </div>
        
        {isAdmin && (
          <nav className="ml-6 hidden md:flex">
             <Link href="/roles" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                <KeyRound className="mr-2 h-4 w-4" />
                Gestión de Roles
             </Link>
          </nav>
        )}

        <div className="ml-auto flex items-center space-x-2 sm:space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">{userRole}</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notificaciones</span>
          </Button>
          <UserNav userName={userName} userEmail={userEmail} />
        </div>
      </div>
    </header>
  );
}
