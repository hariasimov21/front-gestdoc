
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
    <>
      <PropertyFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
        societies={societies}
      />
      <div className="flex items-center justify-between mb-4">
        <div/>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Propiedad
        </Button>
      </div>
      <DataTable columns={columns(societies)} data={data} searchKey="direccion" />
    </>
  );
};
