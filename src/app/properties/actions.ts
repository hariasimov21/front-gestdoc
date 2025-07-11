'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${API_BASE_URL}/propiedad`;

const propertySchema = z.object({
  direccion: z.string().min(1, 'La dirección es requerida.'),
  descripcion: z.string().min(1, 'La descripción es requerida.'),
  longitud: z.string().min(1, 'La longitud es requerida.'),
  latitud: z.string().min(1, 'La latitud es requerida.'),
  id_sociedad: z.string().min(1, 'La sociedad es requerida.'),
});

async function getAuthToken() {
  const token = cookies().get('auth_token')?.value;
  if (!token) {
    throw new Error('No authentication token found.');
  }
  return token;
}

export async function createProperty(prevState: { error?: string }, formData: FormData) {
  const validatedFields = propertySchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: 'Datos inválidos. Por favor, revisa los campos.' };
  }

  const postData = {
    ...validatedFields.data,
    id_sociedad: parseInt(validatedFields.data.id_sociedad, 10),
  };

  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/createPropiedad`, {
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
      return { error: errorMessage || 'Error al crear la propiedad.' };
    }

    revalidatePath('/properties');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'No se pudo conectar con el servidor.' };
  }
}

export async function updateProperty(id_propiedad: number, prevState: { error?: string }, formData: FormData) {
    const validatedFields = propertySchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { error: 'Datos inválidos. Por favor, revisa los campos.' };
    }
    
    const putData = {
      ...validatedFields.data,
      id_sociedad: parseInt(validatedFields.data.id_sociedad, 10),
    };

    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/${id_propiedad}`, {
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
            return { error: errorMessage || 'Error al actualizar la propiedad.' };
        }

        revalidatePath('/properties');
        return { success: true };

    } catch (error) {
        console.error(error);
        return { error: 'No se pudo conectar con el servidor.' };
    }
}


export async function deleteProperty(id_propiedad: number) {
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/${id_propiedad}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
            return { error: errorMessage || 'Error al eliminar la propiedad.' };
        }

        revalidatePath('/properties');
        return { success: true };

    } catch (error) {
        console.error(error);
        return { error: 'No se pudo conectar con el servidor.' };
    }
}
