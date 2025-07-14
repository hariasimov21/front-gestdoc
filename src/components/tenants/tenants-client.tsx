
'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '../ui/button';
import { TenantFormModal } from './tenant-form-modal';
import { columns, TenantColumn } from './columns';

interface TenantsClientProps {
  data: TenantColumn[];
}

export const TenantsClient: React.FC<TenantsClientProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <TenantFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
      />
      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="nombre"
        searchPlaceholder="Buscar por nombre o RUT..."
      >
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Arrendatario
        </Button>
      </DataTable>
    </div>
  );
};
