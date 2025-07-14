
'use client';

import { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getSignedUrlForDocument } from '@/app/documents/actions';
import { DocumentColumn } from './columns';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentData: DocumentColumn;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  documentData,
}) => {
  const { toast } = useToast();
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchDocumentUrl = async () => {
        setLoading(true);
        setError(null);
        setSignedUrl(null);
        const result = await getSignedUrlForDocument(documentData.id_documento);
        if (result.error) {
          setError(result.error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error,
          });
        } else if (result.url) {
            setSignedUrl(result.url);
        }
        setLoading(false);
      };

      fetchDocumentUrl();
    }
  }, [isOpen, documentData.id_documento, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-4">
        <DialogHeader>
          <DialogTitle>Visor de Documento</DialogTitle>
          <DialogDescription>
            {documentData.nombre_documento}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 rounded-md border bg-card flex items-center justify-center overflow-hidden">
            {loading && (
                <div className="flex items-center justify-center h-full p-4 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mr-2" />
                    Cargando documento...
                </div>
            )}
            {error && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-destructive p-4 text-center">
                    <AlertTriangle className="h-8 w-8 mb-2" />
                    <p className="font-semibold">Error al cargar</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}
            {!loading && !error && !signedUrl && (
                 <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
                    <FileText className="h-8 w-8 mb-2" />
                    <p>No se pudo obtener el documento.</p>
                </div>
            )}
            {signedUrl && (
                <iframe
                    src={signedUrl}
                    className="w-full h-full border-0"
                    title={documentData.nombre_documento}
                />
            )}
        </div>
        <DialogFooter className="pt-4">
            <Button asChild variant="outline" disabled={!signedUrl || loading}>
                <a href={signedUrl ?? '#'} download={documentData.nombre_documento} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar
                </a>
            </Button>
            <Button type="button" onClick={onClose}>
                Cerrar
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
