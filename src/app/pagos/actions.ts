"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { PaymentInput, PaymentPage } from "@/components/payments/types";

async function paymentRequest(path: string, options: RequestInit = {}) {
  const token = (await cookies()).get("auth_token")?.value;
  if (!token) throw new Error("Tu sesión terminó. Vuelve a ingresar.");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pagos${path}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    if (response.status === 401)
      throw new Error("Tu sesión terminó. Vuelve a ingresar.");
    if (response.status >= 500)
      throw new Error("No se pudo procesar el pago. Intenta nuevamente.");
    throw new Error(
      Array.isArray(data?.message)
        ? data.message.join(", ")
        : data?.message || "No se pudo procesar la solicitud.",
    );
  }
  return response.json();
}

export async function savePayment(
  id: number,
  input: PaymentInput,
): Promise<{ success?: boolean; error?: string }> {
  try {
    await paymentRequest(`/arriendo/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
    revalidatePath("/pagos");
    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error && error.message !== "fetch failed"
          ? error.message
          : "No se pudo conectar con la API.",
    };
  }
}

export async function getPaymentHistory(
  id: number,
  pagina = 1,
): Promise<{ payload?: PaymentPage; error?: string }> {
  try {
    return await paymentRequest(
      `/arriendo/${id}/historial?pagina=${pagina}&limite=12`,
    );
  } catch (error) {
    return {
      error:
        error instanceof Error && error.message !== "fetch failed"
          ? error.message
          : "No se pudo conectar con la API.",
    };
  }
}

export async function listPayments(
  mes: string,
  pagina: number,
  buscar: string,
  estado: string,
): Promise<{ payload?: PaymentPage; error?: string }> {
  try {
    return await paymentRequest(
      `?${new URLSearchParams({ mes, pagina: String(pagina), limite: "20", buscar, estado })}`,
    );
  } catch (error) {
    return {
      error:
        error instanceof Error && error.message !== "fetch failed"
          ? error.message
          : "No se pudo conectar con la API.",
    };
  }
}
