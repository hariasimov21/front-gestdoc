
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
  tokenExp?: number;
};

type SummaryData = {
  propiedades_activas: number;
  documentos_activos: number; 
  documentos_por_vencer: number;
};

type PaginatedLeaseResponse = {
    payload: {
        datos: any[];
    }
}

async function getSummaryData(token: string): Promise<SummaryData> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${API_URL}/dashboard/resumen`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });
    if (!response.ok) {
      console.error('Failed to fetch summary data');
      return { propiedades_activas: 0, documentos_activos: 0, documentos_por_vencer: 0 };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching summary data:', error);
    return { propiedades_activas: 0, documentos_activos: 0, documentos_por_vencer: 0 };
  }
}

async function getActiveLeasesCount(token: string): Promise<number> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${API_URL}/arriendo/getArriendos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });
    if (!response.ok) {
        console.error('Failed to fetch leases');
        return 0;
    }
    const data: PaginatedLeaseResponse = await response.json();
    const leases = data.payload?.datos || []; 
    return leases.filter(lease => lease.activo).length;
  } catch (error) {
    console.error('Error fetching leases:', error);
    return 0;
  }
}

export default async function DashboardPage() {
  const sessionCookie = cookies().get('session')?.value;
  const token = cookies().get('auth_token')?.value;
  
  if (!sessionCookie || !token) {
    redirect('/ingresar');
  }

  const user: Session = JSON.parse(sessionCookie);

  const [summaryData, activeLeasesCount] = await Promise.all([
    getSummaryData(token),
    getActiveLeasesCount(token),
  ]);

  const quickAccessLinks = [
    { href: '/documentos', icon: FolderArchive, label: 'Documentos' },
    { href: '/arriendos', icon: FileText, label: 'Arriendos' },
    { href: '/propiedades', icon: Building, label: 'Propiedades' },
    { href: '/usuarios', icon: Users, label: 'Usuarios' },
  ];

  return (
    <DashboardLayout 
        user={user} 
        title="Dashboard" 
        description={`Bienvenido de nuevo, ${user.nombre}.`}
    >
      <div className="space-y-6">
        {/* Key Metrics Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Propiedades Activas</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summaryData.propiedades_activas ?? 0}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Arriendos Vigentes</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{activeLeasesCount}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Documentos por Vencer</CardTitle>
                    <FolderArchive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">{summaryData.documentos_por_vencer ?? 0}</div>
                </CardContent>
            </Card>
        </div>


        {/* Main Content Area */}
        <div className="grid gap-6 lg:grid-cols-2">
            <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                    <CardTitle>Accesos Rápidos</CardTitle>
                    <CardDescription>Navega a las secciones más importantes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickAccessLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="group">
                                <div className="flex flex-col items-center justify-center p-4 border bg-card hover:bg-accent rounded-lg h-full transition-all">
                                    <link.icon className="h-8 w-8 mb-2 text-muted-foreground transition-colors group-hover:text-primary" />
                                    <span className="text-sm font-medium text-center">{link.label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <ExpiringLeases />
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
