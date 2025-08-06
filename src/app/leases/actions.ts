
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${API_BASE_URL}/arriendo`;

const leaseSchema = z.object({
  id_arrendatario: z.string().min(1, 'El arrendatario es requerido.'),
  id_propiedad: z.string().min(1, 'La propiedad es requerida.'),
  fecha_inicio_arriendo: z.date({ required_error: 'La fecha de inicio es requerida.' }),
  fecha_fin_arriendo: z.date({ required_error: 'La fecha de fin es requerida.' }),
});

async function getAuthToken() {
  const token = cookies().get('auth_token')?.value;
  if (!token) {
    throw new Error('No authentication token found.');
  }
  return token;
}

export async function createLease(prevState: { error?: string }, formData: FormData) {
  const rawData = {
    id_arrendatario: formData.get('id_arrendatario'),
    id_propiedad: formData.get('id_propiedad'),
    fecha_inicio_arriendo: formData.get('fecha_inicio_arriendo') ? new Date(formData.get('fecha_inicio_arriendo') as string) : undefined,
    fecha_fin_arriendo: formData.get('fecha_fin_arriendo') ? new Date(formData.get('fecha_fin_arriendo') as string) : undefined,
  };
  
  const validatedFields = leaseSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors)
    return { error: 'Datos inválidos. Por favor, revisa los campos.' };
  }
  
  const postData = {
    id_arrendatario: parseInt(validatedFields.data.id_arrendatario, 10),
    id_propiedad: parseInt(validatedFields.data.id_propiedad, 10),
    fecha_inicio_arriendo: validatedFields.data.fecha_inicio_arriendo.toISOString(),
    fecha_fin_arriendo: validatedFields.data.fecha_fin_arriendo.toISOString(),
    activo: true,
  };

  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/crearArriendo`, {
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
      return { error: errorMessage || `Error del servidor: ${response.statusText}` };
    }

    revalidatePath('/leases');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'No se pudo conectar con el servidor.' };
  }
}

export async function updateLease(id_arriendo: number, prevState: { error?: string }, formData: FormData) {
    const rawData = {
        fecha_inicio_arriendo: formData.get('fecha_inicio_arriendo') ? new Date(formData.get('fecha_inicio_arriendo') as string) : undefined,
        fecha_fin_arriendo: formData.get('fecha_fin_arriendo') ? new Date(formData.get('fecha_fin_arriendo') as string) : undefined,
    };
    
    const updateSchema = z.object({
        fecha_inicio_arriendo: z.date({ required_error: 'La fecha de inicio es requerida.' }),
        fecha_fin_arriendo: z.date({ required_error: 'La fecha de fin es requerida.' }),
    })

    const validatedFields = updateSchema.safeParse(rawData);

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors)
        return { error: 'Datos inválidos. Por favor, revisa los campos.' };
    }
    
    const putData = {
      fecha_inicio_arriendo: validatedFields.data.fecha_inicio_arriendo.toISOString(),
      fecha_fin_arriendo: validatedFields.data.fecha_fin_arriendo.toISOString(),
    };

    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/actualizarArriendo/${id_arriendo}`, {
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
            return { error: errorMessage || 'Error al actualizar el arriendo.' };
        }

        revalidatePath('/leases');
        return { success: true };

    } catch (error) {
        console.error(error);
        return { error: 'No se pudo conectar con el servidor.' };
    }
}


export async function inactivateLease(id_arriendo: number) {
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/inactivar/${id_arriendo}`, {
            method: 'POST', // Backend uses POST for inactivation
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
            return { error: errorMessage || 'Error al inactivar el arriendo.' };
        }

        revalidatePath('/leases');
        return { success: true };

    } catch (error) {
        console.error(error);
        return { error: 'No se pudo conectar con el servidor.' };
    }
}

export async function getExpiringLeases(days: number): Promise<{ payload: any[], error?: string }> {
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/vencimientos?dias=${days}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
            return { payload: [], error: errorMessage || 'Error al obtener los arriendos por vencer.' };
        }
        
        const data = await response.json();
        return { payload: data.payload || [] };
    } catch (error) {
        console.error(error);
        return { payload: [], error: 'No se pudo conectar con el servidor.' };
    }
}
