
'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { UserFormModal } from './user-form-modal';
import { columns } from './columns';
import { UserColumn } from './columns';
import { Input } from '../ui/input';

type Role = {
  id_rol_usuario: number;
  nombre_rol: string;
  descripcion: string;
};

interface UsersClientProps {
  data: UserColumn[];
  roles: Role[];
}

export const UsersClient: React.FC<UsersClientProps> = ({ data, roles }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const tableColumns = columns(roles);

  const filteredData = data.filter(item => 
    item.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    item.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <UserFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
        roles={roles}
      />
      <div className="flex items-center justify-between">
        <Input
          placeholder="Buscar por nombre o email..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Usuario
        </Button>
      </div>
      <DataTable columns={tableColumns} data={filteredData} searchKey="nombre" />
    </div>
  );
};
