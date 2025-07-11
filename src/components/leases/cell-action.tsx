
'use client';

import { useState } from 'react';
import { MoreHorizontal, Edit, Trash, Copy, PowerOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { LeaseFormModal } from './lease-form-modal';
import { LeaseColumn } from './columns';
import { inactivateLease } from '@/app/leases/actions';

type Tenant = {
  id_arrendatario: number;
  nombre: string;
};

type Property = {
  id_propiedad: number;
  direccion: string;
};

interface CellActionProps {
  data: LeaseColumn;
  tenants: Tenant[];
  properties: Property[];
}

export const CellAction: React.FC<CellActionProps> = ({ data, tenants, properties }) => {
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const onCopy = (id: number) => {
    navigator.clipboard.writeText(String(id));
    toast({ title: 'ID de Arriendo copiado al portapapeles.' });
  };

  const onInactivateConfirm = async () => {
    try {
      setLoading(true);
      const result = await inactivateLease(data.id_arriendo);
      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      } else {
        toast({ title: 'Arriendo inactivado correctamente.' });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Algo salió mal al inactivar el arriendo.',
      });
    } finally {
      setLoading(false);
      setIsAlertOpen(false);
    }
  };

  return (
    <>
      <LeaseFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={data}
        tenants={tenants}
        properties={properties}
      />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onCopy(data.id_arriendo)}>
              <Copy className="mr-2 h-4 w-4" /> Copiar ID
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsAlertOpen(true)} disabled={!data.activo}>
                <PowerOff className="mr-2 h-4 w-4" /> Inactivar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción inactivará el arriendo. No se podrá revertir fácilmente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onInactivateConfirm} disabled={loading} className="bg-destructive hover:bg-destructive/90">
              {loading ? 'Inactivando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
