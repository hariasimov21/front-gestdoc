
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
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { createUser, updateUser } from '@/app/users/actions';
import { UserColumn } from './columns';

const createFormSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido.'),
  email: z.string().email('El correo no es válido.'),
  contrasena: z.string().min(1, 'La contraseña es requerida.'),
  rol_usuario_id: z.string().min(1, 'El rol es requerido'),
});

const updateFormSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido.'),
    email: z.string().email('El correo no es válido.'),
    rol_usuario_id: z.string().min(1, 'El rol es requerido'),
});


type Role = {
  id_rol_usuario: number;
  nombre_rol: string;
  descripcion: string;
};

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: UserColumn | null;
  roles: Role[];
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
  roles,
}) => {
  const { toast } = useToast();
  
  const isEditing = !!initialData;
  const title = isEditing ? 'Editar Usuario' : 'Crear Usuario';
  const description = isEditing ? 'Modifica los detalles del usuario.' : 'Añade un nuevo usuario al sistema.';
  const actionLabel = isEditing ? 'Guardar Cambios' : 'Crear';
  
  const formSchema = isEditing ? updateFormSchema : createFormSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditing
      ? { 
          nombre: initialData.nombre,
          email: initialData.email,
          rol_usuario_id: initialData.rol_usuario ? String(initialData.rol_usuario.id_rol_usuario) : '',
        }
      : {
          nombre: '',
          email: '',
          contrasena: '',
          rol_usuario_id: '',
        },
  });
  
  const handleClose = useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  const action = isEditing ? updateUser.bind(null, initialData.id_usuario) : createUser;
  const [state, formAction] = useActionState(action, { error: undefined });

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    } else if (state?.error === undefined && !state) {
        // This case can happen on the first render, do nothing.
    } else if (state?.error === undefined) {
      toast({ title: `Usuario ${isEditing ? 'actualizado' : 'creado'} con éxito.` });
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
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="nombre@ejemplo.com" {...field} disabled={isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isEditing && (
              <FormField
                control={form.control}
                name="contrasena"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="rol_usuario_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol de Usuario</FormLabel>
                  <FormControl>
                    <Combobox
                        options={roles.map(r => ({ value: String(r.id_rol_usuario), label: r.nombre_rol }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Seleccione un rol"
                        searchPlaceholder="Buscar rol..."
                        emptyPlaceholder="No se encontró rol."
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
