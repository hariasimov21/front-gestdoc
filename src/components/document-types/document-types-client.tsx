
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
    <div className="space-y-4">
      <DocumentTypeFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="nombre_tipo_documento"
        searchPlaceholder="Buscar por nombre..."
      >
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Tipo de Documento
        </Button>
      </DataTable>
    </div>
  );
};
