'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${API_BASE_URL}/sociedad`;

const societySchema = z.object({
  nombre: z.string().min(1, 'El nombre de la sociedad es requerido.'),
});

async function getAuthToken() {
  const token = cookies().get('auth_token')?.value;
  if (!token) {
    throw new Error('No authentication token found.');
  }
  return token;
}

export async function createSociety(prevState: { error?: string }, formData: FormData) {
  const validatedFields = societySchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: 'Datos inválidos. Por favor, revisa los campos.' };
  }
  
  // Backend expects 'nombre_sociedad'
  const postData = {
    nombre_sociedad: validatedFields.data.nombre,
  };

  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/crearSociedad`, {
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
      return { error: errorMessage || 'Error al crear la sociedad.' };
    }

    revalidatePath('/societies');
    revalidatePath('/properties'); // Also revalidate properties in case the list is used there
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'No se pudo conectar con el servidor.' };
  }
}

export async function updateSociety(id_sociedad: number, prevState: { error?: string }, formData: FormData) {
    const validatedFields = societySchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { error: 'Datos inválidos. Por favor, revisa los campos.' };
    }
    
    // Backend expects 'nombre_sociedad'
    const putData = {
      nombre_sociedad: validatedFields.data.nombre,
    };

    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/updateSociedad/${id_sociedad}`, {
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
            return { error: errorMessage || 'Error al actualizar la sociedad.' };
        }

        revalidatePath('/societies');
        revalidatePath('/properties');
        return { success: true };

    } catch (error) {
        console.error(error);
        return { error: 'No se pudo conectar con el servidor.' };
    }
}


export async function deleteSociety(id_sociedad: number) {
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/deleteSociedad/${id_sociedad}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
            return { error: errorMessage || 'Error al eliminar la sociedad.' };
        }

        revalidatePath('/societies');
        revalidatePath('/properties');
        return { success: true };

    } catch (error) {
        console.error(error);
        return { error: 'No se pudo conectar con el servidor.' };
    }
}
