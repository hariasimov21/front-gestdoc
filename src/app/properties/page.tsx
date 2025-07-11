
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PropertiesClient } from '@/components/properties/properties-client';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

type Session = {
  nombre: string;
  email: string;
  rol_usuario_id: number;
  nombre_rol: string;
  id_usuario: number;
};

type Property = {
  id_propiedad: number;
  direccion: string;
  descripcion: string;
  longitud: string;
  latitud: string;
  id_sociedad: number;
};

type Society = {
    id_sociedad: number;
    nombre: string;
    // Add other society fields as needed
};

type ApiResponse<T> = {
  payload: T;
};

async function getProperties(token: string): Promise<Property[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_URL}/propiedad/listarPropiedades`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to fetch properties');
    return [];
  }
  
  const data: ApiResponse<Property[]> = await response.json();
  return data.payload;
}

async function getSocieties(token: string): Promise<Society[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  // NOTE: Assuming this endpoint exists for societies.
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
  
  const data: ApiResponse<Society[]> = await response.json();
  return data.payload;
}


export default async function PropertiesPage() {
  const sessionCookie = cookies().get('session')?.value;
  const token = cookies().get('auth_token')?.value;

  if (!sessionCookie || !token) {
    redirect('/login');
  }

  const user: Session = JSON.parse(sessionCookie);
  const properties = await getProperties(token);
  const societies = await getSocieties(token);

  return (
    <DashboardLayout user={user}>
      <PropertiesClient data={properties} societies={societies} />
    </DashboardLayout>
  );
}
