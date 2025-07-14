
'use client';

import { useState, useEffect } from 'react';
import { Loader2, ExternalLink, AlertTriangle, FileText } from 'lucide-react';
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
import { getSignedUrlsForProperty } from '@/app/properties/actions';
import { PropertyColumn } from './columns';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyColumn;
}

type DocumentWithSignedUrl = {
  id_documento: number;
  nombre_documento: string;
  version: string;
  fecha_vencimiento: string;
  signedUrl: string;
};

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  property,
}) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentWithSignedUrl[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchDocuments = async () => {
        setLoading(true);
        setError(null);
        setDocuments([]);
        const result = await getSignedUrlsForProperty(property.id_propiedad);
        if (result.error) {
          setError(result.error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error,
          });
        } else {
          setDocuments(result.payload || []);
        }
        setLoading(false);
      };

      fetchDocuments();
    }
  }, [isOpen, property.id_propiedad, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Visor de Documentos</DialogTitle>
          <DialogDescription>
            Documentos asociados a la propiedad: <span className="font-semibold">{property.direccion}</span>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96 pr-4">
            <div className="space-y-4 py-4">
            {loading && (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-2 text-muted-foreground">Cargando documentos...</p>
                </div>
            )}
            {error && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-destructive">
                    <AlertTriangle className="h-8 w-8 mb-2" />
                    <p className="font-semibold">Error al cargar documentos</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}
            {!loading && !error && documents.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <FileText className="h-8 w-8 mb-2" />
                    <p>No se encontraron documentos para esta propiedad.</p>
                </div>
            )}
            {!loading && !error && documents.length > 0 && (
                <ul className="space-y-3">
                    {documents.map(doc => (
                        <li key={doc.id_documento} className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-muted/50 transition-colors">
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{doc.nombre_documento}</p>
                                <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                                    <span>Versión: <Badge variant="secondary">{doc.version}</Badge></span>
                                     {doc.fecha_vencimiento && (
                                        <span>
                                            Vence: {format(new Date(doc.fecha_vencimiento), 'dd/MM/yyyy')}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <a href={doc.signedUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Abrir
                                </Button>
                            </a>
                        </li>
                    ))}
                </ul>
            )}
            </div>
        </ScrollArea>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
