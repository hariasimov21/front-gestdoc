
'use client';

import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/app/actions';
import { LogOut, User, Bell, Clock } from 'lucide-react';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface UserNavProps {
    userName: string;
    userEmail: string;
    sessionExp?: number;
}

export function UserNav({ userName, userEmail, sessionExp }: UserNavProps) {
    const getInitials = (name: string) => {
        if (!name) return '';
        return name.charAt(0).toUpperCase();
    }

    const sessionExpiresAt = sessionExp 
      ? `Expira ${formatDistanceToNow(new Date(sessionExp), { addSuffix: true, locale: es })}`
      : 'No se pudo determinar la expiración';

  return (
    <div className="flex items-center gap-4">
       <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-foreground hover:bg-accent hover:text-accent-foreground">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notificaciones</span>
        </Button>
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
                <AvatarFallback>{getInitials(userName)}</AvatarFallback>
            </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                {userEmail}
                </p>
            </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
            <Link href="/perfil">
                <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
                </DropdownMenuItem>
            </Link>
             <DropdownMenuItem disabled>
                <Clock className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                    <span>Sesión</span>
                    <span className="text-xs text-muted-foreground -mt-1">{sessionExpiresAt}</span>
                </div>
            </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <form action={logout} className="w-full">
                <button type="submit" className="w-full text-left">
                    <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                </button>
            </form>
        </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
}
