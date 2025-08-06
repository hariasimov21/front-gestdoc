
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { format, parseISO } from 'date-fns';
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
    cell: ({ row }) => {
        const date = row.original.fecha_subida;
        if (!date) return 'N/A';
        try {
            return format(parseISO(date), 'dd/MM/yyyy');
        } catch (e) {
            return 'Fecha inválida';
        }
    }
  },
  {
    accessorKey: 'fecha_vencimiento',
    header: 'Fecha Vencimiento',
    cell: ({ row }) => {
        const date = row.original.fecha_vencimiento;
        if (!date) return 'N/A';
        try {
            return format(parseISO(date), 'dd/MM/yyyy');
        } catch (e) {
            return 'Fecha inválida';
        }
    }
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
