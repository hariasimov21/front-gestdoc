
'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '../ui/button';
import { LeaseFormModal } from './lease-form-modal';
import { columns, LeaseColumn } from './columns';
import { Input } from '../ui/input';

type Tenant = {
  id_arrendatario: number;
  nombre: string;
};

type Property = {
  id_propiedad: number;
  direccion: string;
};

interface LeasesClientProps {
  data: LeaseColumn[];
  tenants: Tenant[];
  properties: Property[];
}

export const LeasesClient: React.FC<LeasesClientProps> = ({ data, tenants, properties }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const filteredData = data.filter(item => {
    const lowercasedFilter = filter.toLowerCase();
    const arrendatarioMatch = item.arrendatarioNombre?.toLowerCase().includes(lowercasedFilter);
    const propiedadMatch = item.propiedadDireccion?.toLowerCase().includes(lowercasedFilter);
    return arrendatarioMatch || propiedadMatch;
  });

  return (
    <div className="space-y-4">
      <LeaseFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
        tenants={tenants}
        properties={properties}
      />
       <div className="flex items-center justify-between">
            <Input
                placeholder="Buscar por arrendatario o propiedad..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="max-w-sm"
            />
            <Button onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Arriendo
            </Button>
       </div>
      <DataTable columns={columns({ tenants, properties })} data={filteredData} searchKey="arrendatarioNombre" />
    </div>
  );
};
