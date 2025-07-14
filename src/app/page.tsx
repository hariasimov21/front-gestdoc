
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FolderArchive, FileText, Building, Users, Clock, Plus, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Session = {
  nombre: string;
  email: string;
  rol_usuario_id: number;
  nombre_rol: string;
  id_usuario: number;
};

export default function DashboardPage() {
  const sessionCookie = cookies().get('session')?.value;
  
  if (!sessionCookie) {
    redirect('/login');
  }

  const user: Session = JSON.parse(sessionCookie);

  const quickAccessLinks = [
    { href: '/documents', icon: FolderArchive, label: 'Documentos' },
    { href: '/leases', icon: FileText, label: 'Arriendos' },
    { href: '/properties', icon: Building, label: 'Propiedades' },
    { href: '/users', icon: Users, label: 'Usuarios' },
  ];

  const recentActivity = [
    {
      action: 'Nuevo Documento',
      details: 'Contrato de Arriendo 2024.pdf',
      time: 'hace 5 minutos',
      user: 'Ana García',
    },
    {
      action: 'Nuevo Arriendo',
      details: 'Propiedad Av. Siempreviva 742',
      time: 'hace 1 hora',
      user: 'Carlos Ruiz',
    },
    {
      action: 'Propiedad Actualizada',
      details: 'Oficina Central',
      time: 'hace 3 horas',
      user: 'Ana García',
    },
     {
      action: 'Nuevo Usuario',
      details: 'roberto@empresa.com',
      time: 'hace 1 día',
      user: 'Admin',
    },
  ];

  return (
    <DashboardLayout 
        user={user} 
        title="Dashboard" 
        description={`Bienvenido de nuevo, ${user.nombre}.`}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Accesos Rápidos</CardTitle>
                    <CardDescription>Navega a las secciones más importantes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickAccessLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="group">
                                <div className="flex flex-col items-center justify-center p-4 border rounded-lg h-full transition-all hover:bg-accent hover:text-accent-foreground">
                                    <link.icon className="h-8 w-8 mb-2 text-muted-foreground transition-colors group-hover:text-primary" />
                                    <span className="text-sm font-medium text-center">{link.label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Resumen del Sistema</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-3">
                     <div className="p-4 border rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground">Propiedades Activas</h3>
                        <p className="text-2xl font-bold">42</p>
                    </div>
                     <div className="p-4 border rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground">Arriendos Vigentes</h3>
                        <p className="text-2xl font-bold">112</p>
                    </div>
                     <div className="p-4 border rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground">Documentos por Vencer</h3>
                        <p className="text-2xl font-bold text-destructive">8</p>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Sidebar-like column on larger screens */}
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <div className="bg-primary/10 text-primary p-2 rounded-full">
                                <Clock className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">{activity.action}</p>
                                <p className="text-sm text-muted-foreground truncate">{activity.details}</p>
                                <p className="text-xs text-muted-foreground">{activity.time} por {activity.user}</p>
                            </div>
                        </div>
                    ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
