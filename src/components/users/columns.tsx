
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

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
      const role = row.original.rol_usuario;
      const roleName = role?.nombre_rol;
      const roleId = role?.id_rol_usuario;

      if (!roleName || !roleId) {
        return <Badge variant="secondary">N/A</Badge>;
      }

      return (
        <Link href={`/roles?highlight=${roleId}`}>
            <Badge 
                variant={roleName === 'Administrador' ? 'default' : 'secondary'}
                className="hover:ring-2 hover:ring-ring hover:ring-offset-2 transition-all"
            >
                {roleName}
            </Badge>
        </Link>
      );
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
