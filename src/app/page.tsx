import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

type Session = {
  name: string;
  email: string;
  roleId: number;
};

function getRoleName(roleId: number): string {
  // A simple mapping for user roles as requested.
  switch (roleId) {
    case 1:
      return 'Administrador';
    case 2:
      return 'Usuario';
    default:
      return 'Rol Desconocido';
  }
}

export default function DashboardPage() {
  const sessionCookie = cookies().get('session')?.value;
  
  if (!sessionCookie) {
    // This should be handled by middleware, but serves as a robust fallback.
    redirect('/login');
  }

  const user: Session = JSON.parse(sessionCookie);
  const roleName = getRoleName(user.roleId);

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader userName={user.name} userRole={roleName} userEmail={user.email} />
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Aquí podrás gestionar tus documentos.
          </p>
        
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Documentos Totales
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% desde el mes pasado
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
