
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
    accessorKey: 'arrendatario.id_arrendatario',
    header: 'ID Arrendatario',
    cell: ({ row }) => row.original.arrendatario?.id_arrendatario || 'N/A'
  },
  {
    accessorKey: 'propiedad.id_propiedad',
    header: 'ID Propiedad',
    cell: ({ row }) => row.original.propiedad?.id_propiedad || 'N/A'
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
