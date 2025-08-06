'use client';

import { useEffect, useActionState, useCallback } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createRole, updateRole } from '@/app/roles/actions';

const formSchema = z.object({
  nombre: z.string().min(1, 'El nombre del rol es requerido.'),
  descripcion: z.string().min(1, 'La descripción es requerida.'),
});

type RoleFormValues = z.infer<typeof formSchema>;

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    id_rol_usuario: number;
    nombre_rol: string;
    descripcion: string;
  } | null;
}

export const RoleFormModal: React.FC<RoleFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { toast } = useToast();
  
  const isEditing = !!initialData;
  const title = isEditing ? 'Editar Rol' : 'Crear Rol';
  const description = isEditing ? 'Modifica los detalles del rol.' : 'Añade un nuevo rol al sistema.';
  const actionLabel = isEditing ? 'Guardar Cambios' : 'Crear';

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleClose = useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          nombre: initialData.nombre_rol || '',
          descripcion: initialData.descripcion || '',
        });
      } else {
        form.reset({
          nombre: '',
          descripcion: '',
        });
      }
    }
  }, [isOpen, initialData, form]);

  const action = isEditing ? updateRole.bind(null, initialData.id_rol_usuario) : createRole;
  const [state, formAction] = useActionState(action, undefined);

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    } else if (state?.success) {
        toast({ title: `Rol ${isEditing ? 'actualizado' : 'creado'} con éxito.` });
        handleClose();
    }
  }, [state, isEditing, toast, handleClose]);

  
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
                  <FormLabel>Nombre del Rol</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Administrador" {...field} />
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
                    <Textarea
                      placeholder="Describe el propósito de este rol"
                      {...field}
                    />
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
