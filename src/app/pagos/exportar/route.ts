import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const token = (await cookies()).get("auth_token")?.value;
  const headers = { "Cache-Control": "private, no-store" };
  if (!token)
    return Response.json(
      { message: "Tu sesión terminó. Vuelve a ingresar." },
      { status: 401, headers },
    );
  const mes = request.nextUrl.searchParams.get("mes") ?? "";
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(mes))
    return Response.json(
      { message: "Selecciona un mes válido." },
      { status: 400, headers },
    );
  const formato = request.nextUrl.searchParams.get("formato") ?? "pdf";
  if (!["pdf", "excel"].includes(formato))
    return Response.json(
      { message: "Formato inválido." },
      { status: 400, headers },
    );
  const mime =
    formato === "excel"
      ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      : "application/pdf";
  const extension = formato === "excel" ? "xlsx" : "pdf";
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/pagos/exportar?${new URLSearchParams({ mes, formato })}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal: request.signal,
      },
    );
    if (!response.ok)
      return Response.json(
        {
          message:
            response.status === 401
              ? "Tu sesión terminó. Vuelve a ingresar."
              : "No se pudo generar el informe mensual.",
        },
        { status: response.status, headers },
      );
    if (
      !response.headers.get("content-type")?.includes(mime) ||
      !response.body
    ) {
      return Response.json(
        { message: "La API no devolvió un informe válido." },
        { status: 502, headers },
      );
    }
    return new Response(response.body, {
      headers: {
        ...headers,
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename="pagos-mensuales-${mes}.${extension}"`,
      },
    });
  } catch {
    return Response.json(
      { message: "No se pudo conectar con la API para descargar el informe." },
      { status: 502, headers },
    );
  }
}
