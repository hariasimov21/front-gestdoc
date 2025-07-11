'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Badge } from '@/components/ui/badge';

export type UserColumn = {
  id_usuario: number;
  nombre: string;
  email: string;
  rol_usuario: {
    id_rol_usuario: number;
    nombre_rol: string;
  };
};

type Role = {
  id_rol_usuario: number;
  nombre_rol: string;
  descripcion: string;
};

export const columns = (roles: Role[]): ColumnDef<UserColumn>[] => [
  {
    accessorKey: 'id_usuario',
    header: 'ID',
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
    accessorKey: 'rol_usuario',
    header: 'Rol',
    cell: ({ row }) => {
      const roleName = row.original.rol_usuario?.nombre_rol;
      return <Badge variant={roleName === 'Administrador' ? 'default' : 'secondary'}>{roleName || 'N/A'}</Badge>;
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} roles={roles} />,
  },
];
