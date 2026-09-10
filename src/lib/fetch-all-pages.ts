type PaginatedResponse<T> = {
  payload: { datos: T[]; paginasTotales: number };
};

// Las tablas y filtros locales necesitan todas las páginas, no solo las primeras diez filas.
export async function fetchAllPages<T>(url: string, token: string): Promise<T[]> {
  const result: T[] = [];
  let pagina = 1;
  let paginasTotales = 1;
  do {
    const endpoint = new URL(url);
    endpoint.searchParams.set('pagina', String(pagina));
    endpoint.searchParams.set('limite', '100');
    const response = await fetch(endpoint.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`No se pudo cargar el listado (${response.status})`);
    const data: PaginatedResponse<T> = await response.json();
    if (!Array.isArray(data.payload?.datos) || !Number.isInteger(data.payload.paginasTotales) || data.payload.paginasTotales < 0) {
      throw new Error('La API devolvió una paginación inválida');
    }
    result.push(...data.payload.datos);
    paginasTotales = data.payload.paginasTotales;
    pagina++;
  } while (pagina <= paginasTotales);
  return result;
}
