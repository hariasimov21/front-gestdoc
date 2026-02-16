
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type LocalColumn = {
  id_local: number;
  nombre_local: string;
  descripcion: string;
  tipo_local: number;
  id_propiedad: number;
  nro_cliente_saesa: string;
  nro_cliente_suralis: string;
};

export type Property = {
  id_propiedad: number;
  direccion: string;
  descripcion: string;
  longitud: string;
  latitud: string;
  id_sociedad: number;
  rol_propiedad: string;
  nombre_sociedad?: string; // Add optional field
};

export const columns = (properties: Property[]): ColumnDef<LocalColumn>[] => [
  {
    accessorKey: 'id_local',
    header: 'ID',
  },
  {
    accessorKey: 'nombre_local',
    header: 'Nombre Local',
  },
  {
    accessorKey: 'descripcion',
    header: 'Descripción',
  },
  {
    accessorKey: 'tipo_local',
    header: 'Tipo Local',
  },
  {
    accessorKey: 'nro_cliente_saesa',
    header: 'Nro Cliente Saesa',
  },
  {
    accessorKey: 'nro_cliente_suralis',
    header: 'Nro Cliente Suralis',
  },
  {
    accessorKey: 'nombre_propiedad',
    header: 'Propiedad',
    cell: ({ row }) => {
      const property = properties.find(p => p.id_propiedad === row.original.id_propiedad);
      return property ? property.direccion : 'N/A';
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} properties={properties} />,
  },
];
