
'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '../ui/button';
import { PropertyFormModal } from './property-form-modal';
import { columns, PropertyColumn } from './columns';

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

  return (
    <div className="space-y-4">
      <PropertyFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
        societies={societies}
      />
      <DataTable 
        columns={columns(societies)} 
        data={data} 
        searchKey="direccion"
        searchPlaceholder="Buscar por dirección o sociedad..."
      >
         <Button onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Propiedad
        </Button>
      </DataTable>
    </div>
  );
};
