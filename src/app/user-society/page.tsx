
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserSocietyClient } from '@/components/user-society/user-society-client';
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
};

type Society = {
  id_sociedad: number;
  nombre: string;
};

type RawSociety = {
  id_sociedad: number;
  nombre_sociedad: string;
}

type ApiResponse<T> = {
  payload: {
    datos: T;
  };
};

// We only need users with rol "Usuario" for association
async function getUsers(token: string): Promise<User[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${API_URL}/usuario/listarUsuarios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch users:', await response.text());
      return [];
    }
    const data: ApiResponse<any[]> = await response.json();
    
    // The backend now returns relations. We must filter safely.
    const users = data.payload?.datos || [];
    return users
        .filter(user => user.rol_usuario && user.rol_usuario.nombre_rol === 'Usuario')
        .map(user => ({ id_usuario: user.id_usuario, nombre: user.nombre }));

  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

async function getSocieties(token: string): Promise<Society[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${API_URL}/sociedad/listarSociedades`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch societies:', await response.text());
      return [];
    }
    
    const data: { payload: { datos: RawSociety[] } } = await response.json();
    const societies = data.payload?.datos || [];
    return societies.map((society) => ({
      id_sociedad: society.id_sociedad,
      nombre: society.nombre_sociedad,
    }));
  } catch (error) {
    console.error('Error fetching societies:', error);
    return [];
  }
}


export default async function UserSocietyPage() {
  const sessionCookie = cookies().get('session')?.value;
  const token = cookies().get('auth_token')?.value;

  if (!sessionCookie || !token) {
    redirect('/login');
  }

  const user: Session = JSON.parse(sessionCookie);
  const users = await getUsers(token);
  const societies = await getSocieties(token);

  return (
    <DashboardLayout 
      user={user}
      title="Gestión de Usuario/Sociedad"
      description="Asocia usuarios a sociedades y visualiza las relaciones existentes."
    >
      <UserSocietyClient users={users} societies={societies} />
    </DashboardLayout>
  );
}
