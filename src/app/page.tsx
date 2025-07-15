
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FolderArchive, FileText, Building, Users } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ExpiringLeases } from '@/components/dashboard/expiring-leases';

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

  return (
    <DashboardLayout 
        user={user} 
        title="Dashboard" 
        description={`Bienvenido de nuevo, ${user.nombre}.`}
    >
      <div className="space-y-6">
        {/* Key Metrics Summary */}
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

        {/* Main Content Area */}
        <div className="grid gap-6 lg:grid-cols-2">
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
            
            <ExpiringLeases />
        </div>
      </div>
    </DashboardLayout>
  );
}
