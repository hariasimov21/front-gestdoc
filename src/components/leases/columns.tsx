
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { format, parseISO } from 'date-fns';
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
  arrendatarioNombre: string;
  propiedadDireccion: string;
  // The following are needed for the edit modal to pre-populate.
  // We can't get them from the new API response directly.
  id_arrendatario?: number; 
  id_propiedad?: number;
  arrendatario?: Tenant;
  propiedad?: Property;
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
    cell: ({ row }) => {
        const date = row.original.fecha_inicio_arriendo;
        if (!date) return 'N/A';
        try {
            return format(parseISO(date), 'dd/MM/yyyy');
        } catch (e) {
            return 'Fecha inválida';
        }
    }
  },
  {
    accessorKey: 'fecha_fin_arriendo',
    header: 'Fecha Fin',
    cell: ({ row }) => {
        const date = row.original.fecha_fin_arriendo;
        if (!date) return 'N/A';
        try {
            return format(parseISO(date), 'dd/MM/yyyy');
        } catch (e) {
            return 'Fecha inválida';
        }
    }
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
