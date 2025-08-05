
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { UsersClient } from '@/components/users/users-client';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

type Session = {
  nombre: string;
  email: string;
  rol_usuario_id: number;
  nombre_rol: string;
  id_usuario: number;
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

type PaginatedApiResponse<T> = {
    payload: {
        datos: T;
    }
}

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
  const data: PaginatedApiResponse<User[]> = await response.json();
  return data.payload.datos || [];
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
  const data: PaginatedApiResponse<any[]> = await response.json();
  // The backend response for roles has "nombre" but the rest of the app uses "nombre_rol".
  // We map it here for consistency.
  const roles = data.payload.datos || [];
  return roles.map((role) => ({
    id_rol_usuario: role.id_rol_usuario,
    nombre_rol: role.nombre || role.nombre_rol,
    descripcion: role.descripcion,
  }));
}

export default async function UsersPage() {
  const sessionCookie = cookies().get('session')?.value;
  const token = cookies().get('auth_token')?.value;

  if (!sessionCookie || !token) {
    redirect('/login');
  }

  const user: Session = JSON.parse(sessionCookie);
  const users = await getUsers(token);
  const roles = await getRoles(token);

  return (
    <DashboardLayout 
      user={user}
      title="Gestión de Usuarios"
      description="Administra los usuarios del sistema."
    >
      <UsersClient data={users} roles={roles} />
    </DashboardLayout>
  );
}
