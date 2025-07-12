
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
  const [filter, setFilter] = useState('');

  const filteredData = data.filter(item => 
    item.nombre.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <SocietyFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
      />
      <div className="flex items-center justify-between">
        <Input
            placeholder="Buscar por nombre..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
        />
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Sociedad
        </Button>
      </div>
      <DataTable columns={columns} data={filteredData} searchKey="nombre" />
    </div>
  );
};
