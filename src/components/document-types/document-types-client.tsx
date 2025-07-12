
'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '../ui/button';
import { DocumentTypeFormModal } from './document-type-form-modal';
import { columns, DocumentTypeColumn } from './columns';
import { Input } from '../ui/input';

interface DocumentTypesClientProps {
  data: DocumentTypeColumn[];
}

export const DocumentTypesClient: React.FC<DocumentTypesClientProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const filteredData = data.filter(item =>
    item.nombre_tipo_documento.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <DocumentTypeFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div className="flex items-center justify-between">
        <Input
            placeholder="Buscar por nombre..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
        />
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Tipo de Documento
        </Button>
      </div>
      <DataTable columns={columns} data={filteredData} searchKey="nombre_tipo_documento" />
    </div>
  );
};
