
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
import { Button } from '@/components/ui/button';
import { createAssociation } from '@/app/user-society/actions';
import { Combobox } from '../ui/combobox';

type User = {
  id_usuario: number;
  nombre: string;
};

type Society = {
  id_sociedad: number;
  nombre: string;
};

const formSchema = z.object({
  id_usuario: z.string().min(1, 'El usuario es requerido.'),
  id_sociedad: z.string().min(1, 'La sociedad es requerida.'),
});

interface UserSocietyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  societies: Society[];
  onSuccess: () => void;
}

export const UserSocietyFormModal: React.FC<UserSocietyFormModalProps> = ({
  isOpen,
  onClose,
  users,
  societies,
  onSuccess,
}) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_usuario: '',
      id_sociedad: '',
    },
  });

  const [state, formAction] = useActionState(createAssociation, { error: undefined });

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    } else if (state?.success) {
      toast({ title: 'Asociación creada con éxito.' });
      onSuccess();
      handleClose();
    }
  }, [state, onSuccess]);


  const handleClose = () => {
    form.reset();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asociar Usuario a Sociedad</DialogTitle>
          <DialogDescription>Selecciona un usuario y una sociedad para crear una nueva asociación.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form action={formAction} className="space-y-4">
            <FormField
              control={form.control}
              name="id_usuario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                   <FormControl>
                      <Combobox
                        options={users.map(u => ({ value: String(u.id_usuario), label: u.nombre }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Selecciona un usuario"
                        searchPlaceholder="Buscar usuario..."
                        emptyPlaceholder="No se encontraron usuarios."
                      />
                   </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id_sociedad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sociedad</FormLabel>
                   <FormControl>
                       <Combobox
                        options={societies.map(s => ({ value: String(s.id_sociedad), label: s.nombre }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Selecciona una sociedad"
                        searchPlaceholder="Buscar sociedad..."
                        emptyPlaceholder="No se encontraron sociedades."
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
              <SubmitButton label="Asociar" />
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
      {pending ? 'Asociando...' : label}
    </Button>
  );
}
