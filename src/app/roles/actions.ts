'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${API_BASE_URL}/rol-usuario`;

const roleSchema = z.object({
  nombre: z.string().min(1, 'El nombre del rol es requerido.'),
  descripcion: z.string().min(1, 'La descripción es requerida.'),
});

async function getAuthToken() {
  const token = cookies().get('auth_token')?.value;
  if (!token) {
    throw new Error('No authentication token found.');
  }
  return token;
}

export async function createRole(prevState: { error: string } | undefined, formData: FormData) {
  const validatedFields = roleSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: 'Datos inválidos. Por favor, revisa los campos.' };
  }

  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/crearRolUsuario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
      const data = await response.json();
      const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
      return { error: errorMessage || 'Error al crear el rol.' };
    }

    revalidatePath('/roles');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'No se pudo conectar con el servidor.' };
  }
}

export async function updateRole(id: number, prevState: { error: string } | undefined, formData: FormData) {
    const validatedFields = roleSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { error: 'Datos inválidos. Por favor, revisa los campos.' };
    }

    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(validatedFields.data),
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
            return { error: errorMessage || 'Error al actualizar el rol.' };
        }

        revalidatePath('/roles');
        return { success: true };

    } catch (error) {
        console.error(error);
        return { error: 'No se pudo conectar con el servidor.' };
    }
}


export async function deleteRole(id: number) {
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
            return { error: errorMessage || 'Error al eliminar el rol.' };
        }

        revalidatePath('/roles');
        return { error: undefined };

    } catch (error) {
        console.error(error);
        return { error: 'No se pudo conectar con el servidor.' };
    }
}
