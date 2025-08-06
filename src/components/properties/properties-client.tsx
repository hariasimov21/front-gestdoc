
'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '../ui/button';
import { PropertyFormModal } from './property-form-modal';
import { columns, PropertyColumn } from './columns';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader } from '../ui/card';

type Society = {
    id_sociedad: number;
    nombre: string;
};

interface PropertiesClientProps {
  data: PropertyColumn[];
  societies: Society[];
}

export const PropertiesClient: React.FC<PropertiesClientProps> = ({ data, societies }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');

  const tableColumns = columns(societies);

  const filteredData = data.filter(item => {
    const societyName = societies.find(s => s.id_sociedad === item.id_sociedad)?.nombre || '';
    return (
      item.direccion.toLowerCase().includes(globalFilter.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(globalFilter.toLowerCase()) ||
      societyName.toLowerCase().includes(globalFilter.toLowerCase())
    );
  });

  return (
    <div className="space-y-4">
      <PropertyFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
        societies={societies}
      />
        <Card>
            <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-1 items-center space-x-2">
                        <Input
                            placeholder="Buscar por dirección, descripción o sociedad..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="h-9 max-w-sm"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button onClick={() => setIsModalOpen(true)} size="sm">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Crear Propiedad
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <DataTable 
                    columns={tableColumns} 
                    data={filteredData} 
                />
            </CardContent>
        </Card>
    </div>
  );
};
