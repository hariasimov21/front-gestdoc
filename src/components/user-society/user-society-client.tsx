
'use client';

import { useState, useTransition, useEffect } from 'react';
import { PlusCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserSocietyFormModal } from './user-society-form-modal';
import { useToast } from '@/hooks/use-toast';
import { DataTable } from '../ui/data-table';
import { columns, AssociatedUser } from './columns';
import { deleteAssociation, getUsersForSociety } from '@/app/user-society/actions';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Combobox } from '../ui/combobox';

type User = {
  id_usuario: number;
  nombre: string;
};

type Society = {
  id_sociedad: number;
  nombre: string;
};

interface UserSocietyClientProps {
  allUsers: User[];
  allSocieties: Society[];
}

export const UserSocietyClient: React.FC<UserSocietyClientProps> = ({ allUsers, allSocieties }) => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  
  const [selectedSocietyId, setSelectedSocietyId] = useState<string>('');
  const [associatedUsers, setAssociatedUsers] = useState<AssociatedUser[]>([]);

  const fetchAssociatedUsers = (sociedadId: number) => {
    if (!sociedadId) {
        setAssociatedUsers([]);
        return;
    }
    startTransition(async () => {
        const result = await getUsersForSociety(sociedadId);
        if (result.error) {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
            setAssociatedUsers([]);
        } else {
            setAssociatedUsers(result.payload || []);
        }
    });
  }

  useEffect(() => {
    if (selectedSocietyId) {
      fetchAssociatedUsers(parseInt(selectedSocietyId, 10));
    } else {
      setAssociatedUsers([]);
    }
  }, [selectedSocietyId]);

  const handleDelete = async (id_usuario: number) => {
    if (!selectedSocietyId) return;
    
    setIsDeleting(id_usuario);
    const result = await deleteAssociation(id_usuario, parseInt(selectedSocietyId, 10));
    if (result.error) {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
    } else {
        toast({ title: 'Asociación eliminada' });
        fetchAssociatedUsers(parseInt(selectedSocietyId, 10));
    }
    setIsDeleting(null);
  };
  
  const handleSuccess = () => {
    if(selectedSocietyId) {
      fetchAssociatedUsers(parseInt(selectedSocietyId, 10));
    }
  }

  const tableColumns = columns({ onDelete: handleDelete, isDeleting });

  return (
    <div className="space-y-4">
      <UserSocietyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={allUsers}
        societies={allSocieties}
        onSuccess={handleSuccess}
        initialSocietyId={selectedSocietyId}
      />
      
      <Card>
        <CardHeader>
            <CardTitle>Seleccionar Sociedad</CardTitle>
             <div className="flex w-full max-w-sm items-center space-x-2 pt-4">
                <Combobox
                    options={allSocieties.map(s => ({ value: String(s.id_sociedad), label: s.nombre }))}
                    value={selectedSocietyId}
                    onChange={setSelectedSocietyId}
                    placeholder="Selecciona una sociedad"
                    searchPlaceholder="Buscar sociedad..."
                    emptyPlaceholder="No se encontraron sociedades."
                />
            </div>
        </CardHeader>
        <CardContent>
            {selectedSocietyId && (
                <div>
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                           <Users className="h-5 w-5 text-muted-foreground" />
                           <h3 className="text-lg font-medium">
                                Usuarios Asociados
                           </h3>
                        </div>
                        <Button onClick={() => setIsModalOpen(true)} size="sm">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Asociar Usuario
                        </Button>
                    </div>
                    <Card>
                        <CardContent className="p-4">
                            <DataTable 
                                columns={tableColumns} 
                                data={associatedUsers}
                                rowIdKey="id_usuario"
                            />
                        </CardContent>
                    </Card>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
};
