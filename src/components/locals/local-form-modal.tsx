
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
import { createLocal, updateLocal } from '@/app/locales/actions';
import { LocalColumn } from './columns';
import { Textarea } from '../ui/textarea';
import { Combobox } from '../ui/combobox';

const formSchema = z.object({
  nombre_local: z.string().min(1, 'El nombre del local es requerido.'),
  descripcion: z.string().min(1, 'La descripción es requerida.'),
  tipo_local: z.string().min(1, 'El tipo de local es requerido.'),
  id_propiedad: z.string().min(1, 'La propiedad es requerida.'),
  nro_cliente_saesa: z.string().optional(),
  nro_cliente_suralis: z.string().optional(),
});

type Property = {
  id_propiedad: number;
  direccion: string;
};

interface LocalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: LocalColumn | null;
  properties: Property[];
}

export const LocalFormModal: React.FC<LocalFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
  properties,
}) => {
  const { toast } = useToast();

  const isEditing = !!initialData;
  const title = isEditing ? 'Editar Local' : 'Crear Local';
  const description = isEditing ? 'Modifica los detalles del local.' : 'Añade un nuevo local al sistema.';
  const actionLabel = isEditing ? 'Guardar Cambios' : 'Crear';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          id_propiedad: String(initialData.id_propiedad),
          tipo_local: String(initialData.tipo_local),
          nro_cliente_saesa: initialData.nro_cliente_saesa || '',
          nro_cliente_suralis: initialData.nro_cliente_suralis || '',
        }
      : {
          nombre_local: '',
          descripcion: '',
          tipo_local: '',
          id_propiedad: '',
          nro_cliente_saesa: '',
          nro_cliente_suralis: '',
        },
  });

  const action = isEditing ? updateLocal.bind(null, initialData.id_local) : createLocal;
  const [state, formAction] = useActionState(action, { error: undefined });

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    } else if (state?.success) {
      toast({ title: `Local ${isEditing ? 'actualizado' : 'creado'} con éxito.` });
      handleClose();
    }
  }, [state, isEditing, toast]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form action={formAction} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre_local"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Local 101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe el local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipo_local"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Local</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ej: 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="id_propiedad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Propiedad</FormLabel>
                    <FormControl>
                      <Combobox
                        options={properties.map(p => ({ value: String(p.id_propiedad), label: p.direccion }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Seleccione una propiedad"
                        searchPlaceholder="Buscar propiedad..."
                        emptyPlaceholder="No se encontró propiedad."
                      />
                    </FormControl>
                    <input type="hidden" name={field.name} value={field.value} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nro_cliente_saesa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nro Cliente Saesa</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nro_cliente_suralis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nro Cliente Suralis</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 654321" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
