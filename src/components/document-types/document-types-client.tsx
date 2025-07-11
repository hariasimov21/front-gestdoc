
'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '../ui/button';
import { DocumentTypeFormModal } from './document-type-form-modal';
import { columns, DocumentTypeColumn } from './columns';

interface DocumentTypesClientProps {
  data: DocumentTypeColumn[];
}

export const DocumentTypesClient: React.FC<DocumentTypesClientProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <DocumentTypeFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div className="flex items-center justify-between mb-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Tipos de Documento</h1>
            <p className="text-muted-foreground mt-2">
                Administra los tipos de documento del sistema.
            </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Tipo de Documento
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="nombre_tipo_documento" />
    </>
  );
};
