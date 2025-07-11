
'use client';

import { useEffect, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createDocumentType } from '@/app/document-types/actions';

const formSchema = z.object({
  nombre_tipo_documento: z.string().min(1, 'El nombre del tipo de documento es requerido.'),
});

interface DocumentTypeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentTypeFormModal: React.FC<DocumentTypeFormModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  
  const title = 'Crear Tipo de Documento';
  const description = 'Añade un nuevo tipo de documento al sistema.';
  const actionLabel = 'Crear';
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre_tipo_documento: '',
    },
  });

  const [state, formAction] = useActionState(createDocumentType, { error: undefined });

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    } else if (state?.success) {
      toast({ title: 'Tipo de documento creado con éxito.' });
      handleClose();
    }
  }, [state, toast]);


  const handleClose = () => {
    form.reset();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form action={formAction} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre_tipo_documento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Tipo de Documento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Contrato de Arriendo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <SubmitButton label={actionLabel} />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin mr-2" /> : null}
      {pending ? 'Guardando...' : label}
    </Button>
  );
}
