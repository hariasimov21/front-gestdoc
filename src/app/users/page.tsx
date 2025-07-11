import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { UsersClient } from '@/components/users/users-client';
import { DashboardHeader } from '@/components/dashboard/header';

type Session = {
  name: string;
  email: string;
  roleId: number;
  roleName: string;
};

type User = {
  id_usuario: number;
  nombre: string;
  email: string;
  rol_usuario: {
    id_rol_usuario: number;
    nombre_rol: string;
  };
};

type Role = {
  id_rol_usuario: number;
  nombre_rol: string;
  descripcion: string;
};


async function getUsers(token: string): Promise<User[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_URL}/usuario/listarUsuarios`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to fetch users');
    return [];
  }
  return response.json();
}

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
  return response.json();
}

export default async function UsersPage() {
  const sessionCookie = cookies().get('session')?.value;
  const token = cookies().get('auth_token')?.value;

  if (!sessionCookie || !token) {
    redirect('/login');
  }

  const user: Session = JSON.parse(sessionCookie);

  if (user.roleId !== 1) {
    redirect('/');
  }

  const users = await getUsers(token);
  const roles = await getRoles(token);

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader userName={user.name} userRole={user.roleName} userEmail={user.email} />
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto">
          <UsersClient data={users} roles={roles} />
        </div>
      </main>
    </div>
  );
}
