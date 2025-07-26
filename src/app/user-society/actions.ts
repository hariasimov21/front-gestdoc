
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${API_BASE_URL}/usuario-sociedad`;

type ApiResponse<T> = {
  payload: T;
  error?: string;
  message?: string | string[];
};

const associationSchema = z.object({
  id_usuario: z.string().min(1, 'El usuario es requerido.'),
  id_sociedad: z.string().min(1, 'La sociedad es requerida.'),
});

async function getAuthToken() {
  const token = cookies().get('auth_token')?.value;
  if (!token) {
    throw new Error('No authentication token found.');
  }
  return token;
}

export async function getAllAssociations(): Promise<ApiResponse<{ id_usuario_sociedad: number, nombre_usuario: string, nombre_sociedad: string }[]>> {
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/listarAsociaciones`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!response.ok) {
            const data = await response.json();
            const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : (data.message || 'Error al obtener las asociaciones.');
            return { payload: [], error: errorMessage };
        };
        const data = await response.json();
        return { payload: data.payload };
    } catch (error) {
        console.error(error);
        return { payload: [], error: 'No se pudo conectar con el servidor.' };
    }
}

export async function createAssociation(prevState: { error?: string }, formData: FormData) {
  const validatedFields = associationSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: 'Datos inválidos. Por favor, selecciona un usuario y una sociedad.' };
  }
  
  const postData = {
    id_usuario: parseInt(validatedFields.data.id_usuario, 10),
    id_sociedad: parseInt(validatedFields.data.id_sociedad, 10),
  };

  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/asociarUsuario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const data = await response.json();
      const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : (data.message || 'Error al crear la asociación.');
      return { error: errorMessage };
    }

    revalidatePath('/user-society');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'No se pudo conectar con el servidor.' };
  }
}

export async function deleteAssociation(id_usuario_sociedad: number) {
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/eliminarAsociacion/${id_usuario_sociedad}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : (data.message || 'Error al eliminar la asociación.');
            return { error: errorMessage };
        }

        revalidatePath('/user-society');
        return { success: true };

    } catch (error) {
        console.error(error);
        return { error: 'No se pudo conectar con el servidor.' };
    }
}
