
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
};

type RawSociety = {
  id_sociedad: number;
  nombre_sociedad: string;
}

type ApiResponse<T> = {
  payload: T;
};

type PaginatedApiResponse<T> = {
    payload: {
        datos: T;
    }
}

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
  
  const data: PaginatedApiResponse<RawSociety[]> = await response.json();
  // The backend response has "nombre_sociedad" but the rest of the app uses "nombre".
  // We map it here for consistency.
  return data.payload.datos.map((society) => ({
    id_sociedad: society.id_sociedad,
    nombre: society.nombre_sociedad,
  }));
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

  const formattedProperties = properties.map(prop => {
    const society = societies.find(s => s.id_sociedad === prop.id_sociedad);
    return {
      ...prop,
      nombre_sociedad: society?.nombre || 'N/A',
    };
  });

  return (
    <DashboardLayout 
      user={user} 
      title="Gestión de Propiedades"
      description="Administra las propiedades del sistema."
    >
      <PropertiesClient data={formattedProperties} societies={societies} />
    </DashboardLayout>
  );
}
