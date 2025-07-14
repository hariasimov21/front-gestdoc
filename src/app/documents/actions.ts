
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
  file: z.instanceof(File, { message: 'El archivo es requerido.' }).refine(file => file.size > 0, 'El archivo es requerido.'),
});

// Schema for updating a document (file is optional)
const updateDocumentSchema = z.object({
  nombre_documento: z.string().min(1, 'El nombre es requerido.'),
  id_propiedad: z.string().min(1, 'La propiedad es requerida.'),
  id_tipo_documento: z.string().min(1, 'El tipo de documento es requerido.'),
  fecha_vencimiento: z.date({ required_error: 'La fecha de vencimiento es requerida.' }),
  file: z.instanceof(File).optional(),
});


async function getAuthToken() {
  const token = cookies().get('auth_token')?.value;
  if (!token) {
    throw new Error('No authentication token found.');
  }
  return token;
}

export async function createDocument(prevState: { error?: string }, formData: FormData) {
  
    const rawData = {
        nombre_documento: formData.get('nombre_documento'),
        id_propiedad: formData.get('id_propiedad'),
        id_tipo_documento: formData.get('id_tipo_documento'),
        fecha_vencimiento: formData.get('fecha_vencimiento') ? new Date(formData.get('fecha_vencimiento') as string) : undefined,
        file: formData.get('file'),
    };

    const validatedFields = createDocumentSchema.safeParse(rawData);


  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return { error: 'Datos inválidos. Por favor, revisa los campos.' };
  }
  
  // Directly use formData from the form, the backend will handle parsing.
  const apiFormData = new FormData();
  apiFormData.append('nombre_documento', validatedFields.data.nombre_documento);
  apiFormData.append('id_propiedad', validatedFields.data.id_propiedad);
  apiFormData.append('id_tipo_documento', validatedFields.data.id_tipo_documento);
  // Format date correctly for the backend
  apiFormData.append('fecha_vencimiento', format(validatedFields.data.fecha_vencimiento, "yyyy-MM-dd"));
  apiFormData.append('file', validatedFields.data.file);


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
    
    const rawData = {
        nombre_documento: formData.get('nombre_documento'),
        id_propiedad: formData.get('id_propiedad'),
        id_tipo_documento: formData.get('id_tipo_documento'),
        fecha_vencimiento: formData.get('fecha_vencimiento') ? new Date(formData.get('fecha_vencimiento') as string) : undefined,
        file: formData.get('file') as File | null,
    };

    const validatedFields = updateDocumentSchema.safeParse({
        ...rawData,
        file: rawData.file && rawData.file.size > 0 ? rawData.file : undefined
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
    apiFormData.append('fecha_vencimiento', format(validatedFields.data.fecha_vencimiento, 'yyyy-MM-dd'));
    
    if (validatedFields.data.file) {
        apiFormData.append('file', validatedFields.data.file);
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

export async function getSignedUrlForDocument(id_documento: number) {
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/url-firmada/${id_documento}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
            return { error: errorMessage || 'Error al obtener el documento.' };
        }

        const data = await response.json();
        return { success: true, url: data.url };

    } catch (error) {
        console.error(error);
        return { error: 'No se pudo conectar con el servidor.' };
    }
}
