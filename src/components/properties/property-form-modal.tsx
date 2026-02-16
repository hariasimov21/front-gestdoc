
'use client';

import { useEffect, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFormStatus } from 'react-dom';
import { Loader2, ExternalLink } from 'lucide-react';
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
import { createProperty, updateProperty } from '@/app/properties/actions';
import { PropertyColumn } from './columns';
import { Textarea } from '../ui/textarea';
import { Combobox } from '../ui/combobox';


const formSchema = z.object({
  direccion: z.string().min(1, 'La dirección es requerida.'),
  rol_propiedad: z.string().min(1, 'El rol de propiedad es requerido.'),
  descripcion: z.string().min(1, 'La descripción es requerida.'),
  longitud: z.string().optional(),
  latitud: z.string().optional(),
  id_sociedad: z.string().min(1, 'La sociedad es requerida.'),
});


type Society = {
    id_sociedad: number;
    nombre: string;
};

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: PropertyColumn | null;
  societies: Society[];
}

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
  societies,
}) => {
  const { toast } = useToast();
  
  const isEditing = !!initialData;
  const title = isEditing ? 'Editar Propiedad' : 'Crear Propiedad';
  const description = isEditing ? 'Modifica los detalles de la propiedad.' : 'Añade una nueva propiedad al sistema.';
  const actionLabel = isEditing ? 'Guardar Cambios' : 'Crear';

  const defaultFormValues = initialData
    ? {
        direccion: initialData.direccion ?? '',
        rol_propiedad: initialData.rol_propiedad ?? '',
        descripcion: initialData.descripcion ?? '',
        longitud: initialData.longitud ?? '',
        latitud: initialData.latitud ?? '',
        id_sociedad: String(initialData.id_sociedad ?? ''),
      }
    : {
        direccion: '',
        rol_propiedad: '',
        descripcion: '',
        longitud: '',
        latitud: '',
        id_sociedad: '',
      };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  const latitud = form.watch('latitud') ?? '';
  const longitud = form.watch('longitud') ?? '';

  const action = isEditing ? updateProperty.bind(null, initialData.id_propiedad) : createProperty;
  const [state, formAction] = useActionState(action, { error: undefined });

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    } else if (state?.success) {
      toast({ title: `Propiedad ${isEditing ? 'actualizada' : 'creada'} con éxito.` });
      handleClose();
    }
  }, [state, isEditing, toast]);


  const handleClose = () => {
    form.reset(defaultFormValues);
    onClose();
  };

  const isValidCoordinates = (lat: string, lon: string) => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    return !isNaN(latNum) && !isNaN(lonNum) && lat.length > 3 && lon.length > 3;
  }
  
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
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Av. Siempreviva 742" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rol_propiedad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol Propiedad</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 1234-56" {...field} value={field.value ?? ''} />
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
                    <Textarea placeholder="Describe la propiedad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="latitud"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Latitud</FormLabel>
                    <FormControl>
                        <Input placeholder="-33.44889" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="longitud"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Longitud</FormLabel>
                    <FormControl>
                        <Input placeholder="-70.66926" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            {isValidCoordinates(latitud, longitud) && (
                <div className="space-y-2">
                    <a href={`https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}`} target="_blank" rel="noopener noreferrer">
                        <Button type="button" variant="outline" size="sm">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Ver en Google Maps
                        </Button>
                    </a>
                    <iframe
                        width="100%"
                        height="250"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        className="rounded-md"
                        src={`https://maps.google.com/maps?q=${latitud},${longitud}&hl=es&z=14&amp;output=embed`}
                    >
                    </iframe>
                </div>
            )}

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
                            placeholder="Seleccione una sociedad"
                            searchPlaceholder="Buscar sociedad..."
                            emptyPlaceholder="No se encontró sociedad."
                        />
                   </FormControl>
                   <input type="hidden" name={field.name} value={field.value} />
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
