
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${API_BASE_URL}/usuario`;

const createUserSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido.'),
  email: z.string().email('El correo no es válido.'),
  contrasena: z.string().min(1, 'La contraseña es requerida.'),
  rol_usuario_id: z.string().min(1, 'El rol es requerido.'),
});

const updateUserSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido.'),
    email: z.string().email('El correo no es válido.'),
    rol_usuario_id: z.string().min(1, 'El rol es requerido.'),
});

async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) {
    throw new Error('No authentication token found.');
  }
  return token;
}

export async function createUser(prevState: { error: string } | undefined, formData: FormData) {
  const validatedFields = createUserSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: 'Datos inválidos. Por favor, revisa los campos.' };
  }
  
  const postData = {
    ...validatedFields.data,
    rol_usuario_id: parseInt(validatedFields.data.rol_usuario_id, 10),
  };

  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/crearUsuario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const data = await response.json();
      const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
      return { error: errorMessage || 'Error al crear el usuario.' };
    }

    revalidatePath('/users');
    return { error: undefined };
  } catch (error) {
    console.error(error);
    return { error: 'No se pudo conectar con el servidor.' };
  }
}

export async function updateUser(id: number, prevState: { error: string } | undefined, formData: FormData) {
    const validatedFields = updateUserSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { error: 'Datos inválidos. Por favor, revisa los campos.' };
    }

    const putData = {
      ...validatedFields.data,
      rol_usuario_id: parseInt(validatedFields.data.rol_usuario_id, 10),
    };

    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/${id}`, {
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
            return { error: errorMessage || 'Error al actualizar el usuario.' };
        }

        revalidatePath('/users');
        return { error: undefined };

    } catch (error) {
        console.error(error);
        return { error: 'No se pudo conectar con el servidor.' };
    }
}


export async function deleteUser(id: number) {
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
            return { error: errorMessage || 'Error al eliminar el usuario.' };
        }

        revalidatePath('/users');
        return { error: undefined };

    } catch (error) {
        console.error(error);
        return { error: 'No se pudo conectar con el servidor.' };
    }
}
