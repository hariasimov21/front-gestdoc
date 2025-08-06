
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LeasesClient } from '@/components/leases/leases-client';
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
};

type Property = {
  id_propiedad: number;
  direccion: string;
};

type LeaseFromApi = {
    id_arriendo: number;
    nombre_arrendatario: string;
    direccion_propiedad: string;
    fecha_inicio_arriendo: string;
    fecha_fin_arriendo: string;
    activo: boolean;
};

type PaginatedApiResponse<T> = {
  payload: {
    datos: T;
  };
};

type TenantsApiResponse = {
    payload: {
        datos: Tenant[];
    }
}

type LeaseApiResponse = {
    payload: {
        datos: LeaseFromApi[];
    }
}

async function getLeases(token: string): Promise<LeaseFromApi[]> {
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
  
  const data: LeaseApiResponse = await response.json();
  return data.payload.datos || [];
}

// These are still needed for the create/edit modal
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
  
  const data: TenantsApiResponse = await response.json();
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


export default async function LeasesPage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  const token = cookieStore.get('auth_token')?.value;

  if (!sessionCookie || !token) {
    redirect('/login');
  }

  const user: Session = JSON.parse(sessionCookie);
  const [leases, tenants, properties] = await Promise.all([
      getLeases(token),
      getTenants(token), // Still needed for the form
      getProperties(token), // Still needed for the form
  ]);

  const formattedLeases = leases.map(item => {
    return {
      ...item,
      arrendatarioNombre: item.nombre_arrendatario || 'N/A',
      propiedadDireccion: item.direccion_propiedad || 'N/A',
    };
  });

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
