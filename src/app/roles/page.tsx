import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { RolesClient } from '@/components/roles/roles-client';
import { DashboardHeader } from '@/components/dashboard/header';

type Session = {
  name: string;
  email: string;
  roleId: number;
};

type Role = {
  id_rol_usuario: number;
  nombre_rol: string;
  descripcion: string;
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
    // throw new Error('Failed to fetch roles');
    console.error('Failed to fetch roles');
    return [];
  }
  return response.json();
}

function getRoleName(roleId: number): string {
  switch (roleId) {
    case 1:
      return 'Administrador';
    case 2:
      return 'Usuario';
    default:
      return 'Rol Desconocido';
  }
}

export default async function RolesPage() {
  const sessionCookie = cookies().get('session')?.value;
  const token = cookies().get('auth_token')?.value;

  if (!sessionCookie || !token) {
    redirect('/login');
  }

  const user: Session = JSON.parse(sessionCookie);
  const roleName = getRoleName(user.roleId);

  if (user.roleId !== 1) {
    // If not an admin, redirect to the dashboard.
    redirect('/');
  }

  const roles = await getRoles(token);

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader userName={user.name} userRole={roleName} userEmail={user.email} />
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto">
          <RolesClient data={roles} />
        </div>
      </main>
    </div>
  );
}
