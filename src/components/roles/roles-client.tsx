'use client';

import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { RoleFormModal } from './role-form-modal';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';

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

  return (
    <>
      <RoleFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
      />
      <div className="flex items-center justify-between mb-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Roles</h1>
            <p className="text-muted-foreground mt-2">
                Administra los roles de usuario del sistema.
            </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Rol
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="nombre_rol" />
    </>
  );
};
