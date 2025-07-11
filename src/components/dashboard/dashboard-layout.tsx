
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
} from '@/components/ui/sidebar';
import { DashboardHeader } from './header';
import { Building, Home, KeyRound, Users, Briefcase, FileText, FileCog, FolderArchive } from 'lucide-react';
import { UserNav } from './user-nav';

type Session = {
  nombre: string;
  email: string;
  rol_usuario_id: number;
  nombre_rol: string;
};

interface DashboardLayoutProps {
  user: Session;
  children: React.ReactNode;
}

export function DashboardLayout({ user, children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <Link href="/" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                <span className="font-bold text-lg">GestDoc</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/'} >
                  <Link href="/"><Home /> Dashboard</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/documents')}>
                  <Link href="/documents"><FolderArchive /> Gestión de Documentos</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/leases')}>
                  <Link href="/leases"><FileText /> Gestión de Arriendos</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/tenants')}>
                  <Link href="/tenants"><Users /> Gestión de Arrendatarios</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/properties')}>
                  <Link href="/properties"><Building /> Gestión de Propiedades</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/societies')}>
                  <Link href="/societies"><Briefcase /> Gestión de Sociedades</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/document-types')}>
                  <Link href="/document-types"><FileCog /> Tipos de Documento</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/roles')}>
                  <Link href="/roles"><KeyRound /> Gestión de Roles</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/users')}>
                  <Link href="/users"><Users /> Gestión de Usuarios</Link>
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
             <UserNav userName={user.nombre} userEmail={user.email} />
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 flex flex-col">
           <DashboardHeader userName={user.nombre} userRole={user.nombre_rol} userEmail={user.email} />
           <div className="flex-1 p-4 md:p-8">
             {children}
           </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
