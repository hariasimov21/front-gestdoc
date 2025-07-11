import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { RolesClient } from '@/components/roles/roles-client';
import { DashboardHeader } from '@/components/dashboard/header';

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

  if (user.rol_usuario_id !== 1) {
    // If not an admin, redirect to the dashboard.
    redirect('/');
  }

  const roles = await getRoles(token);

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader userName={user.nombre} userRole={user.nombre_rol} userEmail={user.email} />
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto">
          <RolesClient data={roles} />
        </div>
      </main>
    </div>
  );
}
