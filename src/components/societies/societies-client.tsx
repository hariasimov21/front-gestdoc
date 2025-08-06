
'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '../ui/button';
import { SocietyFormModal } from './society-form-modal';
import { columns, SocietyColumn } from './columns';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader } from '../ui/card';

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
      <Card>
        <CardHeader className="p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-1 items-center space-x-2 w-full">
                    <Input
                        placeholder="Buscar por nombre..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="h-9 w-full"
                    />
                </div>
                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <Button onClick={() => setIsModalOpen(true)} size="sm" className="w-full md:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Crear Sociedad
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
            <DataTable 
                columns={columns} 
                data={filteredData} 
            />
        </CardContent>
      </Card>
    </div>
  );
};
