'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash, Loader2 } from 'lucide-react';
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


export type AssociationColumn = {
  id_usuario_sociedad: number;
  nombre_usuario: string;
  nombre_sociedad: string;
};

interface CellActionProps {
  data: AssociationColumn;
  onDelete: (id: number) => void;
  isDeleting: number | null;
}

const CellAction: React.FC<CellActionProps> = ({ data, onDelete, isDeleting }) => {
    return (
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
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem>
                            <Trash className="mr-2 h-4 w-4" /> Eliminar
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción desasociará al usuario de la sociedad. No se puede deshacer.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting === data.id_usuario_sociedad}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={() => onDelete(data.id_usuario_sociedad)} 
                        className="bg-destructive hover:bg-destructive/90"
                        disabled={isDeleting === data.id_usuario_sociedad}
                    >
                         {isDeleting === data.id_usuario_sociedad ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Desasociar'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export const columns = (
    { onDelete, isDeleting }: { onDelete: (id: number) => void, isDeleting: number | null }
): ColumnDef<AssociationColumn>[] => [
  {
    accessorKey: 'id_usuario_sociedad',
    header: 'ID',
  },
  {
    accessorKey: 'nombre_usuario',
    header: 'Usuario',
  },
  {
    accessorKey: 'nombre_sociedad',
    header: 'Sociedad',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} onDelete={onDelete} isDeleting={isDeleting} />,
  },
];
