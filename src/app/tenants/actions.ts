'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${API_BASE_URL}/arrendatario`;

const tenantSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido.'),
  email: z.string().email('El correo no es válido.'),
  rubro: z.string().min(1, 'El rubro es requerido.'),
  rut_arrendatario: z.string().min(1, 'El RUT es requerido.'),
});

async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) {
    throw new Error('No authentication token found.');
  }
  return token;
}

export async function createTenant(prevState: { error?: string }, formData: FormData) {
  const validatedFields = tenantSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: 'Datos inválidos. Por favor, revisa los campos.' };
  }

  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/crearArrendatario`, {
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
      return { error: errorMessage || 'Error al crear el arrendatario.' };
    }

    revalidatePath('/tenants');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'No se pudo conectar con el servidor.' };
  }
}

export async function updateTenant(rut_arrendatario: string, prevState: { error?: string }, formData: FormData) {
    const validatedFields = tenantSchema.omit({ rut_arrendatario: true }).safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { error: 'Datos inválidos. Por favor, revisa los campos.' };
    }

    const putData = {
        ...validatedFields.data,
        rut_arrendatario: rut_arrendatario, // Add the original RUT to the body
    };

    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/actualizarArrendatario`, {
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
            return { error: errorMessage || 'Error al actualizar el arrendatario.' };
        }

        revalidatePath('/tenants');
        return { success: true };

    } catch (error) {
        console.error(error);
        return { error: 'No se pudo conectar con el servidor.' };
    }
}


export async function deleteTenant(rut_arrendatario: string) {
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/deleteArrendatario/${rut_arrendatario}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
            return { error: errorMessage || 'Error al eliminar el arrendatario.' };
        }

        revalidatePath('/tenants');
        return { success: true };

    } catch (error) {
        console.error(error);
        return { error: 'No se pudo conectar con el servidor.' };
    }
}
