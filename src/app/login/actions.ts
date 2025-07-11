
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const formSchema = z.object({
  email_usuario: z.string().email(),
  contrasena: z.string().min(1),
});

type UserData = {
  id_usuario: number;
  nombre: string;
  email: string;
  rol_usuario_id: number;
  token: string;
};

type RoleData = {
  nombre_rol: string;
};

type ApiResponse<T> = {
  payload: T;
  message?: string | string[];
  statusCode?: number;
};


export async function login(
  prevState: { error: string } | undefined,
  formData: FormData
) {
  const validatedFields = formSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return { error: 'Datos inválidos. Por favor, revisa los campos.' };
  }

  const { email_usuario, contrasena } = validatedFields.data;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    const loginResponse = await fetch(
      `${API_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_usuario, contrasena }),
      }
    );

    const loginData: ApiResponse<UserData | UserData[]> = await loginResponse.json();

    if (!loginResponse.ok) {
      const errorMessage = Array.isArray(loginData.message) ? loginData.message.join(', ') : loginData.message;
      return { error: errorMessage || 'Credenciales incorrectas o error del servidor.' };
    }

    const userData = Array.isArray(loginData.payload) ? loginData.payload[0] : loginData.payload;

    if (!userData) {
      return { error: 'No se recibieron datos de usuario válidos.' };
    }

    // Fetch role information
    const roleResponse = await fetch(`${API_URL}/rol-usuario/getRolUsuario/${userData.rol_usuario_id}`, {
      method: 'GET',
       headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    });

    if (!roleResponse.ok) {
      return {
        error: 'No se pudo obtener la información del rol del usuario.',
      };
    }

    const roleApiResponse: ApiResponse<RoleData[] | RoleData> = await roleResponse.json();
    
    let roleData: RoleData;

    if (Array.isArray(roleApiResponse.payload)) {
      if(roleApiResponse.payload.length === 0) {
        return { error: 'El usuario no tiene un rol asignado.' };
      }
      // The backend response for roles has "nombre" but the rest of the app uses "nombre_rol".
      // We map it here for consistency.
      const rawRole = roleApiResponse.payload[0] as any;
      roleData = { nombre_rol: rawRole.nombre || rawRole.nombre_rol };
    } else {
      const rawRole = roleApiResponse.payload as any;
      roleData = { nombre_rol: rawRole.nombre || rawRole.nombre_rol };
    }


    cookies().set('auth_token', userData.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',
    });

    const sessionData = {
      nombre: userData.nombre,
      email: userData.email,
      rol_usuario_id: userData.rol_usuario_id,
      nombre_rol: roleData.nombre_rol,
      id_usuario: userData.id_usuario
    };

    cookies().set('session', JSON.stringify(sessionData), {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',
    });

  } catch (error) {
    console.error(error);
    return { error: 'No se pudo conectar con el servidor. Inténtalo más tarde.' };
  }

  redirect('/');
}
