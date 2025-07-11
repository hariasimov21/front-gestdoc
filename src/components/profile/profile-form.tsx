
'use client';

import { useEffect, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { updateProfile } from '@/app/profile/actions';

type User = {
  id_usuario: number;
  nombre: string;
  email: string;
};

const formSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido.'),
  email: z.string().email('El correo no es válido.'),
  contrasena: z.string().optional(),
  confirmar_contrasena: z.string().optional(),
}).refine(data => {
    if (data.contrasena && data.contrasena.length < 1) return false;
    return data.contrasena === data.confirmar_contrasena;
}, {
  message: "Las contraseñas no coinciden o están vacías",
  path: ["confirmar_contrasena"],
});

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { toast } = useToast();
  
  const action = updateProfile.bind(null, user.id_usuario);
  const [state, formAction] = useActionState(action, undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: user.nombre || '',
      email: user.email || '',
      contrasena: '',
      confirmar_contrasena: '',
    },
  });

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
    if (state?.success) {
      toast({
        title: 'Éxito',
        description: 'Tu perfil ha sido actualizado correctamente.',
      });
      form.reset({
        ...form.getValues(),
        contrasena: '',
        confirmar_contrasena: '',
      });
    }
  }, [state, toast, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información General</CardTitle>
        <CardDescription>
          Estos son los detalles de tu cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction} className="space-y-8">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre" {...field} />
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
                    <Input placeholder="Tu email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Separator />

            <div>
                <h3 className="text-lg font-medium">Contraseña</h3>
                <p className="text-sm text-muted-foreground">
                    Deja los campos en blanco si no quieres cambiar tu contraseña.
                </p>
            </div>

            <FormField
              control={form.control}
              name="contrasena"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmar_contrasena"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <SubmitButton />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : 'Guardar Cambios'}
    </Button>
  );
}
