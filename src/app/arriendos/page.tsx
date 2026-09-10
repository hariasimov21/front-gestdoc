import { fetchAllPages } from '@/lib/fetch-all-pages';

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
  tokenExp?: number;
};

type Tenant = {
  id_arrendatario: number;
  nombre: string;
};

type Local = {
  id_local: number;
  nombre_local: string;
  id_propiedad: number;
};

type Property = {
  id_propiedad: number;
  direccion: string;
};

type LeaseFromApi = {
    id_arriendo: number;
    id_local?: number | null;
    nombre_arrendatario: string;
    nombre_local?: string | null;
    direccion_propiedad: string;
    fecha_inicio_arriendo: string;
    fecha_fin_arriendo: string;
    activo: boolean;
};

async function getLeases(token: string): Promise<LeaseFromApi[]> {
  return fetchAllPages(`${process.env.NEXT_PUBLIC_API_URL}/arriendo/getArriendos?estado=todos`, token);
}

async function getTenants(token: string): Promise<Tenant[]> {
  return fetchAllPages(`${process.env.NEXT_PUBLIC_API_URL}/arrendatario/listarArrendatarios`, token);
}

async function getLocals(token: string): Promise<Local[]> {
  return fetchAllPages(`${process.env.NEXT_PUBLIC_API_URL}/locales/listarlocales`, token);
}

async function getProperties(token: string): Promise<Property[]> {
  return fetchAllPages(`${process.env.NEXT_PUBLIC_API_URL}/propiedad/listarPropiedades`, token);
}

export default async function LeasesPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  const token = cookieStore.get('auth_token')?.value;

  if (!sessionCookie || !token) {
    redirect('/ingresar');
  }

  const user: Session = JSON.parse(sessionCookie);
  const [leases, tenants, locals, properties] = await Promise.all([
      getLeases(token),
      getTenants(token), // Still needed for the form
      getLocals(token), // Still needed for the form
      getProperties(token),
  ]);

  const formattedLeases = leases.map(item => {
    return {
      ...item,
      id_local: item.id_local ?? null,
      nombre_local: item.nombre_local || 'N/A',
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
      <LeasesClient data={formattedLeases} tenants={tenants} locals={locals} properties={properties} />
    </DashboardLayout>
  );
}
