
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

type Tenant = {
  id_arrendatario: number;
  nombre: string;
};

type Property = {
  id_propiedad: number;
  direccion: string;
};

export type LeaseColumn = {
  id_arriendo: number;
  id_arrendatario?: number; // Add optional top-level ID
  id_propiedad?: number;   // Add optional top-level ID
  fecha_inicio_arriendo: string;
  fecha_fin_arriendo: string;
  activo: boolean;
  arrendatario: Tenant;
  propiedad: Property;
  arrendatarioNombre: string;
  propiedadDireccion: string;
};


export const columns = (dependencies: { tenants: Tenant[], properties: Property[] }): ColumnDef<LeaseColumn>[] => [
  {
    accessorKey: 'id_arriendo',
    header: 'ID Arriendo',
  },
  {
    accessorKey: 'arrendatarioNombre',
    header: 'Arrendatario',
  },
  {
    accessorKey: 'propiedadDireccion',
    header: 'Propiedad',
  },
    {
    accessorKey: 'fecha_inicio_arriendo',
    header: 'Fecha Inicio',
    cell: ({ row }) => format(new Date(row.original.fecha_inicio_arriendo), 'dd/MM/yyyy')
  },
  {
    accessorKey: 'fecha_fin_arriendo',
    header: 'Fecha Fin',
    cell: ({ row }) => format(new Date(row.original.fecha_fin_arriendo), 'dd/MM/yyyy')
  },
  {
    accessorKey: 'activo',
    header: 'Estado',
    cell: ({ row }) => (
      <Badge variant={row.original.activo ? 'default' : 'destructive'}>
        {row.original.activo ? 'Activo' : 'Inactivo'}
      </Badge>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} tenants={dependencies.tenants} properties={dependencies.properties} />,
  },
];
