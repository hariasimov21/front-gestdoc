
'use client';

import { useState, useTransition, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserSocietyFormModal } from './user-society-form-modal';
import { useToast } from '@/hooks/use-toast';
import { DataTable } from '../ui/data-table';
import { columns, AssociationColumn } from './columns';
import { deleteAssociation, getAllAssociations } from '@/app/user-society/actions';
import { Input } from '../ui/input';

type User = {
  id_usuario: number;
  nombre: string;
};

type Society = {
  id_sociedad: number;
  nombre:string;
};

interface UserSocietyClientProps {
  users: User[];
  societies: Society[];
}

export const UserSocietyClient: React.FC<UserSocietyClientProps> = ({ users, societies }) => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [associations, setAssociations] = useState<AssociationColumn[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const fetchAssociations = () => {
    startTransition(async () => {
        const result = await getAllAssociations();
         if (result.error) {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
            setAssociations([]);
        } else {
            setAssociations(result.payload || []);
        }
    });
  }

  useEffect(() => {
    fetchAssociations();
  }, []);

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    const result = await deleteAssociation(id);
    if (result.error) {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
    } else {
        toast({ title: 'Asociación eliminada' });
        fetchAssociations(); // Refetch data to update the table
    }
    setIsDeleting(null);
  };
  
  const filteredData = associations.filter(item => 
    item.nombre_usuario.toLowerCase().includes(globalFilter.toLowerCase()) ||
    item.nombre_sociedad.toLowerCase().includes(globalFilter.toLowerCase())
  );

  const tableColumns = columns({ onDelete: handleDelete, isDeleting });

  return (
    <div className="space-y-4">
      <UserSocietyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={users}
        societies={societies}
        onSuccess={fetchAssociations}
      />
      <div className="flex items-center justify-between">
         <div className="flex flex-1 items-center space-x-2">
            <Input
                placeholder="Buscar por usuario o sociedad..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="h-9 max-w-sm"
            />
         </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Asociar
        </Button>
      </div>
      
      <DataTable 
        columns={tableColumns} 
        data={filteredData}
        rowIdKey="id_usuario_sociedad"
      />

    </div>
  );
};
