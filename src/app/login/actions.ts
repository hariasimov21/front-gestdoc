'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
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

  const { email, password } = validatedFields.data;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    const loginResponse = await fetch(
      `${API_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_usuario: email, contrasena: password }),
      }
    );

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
        const errorMessage = Array.isArray(loginData.message) ? loginData.message.join(', ') : loginData.message;
        return { error: errorMessage || 'Credenciales incorrectas o error del servidor.' };
    }

    const userData = loginData as UserData;

    // Fetch role information
    const roleResponse = await fetch(`${API_URL}/rol-usuario/getRolUsuario/${userData.rol_usuario_id}`, {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    });

    if (!roleResponse.ok) {
        return { error: 'No se pudo obtener la información del rol del usuario.' };
    }

    const roleData = await roleResponse.json() as RoleData;
    
    cookies().set('auth_token', userData.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',
    });
    
    const sessionData = {
        name: userData.nombre,
        email: userData.email,
        roleId: userData.rol_usuario_id,
        roleName: roleData.nombre_rol,
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
