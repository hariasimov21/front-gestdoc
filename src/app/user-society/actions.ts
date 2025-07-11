
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${API_BASE_URL}/usuario-sociedad`;

type User = {
  id_usuario: number;
  nombre: string;
};

type Society = {
    id_sociedad: number;
    nombre: string;
};

type ApiResponse<T> = {
  payload: T;
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

export async function getSocietiesForUser(userId: number): Promise<Society[]> {
    if (!userId) return [];
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/usuario/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!response.ok) return [];
        const data: ApiResponse<{ sociedad: { id_sociedad: number; nombre_sociedad: string; } }[]> = await response.json();
        return data.payload.map(item => ({ id_sociedad: item.sociedad.id_sociedad, nombre: item.sociedad.nombre_sociedad }));
    } catch (error) {
        return [];
    }
}

export async function getUsersForSociety(societyId: number): Promise<User[]> {
    if (!societyId) return [];
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/sociedad/${societyId}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!response.ok) return [];
        const data: ApiResponse<{ usuario: User }[]> = await response.json();
        return data.payload.map(item => item.usuario);
    } catch (error) {
        return [];
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
      const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
      return { error: errorMessage || 'Error al crear la asociación.' };
    }

    revalidatePath('/user-society');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'No se pudo conectar con el servidor.' };
  }
}

export async function deleteAssociation(id_usuario: number, id_sociedad: number) {
    const deleteData = { id_usuario, id_sociedad };
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/eliminarAsociacion`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(deleteData),
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
            return { error: errorMessage || 'Error al eliminar la asociación.' };
        }

        revalidatePath('/user-society');
        return { success: true };

    } catch (error) {
        console.error(error);
        return { error: 'No se pudo conectar con el servidor.' };
    }
}
