
'use client';

import { useState } from 'react';
import { MoreHorizontal, Edit, Copy, PowerOff } from 'lucide-react';
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
import { inactivateLease, reactivateLease } from '@/app/arriendos/actions';

type Tenant = {
  id_arrendatario: number;
  nombre: string;
};

type Local = {
  id_local: number;
  nombre_local: string;
  id_propiedad: number;
};

type Property = {
  id_propiedad: number;
  direccion: string;
};

interface CellActionProps {
  data: LeaseColumn;
  tenants: Tenant[];
  locals: Local[];
  properties: Property[];
}

export const CellAction: React.FC<CellActionProps> = ({ data, tenants, locals, properties }) => {
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
      const result = await (data.activo ? inactivateLease : reactivateLease)(data.id_arriendo);
      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      } else {
        toast({ title: data.activo ? 'Arriendo inactivado correctamente.' : 'Arriendo reactivado correctamente.' });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo cambiar el estado del arriendo.',
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
        locals={locals}
        properties={properties}
      />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-auto p-2">
              <span className="sr-only">Abrir menú</span>
              <span className="hidden md:inline mr-2">Acciones</span>
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
            <DropdownMenuItem onClick={() => setIsAlertOpen(true)}>
                <PowerOff className="mr-2 h-4 w-4" /> {data.activo ? 'Inactivar' : 'Reactivar'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              {data.activo ? 'El arriendo pasará al historial de inactivos. Podrás reactivarlo si el local está disponible.' : 'El arriendo volverá a estar activo si el local no tiene otro arriendo activo.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onInactivateConfirm} disabled={loading} className="bg-destructive hover:bg-destructive/90">
              {loading ? 'Guardando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
