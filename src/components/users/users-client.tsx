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

  // Pass roles to columns definition
  const tableColumns = columns(roles);

  return (
    <>
      <UserFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
        roles={roles}
      />
      <div className="flex items-center justify-between mb-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
            <p className="text-muted-foreground mt-2">
                Administra los usuarios del sistema.
            </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Usuario
        </Button>
      </div>
      <DataTable columns={tableColumns} data={data} searchKey="nombre" />
    </>
  );
};
