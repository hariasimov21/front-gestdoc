
'use client';

import { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, FileText, ChevronRight, Download } from 'lucide-react';
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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getSignedUrlsForProperty } from '@/app/properties/actions';
import { PropertyColumn } from './columns';
import { format } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

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
  const [selectedDocument, setSelectedDocument] = useState<DocumentWithSignedUrl | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchDocuments = async () => {
        setLoading(true);
        setError(null);
        setDocuments([]);
        setSelectedDocument(null);
        const result = await getSignedUrlsForProperty(property.id_propiedad);
        if (result.error) {
          setError(result.error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error,
          });
        } else {
            const fetchedDocs = result.payload || [];
            setDocuments(fetchedDocs);
            if (fetchedDocs.length > 0) {
                setSelectedDocument(fetchedDocs[0]);
            }
        }
        setLoading(false);
      };

      fetchDocuments();
    }
  }, [isOpen, property.id_propiedad, toast]);
  
  const handleSelectDocument = (doc: DocumentWithSignedUrl) => {
    setSelectedDocument(doc);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-none w-[95vw] h-[95vh] flex flex-col p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Visor de Documentos</DialogTitle>
          <DialogDescription>
            Propiedad: <span className="font-semibold">{property.direccion}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 flex-1 min-h-0">
            <Card className="md:col-span-1 h-full flex flex-col">
                 <CardHeader className="p-4">
                    <h3 className="text-lg font-semibold">Documentos</h3>
                </CardHeader>
                <Separator />
                <ScrollArea className="flex-1">
                    <div className="p-2">
                    {loading && (
                        <div className="flex items-center justify-center h-full p-4">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    )}
                     {error && !loading && (
                        <div className="flex flex-col items-center justify-center h-full text-destructive p-4 text-center">
                            <AlertTriangle className="h-8 w-8 mb-2" />
                            <p className="font-semibold">Error al cargar</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                    {!loading && !error && documents.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
                            <FileText className="h-8 w-8 mb-2" />
                            <p>No se encontraron documentos.</p>
                        </div>
                    )}
                    {!loading && !error && documents.length > 0 && (
                        <ul className="space-y-1">
                            {documents.map(doc => (
                                <li key={doc.id_documento}>
                                    <button
                                        onClick={() => handleSelectDocument(doc)}
                                        className={cn(
                                            "w-full text-left p-2 rounded-md hover:bg-muted transition-colors flex items-center justify-between",
                                            selectedDocument?.id_documento === doc.id_documento && "bg-muted"
                                        )}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate text-sm">{doc.nombre_documento}</p>
                                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                                <span>V{doc.version}</span>
                                                {doc.fecha_vencimiento && (
                                                    <span>
                                                        Vence: {format(new Date(doc.fecha_vencimiento), 'dd/MM/yy')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground ml-2"/>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    </div>
                </ScrollArea>
            </Card>

            <div className="md:col-span-3 h-full rounded-md border bg-card flex items-center justify-center">
                {selectedDocument ? (
                     <iframe
                        src={selectedDocument.signedUrl}
                        className="w-full h-full border-0"
                        title={selectedDocument.nombre_documento}
                    />
                ) : (
                    <div className="text-muted-foreground">
                        {loading ? 'Cargando...' : 'Selecciona un documento para visualizarlo.'}
                    </div>
                )}
            </div>
        </div>
        <DialogFooter className="p-4 border-t">
            <Button asChild variant="outline" disabled={!selectedDocument}>
                <a href={selectedDocument?.signedUrl} download={selectedDocument?.nombre_documento} target="_blank" rel="noopener noreferrer">
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
