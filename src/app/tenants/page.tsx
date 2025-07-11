
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { TenantsClient } from '@/components/tenants/tenants-client';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

type Session = {
  nombre: string;
  email: string;
  rol_usuario_id: number;
  nombre_rol: string;
  id_usuario: number;
};

type Tenant = {
  id_arrendatario: number;
  nombre: string;
  fecha_registro: string;
  email: string;
  rubro: string;
  rut_arrendatario: string;
};

type ApiResponse = {
  payload: any[];
};

async function getTenants(token: string): Promise<Tenant[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_URL}/arrendatario/listarArrendatarios`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to fetch tenants');
    return [];
  }
  
  const data: ApiResponse = await response.json();
  return data.payload;
}

export default async function TenantsPage() {
  const sessionCookie = cookies().get('session')?.value;
  const token = cookies().get('auth_token')?.value;

  if (!sessionCookie || !token) {
    redirect('/login');
  }

  const user: Session = JSON.parse(sessionCookie);
  const tenants = await getTenants(token);

  return (
    <DashboardLayout user={user}>
      <TenantsClient data={tenants} />
    </DashboardLayout>
  );
}
