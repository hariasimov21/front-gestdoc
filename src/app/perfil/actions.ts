
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const profileSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido.'),
  email: z.string().email('El correo no es válido.'),
  contrasena: z.string().optional(),
  confirmar_contrasena: z.string().optional(),
}).refine(data => data.contrasena === data.confirmar_contrasena, {
  message: "Las contraseñas no coinciden",
  path: ["confirmar_contrasena"],
});

async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) {
    throw new Error('No authentication token found.');
  }
  return token;
}

export async function updateProfile(id: number, prevState: { error?: string, success?: boolean }, formData: FormData) {
  const validatedFields = profileSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors.map(e => e.message).join(', ') };
  }
  
  const { nombre, email, contrasena } = validatedFields.data;

  const putData: { nombre: string, email: string, contrasena?: string } = {
    nombre,
    email,
  };

  if (contrasena) {
    putData.contrasena = contrasena;
  }

  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/usuario/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(putData),
    });

    if (!response.ok) {
      const data = await response.json();
      const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
      return { error: errorMessage || 'Error al actualizar el perfil.' };
    }

    // After successful update, we need to update the session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (sessionCookie) {
        const sessionData = JSON.parse(sessionCookie);
        sessionData.nombre = nombre;
        sessionData.email = email;
        cookieStore.set('session', JSON.stringify(sessionData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
            sameSite: 'lax',
        });
    }

    revalidatePath('/perfil');
    revalidatePath('/'); // Revalidate layout to update user name in header/sidebar
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'No se pudo conectar con el servidor.' };
  }
}
