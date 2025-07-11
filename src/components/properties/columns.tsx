'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type PropertyColumn = {
  id_propiedad: number;
  direccion: string;
  descripcion: string;
  longitud: string;
  latitud: string;
  id_sociedad: number;
};

type Society = {
    id_sociedad: number;
    nombre: string;
};

export const columns = (societies: Society[]): ColumnDef<PropertyColumn>[] => [
  {
    accessorKey: 'id_propiedad',
    header: 'ID',
  },
  {
    accessorKey: 'direccion',
    header: 'Dirección',
  },
  {
    accessorKey: 'descripcion',
    header: 'Descripción',
  },
    {
    accessorKey: 'longitud',
    header: 'Longitud',
  },
  {
    accessorKey: 'latitud',
    header: 'Latitud',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} societies={societies} />,
  },
];
