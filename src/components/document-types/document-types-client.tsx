
'use client';

import { useState } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '../ui/button';
import { DocumentTypeFormModal } from './document-type-form-modal';
import { columns, DocumentTypeColumn } from './columns';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader } from '../ui/card';

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
      <Card>
        <CardHeader className="p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-auto flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="h-9 w-full pl-8"
                    />
                </div>
                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <Button onClick={() => setIsModalOpen(true)} size="sm" className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Crear Tipo de Documento
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
            <DataTable 
                columns={columns} 
                data={filteredData} 
            />
        </CardContent>
      </Card>
    </div>
  );
};
