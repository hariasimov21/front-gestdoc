
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

type Property = {
  id_propiedad: number;
  direccion: string;
};

type DocumentType = {
    id_tipo_documento: number;
    nombre_tipo_documento: string;
};

export type DocumentColumn = {
  id_documento: number;
  nombre_documento: string;
  id_propiedad: number;
  propiedadDireccion: string;
  id_tipo_documento: number;
  tipoDocumentoNombre: string;
  fecha_subida: string;
  fecha_vencimiento: string;
  estado: boolean;
  version: string;
};

export const columns = (dependencies: { properties: Property[], documentTypes: DocumentType[] }): ColumnDef<DocumentColumn>[] => [
  {
    accessorKey: 'id_documento',
    header: 'ID',
  },
  {
    accessorKey: 'nombre_documento',
    header: 'Nombre Documento',
  },
  {
    accessorKey: 'propiedadDireccion',
    header: 'Propiedad',
  },
  {
    accessorKey: 'tipoDocumentoNombre',
    header: 'Tipo',
  },
  {
    accessorKey: 'fecha_subida',
    header: 'Fecha Subida',
    cell: ({ row }) => format(new Date(row.original.fecha_subida), 'dd/MM/yyyy')
  },
  {
    accessorKey: 'fecha_vencimiento',
    header: 'Fecha Vencimiento',
    cell: ({ row }) => format(new Date(row.original.fecha_vencimiento), 'dd/MM/yyyy')
  },
   {
    accessorKey: 'version',
    header: 'Versión',
  },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => (
      <Badge variant={row.original.estado ? 'default' : 'destructive'}>
        {row.original.estado ? 'Activo' : 'Inactivo'}
      </Badge>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} properties={dependencies.properties} documentTypes={dependencies.documentTypes} />,
  },
];
