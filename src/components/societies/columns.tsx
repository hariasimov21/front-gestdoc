'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type SocietyColumn = {
  id_sociedad: number;
  nombre: string;
};

export const columns: ColumnDef<SocietyColumn>[] = [
  {
    accessorKey: 'id_sociedad',
    header: 'ID',
  },
  {
    accessorKey: 'nombre',
    header: 'Nombre de la Sociedad',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
