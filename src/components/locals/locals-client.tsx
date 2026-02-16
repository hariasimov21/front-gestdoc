
'use client';

import { useState } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '../ui/button';
import { LocalFormModal } from './local-form-modal';
import { columns, LocalColumn } from './columns';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader } from '../ui/card';

type Property = {
  id_propiedad: number;
  direccion: string;
};

interface LocalsClientProps {
  data: LocalColumn[];
  properties: Property[];
}

export const LocalsClient: React.FC<LocalsClientProps> = ({ data, properties }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');

  const tableColumns = columns(properties);

  const filteredData = data.filter(item => {
    const propertyName = properties.find(p => p.id_propiedad === item.id_propiedad)?.direccion || '';
    const filter = globalFilter.toLowerCase();

    return (
      String(item.id_local).toLowerCase().includes(filter) ||
      item.nombre_local.toLowerCase().includes(filter) ||
      (item.descripcion || '').toLowerCase().includes(filter) ||
      (item.nro_cliente_saesa || '').toLowerCase().includes(filter) ||
      (item.nro_cliente_suralis || '').toLowerCase().includes(filter) ||
      propertyName.toLowerCase().includes(filter)
    );
  });

  return (
    <div className="space-y-4">
      <LocalFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
        properties={properties}
      />
      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-auto md:flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por local, descripción o propiedad..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="h-9 w-full pl-8 md:w-[260px]"
              />
            </div>
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Button onClick={() => setIsModalOpen(true)} size="sm" className="w-full md:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear Local
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <DataTable columns={tableColumns} data={filteredData} />
        </CardContent>
      </Card>
    </div>
  );
};
