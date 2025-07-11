
'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '../ui/button';
import { DocumentFormModal } from './document-form-modal';
import { columns, DocumentColumn } from './columns';

type Property = {
  id_propiedad: number;
  direccion: string;
};

type DocumentType = {
    id_tipo_documento: number;
    nombre_tipo_documento: string;
};

interface DocumentsClientProps {
  data: DocumentColumn[];
  properties: Property[];
  documentTypes: DocumentType[];
}

export const DocumentsClient: React.FC<DocumentsClientProps> = ({ data, properties, documentTypes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <DocumentFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
        properties={properties}
        documentTypes={documentTypes}
      />
      <div className="flex items-center justify-between mb-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Documentos</h1>
            <p className="text-muted-foreground mt-2">
                Administra los documentos del sistema.
            </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Subir Documento
        </Button>
      </div>
      <DataTable columns={columns({ properties, documentTypes })} data={data} searchKey="nombre_documento" />
    </>
  );
};
