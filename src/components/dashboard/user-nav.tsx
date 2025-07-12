
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
import { LogOut, User, Bell } from 'lucide-react';
import Link from 'next/link';

interface UserNavProps {
    userName: string;
    userEmail: string;
}

export function UserNav({ userName, userEmail }: UserNavProps) {
    const getInitials = (name: string) => {
        if (!name) return '';
        return name.charAt(0).toUpperCase();
    }

  return (
    <div className="flex items-center gap-2">
       <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
            <Bell className="h-5 w-5 text-muted-foreground" />
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
            <Link href="/profile">
                <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
                </DropdownMenuItem>
            </Link>
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
