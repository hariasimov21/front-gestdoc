
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
  tokenExp?: number;
};

// This type represents the raw user data from the API
type RawUser = {
  id_usuario: number;
  nombre: string;
  email: string;
  rol_usuario_id: number; // The API sends the ID, not the object
  rol_usuario: null; // The API sends null for the relation
};


// This is the type the frontend components expect
export type User = {
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

async function getUsers(token: string): Promise<RawUser[]> {
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
  const data: PaginatedApiResponse<RawUser[]> = await response.json();
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
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  const token = cookieStore.get('auth_token')?.value;

  if (!sessionCookie || !token) {
    redirect('/login');
  }

  const user: Session = JSON.parse(sessionCookie);
  const [rawUsers, roles] = await Promise.all([getUsers(token), getRoles(token)]);

  // Enrich user data with role object
  const users: User[] = rawUsers.map(rawUser => {
    const role = roles.find(r => r.id_rol_usuario === rawUser.rol_usuario_id);
    return {
      ...rawUser,
      rol_usuario: role 
        ? { id_rol_usuario: role.id_rol_usuario, nombre_rol: role.nombre_rol }
        : { id_rol_usuario: 0, nombre_rol: 'N/A' }, // Fallback for safety
    };
  });

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
