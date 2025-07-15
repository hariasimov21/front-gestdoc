
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
  const [globalFilter, setGlobalFilter] = useState('');

  const filteredData = data.filter(item =>
    item.nombre_tipo_documento.toLowerCase().includes(globalFilter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <DocumentTypeFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <Input
                placeholder="Buscar por nombre..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="h-9 max-w-sm"
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Tipo de Documento
          </Button>
      </div>
      <DataTable 
        columns={columns} 
        data={filteredData} 
      />
    </div>
  );
};
