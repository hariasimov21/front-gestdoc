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
    <>
      <TenantFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
      />
      <div className="flex items-center justify-between mb-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Arrendatarios</h1>
            <p className="text-muted-foreground mt-2">
                Administra los arrendatarios del sistema.
            </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Arrendatario
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="nombre" />
    </>
  );
};
