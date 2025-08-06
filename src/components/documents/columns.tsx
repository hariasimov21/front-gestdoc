
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';

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
    cell: ({ row }) => formatDate(row.original.fecha_subida)
  },
  {
    accessorKey: 'fecha_vencimiento',
    header: 'Fecha Vencimiento',
    cell: ({ row }) => formatDate(row.original.fecha_vencimiento)
  },
   {
    accessorKey: 'version',
    header: 'Versión',
  },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => (
      <Switch
        checked={row.original.estado}
        disabled
        aria-readonly
      />
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} properties={dependencies.properties} documentTypes={dependencies.documentTypes} />,
  },
];
