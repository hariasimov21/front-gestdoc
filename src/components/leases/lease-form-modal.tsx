
'use client';

import { useEffect, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFormStatus } from 'react-dom';
import { Loader2, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';

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
import { Combobox } from '../ui/combobox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { createLease, updateLease } from '@/app/leases/actions';
import { LeaseColumn } from './columns';

type Tenant = {
  id_arrendatario: number;
  nombre: string;
};

type Property = {
  id_propiedad: number;
  direccion: string;
};

const formSchema = z.object({
  id_arrendatario: z.string().min(1, 'El arrendatario es requerido.'),
  id_propiedad: z.string().min(1, 'La propiedad es requerida.'),
  fecha_inicio_arriendo: z.date({ required_error: 'La fecha de inicio es requerida.' }),
  fecha_fin_arriendo: z.date({ required_error: 'La fecha de fin es requerida.' }),
});

interface LeaseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: LeaseColumn | null;
  tenants: Tenant[];
  properties: Property[];
}

export const LeaseFormModal: React.FC<LeaseFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
  tenants,
  properties
}) => {
  const { toast } = useToast();
  
  const isEditing = !!initialData;
  const title = isEditing ? 'Editar Arriendo' : 'Crear Arriendo';
  const description = isEditing ? 'Modifica los detalles del arriendo.' : 'Añade un nuevo arriendo al sistema.';
  const actionLabel = isEditing ? 'Guardar Cambios' : 'Crear';
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? { 
        id_arrendatario: String(initialData.arrendatario?.id_arrendatario || ''),
        id_propiedad: String(initialData.propiedad?.id_propiedad || ''),
        fecha_inicio_arriendo: initialData.fecha_inicio_arriendo ? parseISO(initialData.fecha_inicio_arriendo) : undefined,
        fecha_fin_arriendo: initialData.fecha_fin_arriendo ? parseISO(initialData.fecha_fin_arriendo) : undefined,
     } : {
      id_arrendatario: '',
      id_propiedad: '',
      fecha_inicio_arriendo: undefined,
      fecha_fin_arriendo: undefined,
    },
  });

  const action = isEditing ? updateLease.bind(null, initialData.id_arriendo) : createLease;
  const [state, formAction] = useActionState(action, { error: undefined });

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    } else if (state?.success) {
      toast({ title: `Arriendo ${isEditing ? 'actualizado' : 'creado'} con éxito.` });
      handleClose();
    }
  }, [state]);


  const handleClose = () => {
    form.reset();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form action={formAction} className="space-y-4">
            <FormField
              control={form.control}
              name="id_arrendatario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arrendatario</FormLabel>
                   <FormControl>
                     <Combobox
                        options={tenants.map(t => ({ value: String(t.id_arrendatario), label: t.nombre }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Seleccione un arrendatario"
                        searchPlaceholder="Buscar arrendatario..."
                        emptyPlaceholder="No se encontró arrendatario."
                        disabled={isEditing}
                     />
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
                        disabled={isEditing}
                      />
                   </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fecha_inicio_arriendo"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Inicio</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Selecciona una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
              control={form.control}
              name="fecha_fin_arriendo"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Fin</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Selecciona una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
