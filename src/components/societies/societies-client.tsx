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
    <>
      <SocietyFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
      />
      <div className="flex items-center justify-between mb-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Sociedades</h1>
            <p className="text-muted-foreground mt-2">
                Administra las sociedades del sistema.
            </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Sociedad
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="nombre" />
    </>
  );
};
