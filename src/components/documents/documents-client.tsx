
'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '../ui/button';
import { DocumentFormModal } from './document-form-modal';
import { columns, DocumentColumn } from './columns';
import { Input } from '../ui/input';

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
  const [filter, setFilter] = useState('');

  const filteredData = data.filter(item => 
    item.nombre_documento.toLowerCase().includes(filter.toLowerCase()) ||
    item.propiedadDireccion.toLowerCase().includes(filter.toLowerCase()) ||
    item.tipoDocumentoNombre.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <DocumentFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
        properties={properties}
        documentTypes={documentTypes}
      />
      <div className="flex items-center justify-between">
         <Input
            placeholder="Buscar por nombre, propiedad o tipo..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
        />
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Subir Documento
        </Button>
      </div>
      <DataTable columns={columns({ properties, documentTypes })} data={filteredData} searchKey="nombre_documento" />
    </div>
  );
};
