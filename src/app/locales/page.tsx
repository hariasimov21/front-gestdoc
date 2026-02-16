
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LocalsClient } from '@/components/locals/locals-client';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

type Session = {
  nombre: string;
  email: string;
  rol_usuario_id: number;
  nombre_rol: string;
  id_usuario: number;
  tokenExp?: number;
};

type Local = {
  id_local: number;
  nombre_local: string;
  descripcion: string;
  tipo_local: number;
  id_propiedad: number;
  nro_cliente_saesa: string;
  nro_cliente_suralis: string;
};

type Property = {
  id_propiedad: number;
  direccion: string;
  descripcion: string;
  longitud: string;
  latitud: string;
  id_sociedad: number;
  rol_propiedad: string;
};

type PaginatedApiResponse<T> = {
  payload: {
    datos: T;
  };
};

async function getLocals(token: string): Promise<Local[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_URL}/local/listarLocales`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to fetch locals');
    return [];
  }

  const data: PaginatedApiResponse<Local[]> = await response.json();
  return data.payload.datos || [];
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

  const data: PaginatedApiResponse<Property[]> = await response.json();
  return data.payload.datos || [];
}

export default async function LocalsPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  const token = cookieStore.get('auth_token')?.value;

  if (!sessionCookie || !token) {
    redirect('/ingresar');
  }

  const user: Session = JSON.parse(sessionCookie);
  const [locals, properties] = await Promise.all([getLocals(token), getProperties(token)]);

  return (
    <DashboardLayout
      user={user}
      title="Gestión de Locales"
      description="Administra los locales del sistema."
    >
      <LocalsClient data={locals} properties={properties} />
    </DashboardLayout>
  );
}
