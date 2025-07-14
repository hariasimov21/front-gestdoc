
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { format } from 'date-fns';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${API_BASE_URL}/documento`;

// Schema for creating a document
const createDocumentSchema = z.object({
  nombre_documento: z.string().min(1, 'El nombre es requerido.'),
  id_propiedad: z.string().min(1, 'La propiedad es requerida.'),
  id_tipo_documento: z.string().min(1, 'El tipo de documento es requerido.'),
  fecha_vencimiento: z.date({ required_error: 'La fecha de vencimiento es requerida.' }),
  file: z.any().refine((files) => files?.[0] || files instanceof File, 'El archivo es requerido.'),
});

// Schema for updating a document (file is optional)
const updateDocumentSchema = z.object({
  nombre_documento: z.string().min(1, 'El nombre es requerido.'),
  id_propiedad: z.string().min(1, 'La propiedad es requerida.'),
  id_tipo_documento: z.string().min(1, 'El tipo de documento es requerido.'),
  fecha_vencimiento: z.date({ required_error: 'La fecha de vencimiento es requerida.' }),
  file: z.any().optional(),
});


async function getAuthToken() {
  const token = cookies().get('auth_token')?.value;
  if (!token) {
    throw new Error('No authentication token found.');
  }
  return token;
}

export async function createDocument(prevState: { error?: string }, formData: FormData) {
  
  const validatedFields = createDocumentSchema.safeParse({
    nombre_documento: formData.get('nombre_documento'),
    id_propiedad: formData.get('id_propiedad'),
    id_tipo_documento: formData.get('id_tipo_documento'),
    fecha_vencimiento: new Date(formData.get('fecha_vencimiento') as string),
    file: formData.get('file'),
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return { error: 'Datos inválidos. Por favor, revisa los campos.' };
  }
  
  // Directly use formData from the form, the backend will handle parsing.
  const apiFormData = new FormData();
  apiFormData.append('nombre_documento', formData.get('nombre_documento') as string);
  apiFormData.append('id_propiedad', formData.get('id_propiedad') as string);
  apiFormData.append('id_tipo_documento', formData.get('id_tipo_documento') as string);
  // Format date correctly for the backend
  const fechaVencimiento = new Date(formData.get('fecha_vencimiento') as string);
  apiFormData.append('fecha_vencimiento', format(fechaVencimiento, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"));
  apiFormData.append('file', formData.get('file') as File);


  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/crearDocumento`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: apiFormData,
    });

    if (!response.ok) {
      const data = await response.json();
      const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
      return { error: errorMessage || 'Error al crear el documento.' };
    }

    revalidatePath('/documents');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'No se pudo conectar con el servidor.' };
  }
}

export async function updateDocument(prevState: { error?: string }, formData: FormData) {
    const documentId = formData.get('id_documento');

    const validatedFields = updateDocumentSchema.safeParse({
        nombre_documento: formData.get('nombre_documento'),
        id_propiedad: formData.get('id_propiedad'),
        id_tipo_documento: formData.get('id_tipo_documento'),
        fecha_vencimiento: new Date(formData.get('fecha_vencimiento') as string),
        file: formData.get('file'),
    });


    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return { error: 'Datos inválidos. Por favor, revisa los campos.' };
    }

    const apiFormData = new FormData();
    apiFormData.append('id_documento', String(documentId));
    apiFormData.append('nombre_documento', validatedFields.data.nombre_documento);
    apiFormData.append('id_propiedad', validatedFields.data.id_propiedad);
    apiFormData.append('id_tipo_documento', validatedFields.data.id_tipo_documento);
    const fechaVencimiento = new Date(formData.get('fecha_vencimiento') as string);
    apiFormData.append('fecha_vencimiento', format(fechaVencimiento, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"));
    
    const file = formData.get('file') as File | null;
    if (file && file.size > 0) {
        apiFormData.append('file', file);
    }

    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/actualizarDocumento`, {
            method: 'POST', // Backend uses POST for update with file
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: apiFormData,
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
            return { error: errorMessage || 'Error al actualizar el documento.' };
        }

        revalidatePath('/documents');
        return { success: true };

    } catch (error) {
        console.error(error);
        return { error: 'No se pudo conectar con el servidor.' };
    }
}


export async function inactivateDocument(id_documento: number) {
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/${id_documento}/inhabilitar`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
            return { error: errorMessage || 'Error al inactivar el documento.' };
        }

        revalidatePath('/documents');
        return { success: true };

    } catch (error) {
        console.error(error);
        return { error: 'No se pudo conectar con el servidor.' };
    }
}
