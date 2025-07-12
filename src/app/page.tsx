
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderArchive, FileText, Building, Users } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';

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
    // This should be handled by middleware, but serves as a robust fallback.
    redirect('/login');
  }

  const user: Session = JSON.parse(sessionCookie);

  const quickAccessLinks = [
    { href: '/documents', icon: FolderArchive, label: 'Gestión de Documentos' },
    { href: '/leases', icon: FileText, label: 'Gestión de Arriendos' },
    { href: '/properties', icon: Building, label: 'Gestión de Propiedades' },
    { href: '/users', icon: Users, label: 'Gestión de Usuarios' },
  ];

  return (
    <DashboardLayout 
        user={user} 
        title="Dashboard" 
        description={`Bienvenido de nuevo, ${user.nombre}.`}
    >
      <div className="space-y-8">
        <div>
            <h2 className="text-xl font-semibold tracking-tight mb-4">Accesos Rápidos</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickAccessLinks.map((link) => (
                <Link key={link.href} href={link.href} className="group">
                    <Card className="h-full transition-all duration-200 group-hover:border-primary group-hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {link.label}
                            </CardTitle>
                            <link.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                        </CardHeader>
                        <CardContent>
                            <Button variant="link" size="sm" className="p-0 h-auto text-primary">
                                Ir ahora
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
            ))}
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
