
'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { columns, RoleColumn } from './columns';
import { RoleFormModal } from './role-form-modal';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader } from '../ui/card';

interface RolesClientProps {
  data: RoleColumn[];
}

export const RolesClient: React.FC<RolesClientProps> = ({ data }) => {
  const searchParams = useSearchParams();
  const highlightedId = searchParams.get('highlight');
  
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
      <Card>
        <CardHeader className="p-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <Input
                        placeholder="Buscar por nombre o descripción..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="h-9 max-w-sm"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => setIsModalOpen(true)} size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Crear Rol
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
            <DataTable 
                columns={columns} 
                data={filteredData}
                highlightedRowId={highlightedId}
                rowIdKey="id_rol_usuario"
            />
        </CardContent>
      </Card>
    </div>
  );
};
