'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type RoleColumn = {
  id_rol_usuario: number;
  nombre_rol: string;
  descripcion: string;
};

export const columns: ColumnDef<RoleColumn>[] = [
  {
    accessorKey: 'id_rol_usuario',
    header: 'ID',
  },
  {
    accessorKey: 'nombre_rol',
    header: 'Nombre del Rol',
  },
  {
    accessorKey: 'descripcion',
    header: 'Descripción',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
