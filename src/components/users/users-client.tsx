
'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { UserFormModal } from './user-form-modal';
import { columns } from './columns';
import { UserColumn } from './columns';

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

  const tableColumns = columns(roles);

  return (
    <div className="space-y-4">
      <UserFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
        roles={roles}
      />
      <DataTable 
        columns={tableColumns} 
        data={data} 
        searchKey="nombre"
        searchPlaceholder="Buscar por nombre o email..."
      >
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Usuario
        </Button>
      </DataTable>
    </div>
  );
};
