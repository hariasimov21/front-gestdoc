
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DocumentsClient } from '@/components/documents/documents-client';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

type Session = {
  nombre: string;
  email: string;
  rol_usuario_id: number;
  nombre_rol: string;
  id_usuario: number;
  tokenExp?: number;
};

type Document = {
  id_documento: number;
  nombre_documento: string;
  file_id_GD: string;
  fecha_subida: string;
  id_propiedad: number;
  id_tipo_documento: number;
  fecha_vencimiento: string;
  estado: boolean;
  version: string;
  folder_id: string;
};

type Property = {
  id_propiedad: number;
  direccion: string;
};

type DocumentType = {
    id_tipo_documento: number;
    nombre_tipo_documento: string;
};


type ApiResponse<T> = {
  payload: T;
};

type PaginatedApiResponse<T> = {
  payload: {
    datos: T;
  };
};

async function getDocuments(token: string): Promise<Document[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_URL}/documento/listarDocumentos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to fetch documents');
    return [];
  }
  
  const data: PaginatedApiResponse<Document[]> = await response.json();
  return data.payload.datos || [];
}

async function getProperties(token: string): Promise<Property[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_URL}/propiedad/listarPropiedades`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to fetch properties');
    return [];
  }
  
  const data: PaginatedApiResponse<Property[]> = await response.json();
  const properties = data.payload.datos || [];
  return properties.map(p => ({ id_propiedad: p.id_propiedad, direccion: p.direccion }));
}

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
  
  const data: ApiResponse<DocumentType[]> = await response.json();
  return data.payload;
}


export default async function DocumentsPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  const token = cookieStore.get('auth_token')?.value;

  if (!sessionCookie || !token) {
    redirect('/ingresar');
  }

  const user: Session = JSON.parse(sessionCookie);
  const documents = await getDocuments(token);
  const properties = await getProperties(token);
  const documentTypes = await getDocumentTypes(token);

  const formattedDocuments = documents.map(doc => {
    const property = properties.find(p => p.id_propiedad === doc.id_propiedad);
    const documentType = documentTypes.find(dt => dt.id_tipo_documento === doc.id_tipo_documento);
    return {
        ...doc,
        propiedadDireccion: property?.direccion || 'N/A',
        tipoDocumentoNombre: documentType?.nombre_tipo_documento || 'N/A',
    };
  });


  return (
    <DashboardLayout 
      user={user}
      title="Gestión de Documentos"
      description="Administra los documentos del sistema."
    >
      <DocumentsClient data={formattedDocuments} properties={properties} documentTypes={documentTypes} />
    </DashboardLayout>
  );
}
