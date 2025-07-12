
'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '../ui/button';
import { PropertyFormModal } from './property-form-modal';
import { columns, PropertyColumn } from './columns';
import { Input } from '../ui/input';

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
  const [filter, setFilter] = useState('');

  const filteredData = data.filter(item => 
    item.direccion.toLowerCase().includes(filter.toLowerCase()) ||
    item.nombre_sociedad?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <PropertyFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
        societies={societies}
      />
       <div className="flex items-center justify-between">
            <Input
                placeholder="Buscar por dirección o sociedad..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="max-w-sm"
            />
            <Button onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Propiedad
            </Button>
      </div>
      <DataTable columns={columns(societies)} data={filteredData} searchKey="direccion" />
    </div>
  );
};
