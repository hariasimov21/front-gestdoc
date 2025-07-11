
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type DocumentTypeColumn = {
  id_tipo_documento: number;
  nombre_tipo_documento: string;
};

export const columns: ColumnDef<DocumentTypeColumn>[] = [
  {
    accessorKey: 'id_tipo_documento',
    header: 'ID',
  },
  {
    accessorKey: 'nombre_tipo_documento',
    header: 'Nombre del Tipo de Documento',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
