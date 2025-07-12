
'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '../ui/button';
import { TenantFormModal } from './tenant-form-modal';
import { columns, TenantColumn } from './columns';
import { Input } from '../ui/input';

interface TenantsClientProps {
  data: TenantColumn[];
}

export const TenantsClient: React.FC<TenantsClientProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const filteredData = data.filter(item => 
    item.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    item.rut_arrendatario.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <TenantFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
      />
      <div className="flex items-center justify-between">
        <Input
            placeholder="Buscar por nombre o RUT..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
        />
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Arrendatario
        </Button>
      </div>
      <DataTable columns={columns} data={filteredData} searchKey="nombre" />
    </div>
  );
};
