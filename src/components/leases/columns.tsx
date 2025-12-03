
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';

type Tenant = {
  id_arrendatario: number;
  nombre: string;
};

export type LeaseColumn = {
  id_arriendo: number;
  id_local: number | null;
  nombre_local: string;
  fecha_inicio_arriendo: string;
  fecha_fin_arriendo: string;
  activo: boolean;
  arrendatarioNombre: string;
  propiedadDireccion: string;
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


export const columns = (dependencies: { tenants: Tenant[], locals: { id_local: number; nombre_local: string }[] }): ColumnDef<LeaseColumn>[] => [
  {
    accessorKey: 'id_arriendo',
    header: 'ID Arriendo',
  },
  {
    accessorKey: 'arrendatarioNombre',
    header: 'Arrendatario',
  },
  {
    accessorKey: 'id_local',
    header: 'ID Local',
    cell: ({ row }) => row.original.id_local ?? 'N/A',
  },
  {
    accessorKey: 'nombre_local',
    header: 'Nombre Local',
  },
  {
    accessorKey: 'propiedadDireccion',
    header: 'Propiedad',
  },
    {
    accessorKey: 'fecha_inicio_arriendo',
    header: 'Fecha Inicio',
    cell: ({ row }) => formatDate(row.original.fecha_inicio_arriendo)
  },
  {
    accessorKey: 'fecha_fin_arriendo',
    header: 'Fecha Fin',
    cell: ({ row }) => formatDate(row.original.fecha_fin_arriendo)
  },
  {
    accessorKey: 'activo',
    header: 'Estado',
    cell: ({ row }) => (
       <Switch
        checked={row.original.activo}
        disabled
        aria-readonly
      />
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} tenants={dependencies.tenants} locals={dependencies.locals} />,
  },
];
