
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { format } from 'date-fns';

export type TenantColumn = {
  id_arrendatario: number;
  nombre: string;
  fecha_registro: string;
  email: string;
  rubro: string;
  rut_arrendatario: string;
};

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
        // Create date in a way that avoids timezone shifts for date-only strings
        const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return format(date, 'dd/MM/yyyy');
    } catch (e) {
        return 'Fecha inválida';
    }
}

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
    cell: ({ row }) => formatDate(row.original.fecha_registro)
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
