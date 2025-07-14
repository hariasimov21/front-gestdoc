
'use client';

import { DataTable } from '@/components/ui/data-table';
import { columns, RoleColumn } from './columns';
import { RoleFormModal } from './role-form-modal';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../ui/input';

interface RolesClientProps {
  data: RoleColumn[];
}

export const RolesClient: React.FC<RolesClientProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  
  const filteredData = data.filter(item =>
    item.nombre_rol.toLowerCase().includes(globalFilter.toLowerCase()) ||
    item.descripcion.toLowerCase().includes(globalFilter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <RoleFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
      />
      <div className="flex items-center justify-between gap-2 flex-wrap">
          <Input
              placeholder="Buscar por nombre o descripción..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
          />
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Rol
        </Button>
      </div>
      <DataTable 
        columns={columns} 
        data={filteredData} 
      />
    </div>
  );
};
