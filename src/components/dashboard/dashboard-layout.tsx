
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { DashboardHeader } from './header';
import { Building, Home, KeyRound, Users, Briefcase, FileText, FileCog, FolderArchive, Clock, User, ChevronDown } from 'lucide-react';
import { Breadcrumb } from '../ui/breadcrumb';
import packageJson from '../../../package.json';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { SessionExpirationManager } from './session-expiration-manager';
import { Avatar, AvatarFallback } from '../ui/avatar';


type Session = {
  nombre: string;
  email: string;
  rol_usuario_id: number;
  nombre_rol: string;
  tokenExp?: number;
};

interface DashboardLayoutProps {
  user: Session;
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function DashboardLayout({ user, children, title, description }: DashboardLayoutProps) {
  const pathname = usePathname();
  const appVersion = packageJson.version;

  const sessionExpiresAt = user.tokenExp
      ? `Expira ${formatDistanceToNow(new Date(user.tokenExp), { addSuffix: true, locale: es })}`
      : 'No se pudo determinar la expiración';
  
  const getInitials = (name: string) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase();
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:justify-center">
               <Avatar className="h-8 w-8">
                  <AvatarFallback>{getInitials(user.nombre)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="font-semibold text-sm">{user.nombre}</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
                <div className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider group-data-[collapsible=icon]:hidden">
                    Menu
                </div>
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === '/'} tooltip="Dashboard">
                    <Link href="/"><Home /> <span>Dashboard</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>

            <SidebarSeparator className="my-2" />
            
            <SidebarMenu>
                <div className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider group-data-[collapsible=icon]:hidden">
                    Gestión
                </div>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/documents')} tooltip="Documentos">
                    <Link href="/documents"><FolderArchive /> <span>Documentos</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/leases')} tooltip="Arriendos">
                    <Link href="/leases"><FileText /> <span>Arriendos</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/tenants')} tooltip="Arrendatarios">
                    <Link href="/tenants"><Users /> <span>Arrendatarios</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/properties')} tooltip="Propiedades">
                    <Link href="/properties"><Building /> <span>Propiedades</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/societies')} tooltip="Sociedades">
                    <Link href="/societies"><Briefcase /> <span>Sociedades</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/document-types')} tooltip="Tipos de Documento">
                    <Link href="/document-types"><FileCog /> <span>Tipos de Documento</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
            
            <SidebarSeparator className="my-2" />

             <SidebarMenu>
                <div className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider group-data-[collapsible=icon]:hidden">
                    Administración
                </div>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/roles')} tooltip="Roles">
                    <Link href="/roles"><KeyRound /> <span>Roles</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/users')} tooltip="Usuarios">
                    <Link href="/users"><Users /> <span>Usuarios</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/user-society')} tooltip="Usuario/Sociedad">
                    <Link href="/user-society"><Users /> <span>Usuario/Sociedad</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>

          </SidebarContent>
          <SidebarFooter className="group-data-[collapsible=icon]:hidden">
             <div className="text-center text-xs text-muted-foreground p-2 space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{sessionExpiresAt}</span>
                </div>
                <div>Versión {appVersion}</div>
             </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 flex flex-col peer-data-[collapsible=icon]:md:ml-[3rem]">
           <DashboardHeader userName={user.nombre} userEmail={user.email} sessionExp={user.tokenExp} />
           <div className="flex-1 p-4 md:p-8 pt-6 animate-fade-in-up">
            <div className="mb-6 space-y-1">
                <Breadcrumb className="mb-2" />
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                {description && <p className="text-muted-foreground text-sm">{description}</p>}
            </div>
            {children}
           </div>
           <SessionExpirationManager sessionExp={user.tokenExp} />
        </main>
      </div>
    </SidebarProvider>
  );
}
