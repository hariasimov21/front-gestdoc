
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DocumentTypesClient } from '@/components/document-types/document-types-client';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

type Session = {
  nombre: string;
  email: string;
  rol_usuario_id: number;
  nombre_rol: string;
  id_usuario: number;
  tokenExp?: number;
};

type DocumentType = {
  id_tipo_documento: number;
  nombre_tipo_documento: string;
};

type ApiResponse = {
  payload: any[];
};

async function getDocumentTypes(token: string): Promise<DocumentType[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_URL}/tipo-documento/listarTipoDocumentos`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to fetch document types');
    return [];
  }
  
  const data: ApiResponse = await response.json();
  return data.payload;
}

export default async function DocumentTypesPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  const token = cookieStore.get('auth_token')?.value;

  if (!sessionCookie || !token) {
    redirect('/login');
  }

  const user: Session = JSON.parse(sessionCookie);
  const documentTypes = await getDocumentTypes(token);

  return (
    <DashboardLayout 
      user={user}
      title="Gestión de Tipos de Documento"
      description="Administra los tipos de documento del sistema."
    >
      <DocumentTypesClient data={documentTypes} />
    </DashboardLayout>
  );
}
