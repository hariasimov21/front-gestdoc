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
import { createSociety, updateSociety } from '@/app/societies/actions';
import { SocietyColumn } from './columns';

const formSchema = z.object({
  nombre: z.string().min(1, 'El nombre de la sociedad es requerido.'),
});


interface SocietyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: SocietyColumn | null;
}

export const SocietyFormModal: React.FC<SocietyFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { toast } = useToast();
  
  const isEditing = !!initialData;
  const title = isEditing ? 'Editar Sociedad' : 'Crear Sociedad';
  const description = isEditing ? 'Modifica los detalles de la sociedad.' : 'Añade una nueva sociedad al sistema.';
  const actionLabel = isEditing ? 'Guardar Cambios' : 'Crear';
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nombre: '',
    },
  });

  const action = isEditing ? updateSociety.bind(null, initialData.id_sociedad) : createSociety;
  const [state, formAction] = useActionState(action, { error: undefined });

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    } else if (state?.success) {
      toast({ title: `Sociedad ${isEditing ? 'actualizada' : 'creada'} con éxito.` });
      handleClose();
    }
  }, [state, isEditing, toast]);


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
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Sociedad</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Inmobiliaria XYZ" {...field} />
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
