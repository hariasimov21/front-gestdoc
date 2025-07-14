
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { format, parseISO } from 'date-fns';

export type TenantColumn = {
  id_arrendatario: number;
  nombre: string;
  fecha_registro: string;
  email: string;
  rubro: string;
  rut_arrendatario: string;
};

export const columns: ColumnDef<TenantColumn>[] = [
  {
    accessorKey: 'rut_arrendatario',
    header: 'RUT',
  },
  {
    accessorKey: 'nombre',
    header: 'Nombre',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
    {
    accessorKey: 'rubro',
    header: 'Rubro',
  },
  {
    accessorKey: 'fecha_registro',
    header: 'Fecha de Registro',
    cell: ({ row }) => {
        const date = row.original.fecha_registro;
        if (!date) return 'N/A';
        try {
            return format(parseISO(date), 'dd/MM/yyyy');
        } catch (e) {
            return 'Fecha inválida'
        }
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
