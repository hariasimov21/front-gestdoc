
'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '../ui/button';
import { LeaseFormModal } from './lease-form-modal';
import { columns, LeaseColumn } from './columns';

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

  return (
    <div className="space-y-4">
      <LeaseFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
        tenants={tenants}
        properties={properties}
      />
      <DataTable 
        columns={columns({ tenants, properties })} 
        data={data} 
        searchKey="arrendatarioNombre"
        searchPlaceholder="Buscar por arrendatario o propiedad..."
      >
        <Button onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Arriendo
        </Button>
      </DataTable>
    </div>
  );
};
