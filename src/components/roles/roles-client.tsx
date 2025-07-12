
'use client';

import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { RoleFormModal } from './role-form-modal';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../ui/input';

type Role = {
  id_rol_usuario: number;
  nombre_rol: string;
  descripcion: string;
};

interface RolesClientProps {
  data: Role[];
}

export const RolesClient: React.FC<RolesClientProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const filteredData = data.filter(item => 
    item.nombre_rol.toLowerCase().includes(filter.toLowerCase())
  );


  return (
    <div className="space-y-4">
      <RoleFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
      />
      <div className="flex items-center justify-between">
         <Input
            placeholder="Buscar por nombre de rol..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
        />
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Rol
        </Button>
      </div>
      <DataTable columns={columns} data={filteredData} searchKey="nombre_rol" />
    </div>
  );
};
