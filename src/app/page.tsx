
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

type SummaryData = {
  propiedades_activas: number;
  documentos_activos: number; // This might correspond to active leases, will need clarification if not.
  documentos_por_vencer: number;
};

type ApiResponse<T> = {
  payload: T;
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
    const leases = data.payload?.datos || []; // Safeguard against undefined payload
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
    redirect('/login');
  }

  const user: Session = JSON.parse(sessionCookie);

  const [summaryData, activeLeasesCount] = await Promise.all([
    getSummaryData(token),
    getActiveLeasesCount(token),
  ]);

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
        <Card className="animate-fade-in-up">
            <CardHeader>
                <CardTitle>Resumen del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
                 <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Propiedades Activas</h3>
                    <p className="text-2xl font-bold">{summaryData.propiedades_activas ?? 0}</p>
                </div>
                 <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Arriendos Vigentes</h3>
                    <p className="text-2xl font-bold">{activeLeasesCount}</p>
                </div>
                 <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Documentos por Vencer</h3>
                    <p className="text-2xl font-bold text-destructive">{summaryData.documentos_por_vencer ?? 0}</p>
                </div>
            </CardContent>
        </Card>

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
                                <div className="flex flex-col items-center justify-center p-4 border rounded-lg h-full transition-all hover:bg-accent hover:text-accent-foreground">
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
