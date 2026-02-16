
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${API_BASE_URL}/locales`;

const localSchema = z.object({
  nombre_local: z.string().min(1, 'El nombre del local es requerido.'),
  descripcion: z.string().min(1, 'La descripción es requerida.'),
  tipo_local: z.string().min(1, 'El tipo de local es requerido.'),
  id_propiedad: z.string().optional(),
  nro_cliente_saesa: z.string().optional(),
  nro_cliente_suralis: z.string().optional(),
});

async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) {
    throw new Error('No authentication token found.');
  }
  return token;
}

export async function createLocal(prevState: { error?: string }, formData: FormData) {
  const validatedFields = localSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: 'Datos inválidos. Por favor, revisa los campos.' };
  }

  const postData = {
    ...validatedFields.data,
    tipo_local: parseInt(validatedFields.data.tipo_local, 10),
  };

  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/createLocal`, {
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
      return { error: errorMessage || 'Error al crear el local.' };
    }

    revalidatePath('/locales');
    revalidatePath('/arriendos');
    revalidatePath('/leases');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'No se pudo conectar con el servidor.' };
  }
}

export async function updateLocal(id_local: number, prevState: { error?: string }, formData: FormData) {
  const validatedFields = localSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: 'Datos inválidos. Por favor, revisa los campos.' };
  }

  const putData = {
    ...validatedFields.data,
    id_propiedad: parseInt(validatedFields.data.id_propiedad, 10),
    tipo_local: parseInt(validatedFields.data.tipo_local, 10),
  };

  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/${id_local}`, {
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
      return { error: errorMessage || 'Error al actualizar el local.' };
    }

    revalidatePath('/locales');
    revalidatePath('/arriendos');
    revalidatePath('/leases');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'No se pudo conectar con el servidor.' };
  }
}

export async function deleteLocal(id_local: number) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/${id_local}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
      return { error: errorMessage || 'Error al eliminar el local.' };
    }

    revalidatePath('/locales');
    revalidatePath('/arriendos');
    revalidatePath('/leases');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'No se pudo conectar con el servidor.' };
  }
}

export async function getSignedUrlsForLocal(id_local: number) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/storage/urls-firmadas/local/${id_local}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
      return { error: errorMessage || 'Error al obtener los documentos.' };
    }

    const data = await response.json();
    return { success: true, payload: data.payload };
  } catch (error) {
    console.error(error);
    return { error: 'No se pudo conectar con el servidor.' };
  }
}
