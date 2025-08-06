
'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { UserFormModal } from './user-form-modal';
import { columns, UserColumn } from './columns';
import { Input } from '../ui/input';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState } from '@tanstack/react-table';
import { Card, CardContent, CardHeader } from '../ui/card';

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
  const [globalFilter, setGlobalFilter] = useState('');

  const tableColumns = columns(roles);
  
  const filteredData = data.filter(item => {
    const roleName = item.rol_usuario?.nombre_rol || '';
    return (
      item.nombre.toLowerCase().includes(globalFilter.toLowerCase()) ||
      item.email.toLowerCase().includes(globalFilter.toLowerCase()) ||
      roleName.toLowerCase().includes(globalFilter.toLowerCase())
    );
  });

  return (
    <div className="space-y-4">
      <UserFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
        roles={roles}
      />
      <Card>
        <CardHeader className="p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-1 items-center space-x-2 w-full">
                    <Input
                        placeholder="Buscar por nombre o email..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="h-9 w-full"
                    />
                </div>
                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <Button onClick={() => setIsModalOpen(true)} size="sm" className="w-full md:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Crear Usuario
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
            <DataTable 
                columns={tableColumns} 
                data={filteredData} 
            />
        </CardContent>
      </Card>
    </div>
  );
};
