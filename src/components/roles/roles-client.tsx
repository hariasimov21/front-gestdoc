
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
    <div className="space-y-4">
      <RoleFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
      />
      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="nombre_rol"
        searchPlaceholder="Buscar por nombre de rol..."
      >
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Rol
        </Button>
      </DataTable>
    </div>
  );
};
