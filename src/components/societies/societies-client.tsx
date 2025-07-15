
'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '../ui/button';
import { SocietyFormModal } from './society-form-modal';
import { columns, SocietyColumn } from './columns';
import { Input } from '../ui/input';

interface SocietiesClientProps {
  data: SocietyColumn[];
}

export const SocietiesClient: React.FC<SocietiesClientProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');

  const filteredData = data.filter(item =>
    item.nombre.toLowerCase().includes(globalFilter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <SocietyFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
      />
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
            <Input
                placeholder="Buscar por nombre..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="h-9 max-w-sm"
            />
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Sociedad
        </Button>
      </div>
      <DataTable 
        columns={columns} 
        data={filteredData} 
      />
    </div>
  );
};
