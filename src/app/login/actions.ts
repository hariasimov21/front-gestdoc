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

  try {
    const response = await fetch(
      'https://gestor-documentos-590447208783.us-central1.run.app/api/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
        const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        return { error: errorMessage || 'Credenciales incorrectas o error del servidor.' };
    }

    const userData = data as UserData;

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
