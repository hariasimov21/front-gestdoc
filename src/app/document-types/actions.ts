
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${API_BASE_URL}/tipo-documento`;

const documentTypeSchema = z.object({
  nombre_tipo_documento: z.string().min(1, 'El nombre del tipo de documento es requerido.'),
});

async function getAuthToken() {
  const token = cookies().get('auth_token')?.value;
  if (!token) {
    throw new Error('No authentication token found.');
  }
  return token;
}

export async function createDocumentType(prevState: { error?: string }, formData: FormData) {
  const validatedFields = documentTypeSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: 'Datos inválidos. Por favor, revisa los campos.' };
  }
  
  const postData = {
    nombre_tipo_documento: validatedFields.data.nombre_tipo_documento,
  };

  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/createTipoDocumento`, {
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
      return { error: errorMessage || 'Error al crear el tipo de documento.' };
    }

    revalidatePath('/document-types');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'No se pudo conectar con el servidor.' };
  }
}

export async function deleteDocumentType(id_tipo_documento: number) {
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/delete/${id_tipo_documento}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
            return { error: errorMessage || 'Error al eliminar el tipo de documento.' };
        }

        revalidatePath('/document-types');
        return { success: true };

    } catch (error) {
        console.error(error);
        return { error: 'No se pudo conectar con el servidor.' };
    }
}
