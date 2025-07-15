
'use client';

import { useState } from 'react';
import { MoreHorizontal, Edit, Trash, Copy } from 'lucide-react';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { SocietyFormModal } from './society-form-modal';
import { SocietyColumn } from './columns';
import { deleteSociety } from '@/app/societies/actions';

interface CellActionProps {
  data: SocietyColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const onCopy = (id: number) => {
    navigator.clipboard.writeText(String(id));
    toast({ title: 'ID de Sociedad copiado al portapapeles.' });
  };

  const onDeleteConfirm = async () => {
    try {
      setLoading(true);
      const result = await deleteSociety(data.id_sociedad);
      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      } else {
        toast({ title: 'Sociedad eliminada correctamente.' });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Algo salió mal al eliminar la sociedad.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SocietyFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={data}
      />
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onCopy(data.id_sociedad)}>
              <Copy className="mr-2 h-4 w-4" /> Copiar ID
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>
                <Trash className="mr-2 h-4 w-4" /> Eliminar
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la sociedad y podría afectar a las propiedades asociadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteConfirm} disabled={loading} className="bg-destructive hover:bg-destructive/90">
              {loading ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
