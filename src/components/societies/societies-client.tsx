
'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '../ui/button';
import { SocietyFormModal } from './society-form-modal';
import { columns, SocietyColumn } from './columns';

interface SocietiesClientProps {
  data: SocietyColumn[];
}

export const SocietiesClient: React.FC<SocietiesClientProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <SocietyFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
      />
      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="nombre"
        searchPlaceholder="Buscar por nombre..."
      >
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Sociedad
        </Button>
      </DataTable>
    </div>
  );
};
