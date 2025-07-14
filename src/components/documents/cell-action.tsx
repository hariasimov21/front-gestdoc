
'use client';

import { useState } from 'react';
import { MoreHorizontal, Edit, PowerOff, Copy, FileSearch } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DocumentFormModal } from './document-form-modal';
import { DocumentColumn } from './columns';
import { inactivateDocument } from '@/app/documents/actions';
import { DocumentPreviewModal } from './document-preview-modal';

type Property = {
  id_propiedad: number;
  direccion: string;
};

type DocumentType = {
    id_tipo_documento: number;
    nombre_tipo_documento: string;
};

interface CellActionProps {
  data: DocumentColumn;
  properties: Property[];
  documentTypes: DocumentType[];
}

export const CellAction: React.FC<CellActionProps> = ({ data, properties, documentTypes }) => {
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const onCopy = (id: number) => {
    navigator.clipboard.writeText(String(id));
    toast({ title: 'ID de Documento copiado al portapapeles.' });
  };

  const onInactivateConfirm = async () => {
    try {
      setLoading(true);
      const result = await inactivateDocument(data.id_documento);
      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      } else {
        toast({ title: 'Documento inactivado correctamente.' });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Algo salió mal al inactivar el documento.',
      });
    } finally {
      setLoading(false);
      setIsAlertOpen(false);
    }
  };

  return (
    <>
      <DocumentFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={data}
        properties={properties}
        documentTypes={documentTypes}
      />
      <DocumentPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        documentData={data}
      />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onCopy(data.id_documento)}>
              <Copy className="mr-2 h-4 w-4" /> Copiar ID
            </DropdownMenuItem>
             <DropdownMenuItem onClick={() => setIsPreviewModalOpen(true)}>
              <FileSearch className="mr-2 h-4 w-4" /> Ver
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
              <Edit className="mr-2 h-4 w-4" /> Editar / Nueva Versión
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsAlertOpen(true)} disabled={!data.estado}>
                <PowerOff className="mr-2 h-4 w-4" /> Inactivar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción inactivará el documento. No se podrá revertir fácilmente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onInactivateConfirm} disabled={loading} className="bg-destructive hover:bg-destructive/90">
              {loading ? 'Inactivando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
