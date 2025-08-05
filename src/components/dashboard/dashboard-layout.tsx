
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
import { Building, Home, KeyRound, Users, Briefcase, FileText, FileCog, FolderArchive } from 'lucide-react';
import { Breadcrumb } from '../ui/breadcrumb';
import packageJson from '../../../package.json';

type Session = {
  nombre: string;
  email: string;
  rol_usuario_id: number;
  nombre_rol: string;
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <Link href="/" className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                <span className="font-bold text-lg">GestDoc</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === '/'} >
                    <Link href="/"><Home /> Dashboard</Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>

            <SidebarSeparator className="my-2" />
            
            <SidebarMenu>
                <div className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Gestión
                </div>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/documents')}>
                    <Link href="/documents"><FolderArchive /> Documentos</Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/leases')}>
                    <Link href="/leases"><FileText /> Arriendos</Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/tenants')}>
                    <Link href="/tenants"><Users /> Arrendatarios</Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/properties')}>
                    <Link href="/properties"><Building /> Propiedades</Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/societies')}>
                    <Link href="/societies"><Briefcase /> Sociedades</Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/document-types')}>
                    <Link href="/document-types"><FileCog /> Tipos de Documento</Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
            
            <SidebarSeparator className="my-2" />

             <SidebarMenu>
                <div className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Administración
                </div>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/roles')}>
                    <Link href="/roles"><KeyRound /> Roles</Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/users')}>
                    <Link href="/users"><Users /> Usuarios</Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/user-society')}>
                    <Link href="/user-society"><Users /> Usuario/Sociedad</Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>

          </SidebarContent>
          <SidebarFooter>
             <div className="text-center text-xs text-muted-foreground p-2">
                Versión {appVersion}
             </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 flex flex-col">
           <DashboardHeader userName={user.nombre} userEmail={user.email} />
           <div className="flex-1 p-4 md:p-8 pt-6 animate-fade-in-up">
            <div className="mb-4 space-y-2">
                <Breadcrumb />
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
            </div>
            {children}
           </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
