
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
  nombre_sociedad?: string; // Add optional field
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
    accessorKey: 'nombre_sociedad',
    header: 'Sociedad',
    cell: ({ row }) => {
      const society = societies.find(s => s.id_sociedad === row.original.id_sociedad);
      return society ? society.nombre : 'N/A';
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} societies={societies} />,
  },
];
