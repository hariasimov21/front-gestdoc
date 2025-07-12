
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LeasesClient } from '@/components/leases/leases-client';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { format } from 'date-fns';

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

type Property = {
  id_propiedad: number;
  direccion: string;
  descripcion: string;
  longitud: string;
  latitud: string;
  id_sociedad: number;
};

type Lease = {
    id_arriendo: number;
    fecha_inicio_arriendo: string;
    fecha_fin_arriendo: string;
    activo: boolean;
    arrendatario: Tenant;
    propiedad: Property;
};

type ApiResponse<T> = {
  payload: T;
};

async function getLeases(token: string): Promise<Lease[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_URL}/arriendo/getArriendos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to fetch leases');
    return [];
  }
  
  const data: ApiResponse<Lease[]> = await response.json();
  return data.payload;
}

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
  
  const data: ApiResponse<Tenant[]> = await response.json();
  return data.payload;
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


export default async function LeasesPage() {
  const sessionCookie = cookies().get('session')?.value;
  const token = cookies().get('auth_token')?.value;

  if (!sessionCookie || !token) {
    redirect('/login');
  }

  const user: Session = JSON.parse(sessionCookie);
  const leases = await getLeases(token);
  const tenants = await getTenants(token);
  const properties = await getProperties(token);

  const formattedLeases = leases.map(item => ({
    ...item,
    arrendatarioNombre: item.arrendatario?.nombre,
    propiedadDireccion: item.propiedad?.direccion,
  }));

  return (
    <DashboardLayout 
      user={user}
      title="Gestión de Arriendos"
      description="Administra los arriendos del sistema."
    >
      <LeasesClient data={formattedLeases} tenants={tenants} properties={properties} />
    </DashboardLayout>
  );
}
