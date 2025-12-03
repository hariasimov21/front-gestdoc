
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SocietiesClient } from '@/components/societies/societies-client';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

type Session = {
  nombre: string;
  email: string;
  rol_usuario_id: number;
  nombre_rol: string;
  id_usuario: number;
  tokenExp?: number;
};

type Society = {
  id_sociedad: number;
  nombre: string;
};

type RawSociety = {
  id_sociedad: number;
  nombre_sociedad: string;
}

type PaginatedApiResponse = {
  payload: {
    datos: RawSociety[]
  };
};

async function getSocieties(token: string): Promise<Society[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_URL}/sociedad/listarSociedades`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to fetch societies');
    return [];
  }
  
  const data: PaginatedApiResponse = await response.json();
  // The backend response has "nombre_sociedad" but the rest of the app uses "nombre".
  // We map it here for consistency.
  return data.payload.datos.map((society: RawSociety) => ({
    id_sociedad: society.id_sociedad,
    nombre: society.nombre_sociedad,
  }));
}

export default async function SocietiesPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  const token = cookieStore.get('auth_token')?.value;

  if (!sessionCookie || !token) {
    redirect('/login');
  }

  const user: Session = JSON.parse(sessionCookie);
  const societies = await getSocieties(token);

  return (
    <DashboardLayout 
      user={user}
      title="Gestión de Sociedades"
      description="Administra las sociedades del sistema."
    >
      <SocietiesClient data={societies} />
    </DashboardLayout>
  );
}
