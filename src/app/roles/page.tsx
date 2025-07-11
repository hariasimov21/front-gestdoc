
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { RolesClient } from '@/components/roles/roles-client';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

type Session = {
  nombre: string;
  email: string;
  rol_usuario_id: number;
  nombre_rol: string;
};

type Role = {
  id_rol_usuario: number;
  nombre_rol: string;
  descripcion: string;
};

type ApiResponse = {
  payload: any[];
};

async function getRoles(token: string): Promise<Role[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_URL}/rol-usuario/listarRolUsuarios`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to fetch roles');
    return [];
  }
  
  const data: ApiResponse = await response.json();
  // The backend response for roles has "nombre" but the rest of the app uses "nombre_rol".
  // We map it here for consistency.
  return data.payload.map((role: any) => ({
    id_rol_usuario: role.id_rol_usuario,
    nombre_rol: role.nombre || role.nombre_rol,
    descripcion: role.descripcion,
  }));
}

export default async function RolesPage() {
  const sessionCookie = cookies().get('session')?.value;
  const token = cookies().get('auth_token')?.value;

  if (!sessionCookie || !token) {
    redirect('/login');
  }

  const user: Session = JSON.parse(sessionCookie);
  const roles = await getRoles(token);

  return (
    <DashboardLayout user={user}>
      <div className="container mx-auto">
        <RolesClient data={roles} />
      </div>
    </DashboardLayout>
  );
}
