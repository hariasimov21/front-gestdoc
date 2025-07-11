
'use client';

import { useEffect, useActionState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFormStatus } from 'react-dom';
import { Loader2, CalendarIcon, FileUp } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Combobox } from '../ui/combobox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { createDocument, updateDocument } from '@/app/documents/actions';
import { DocumentColumn } from './columns';

type Property = {
  id_propiedad: number;
  direccion: string;
};

type DocumentType = {
    id_tipo_documento: number;
    nombre_tipo_documento: string;
};

const formSchema = z.object({
  nombre_documento: z.string().min(1, 'El nombre es requerido.'),
  id_propiedad: z.string().min(1, 'La propiedad es requerida.'),
  id_tipo_documento: z.string().min(1, 'El tipo de documento es requerido.'),
  fecha_vencimiento: z.date({ required_error: 'La fecha de vencimiento es requerida.' }),
  file: z.any().refine((files) => files?.length > 0 || files instanceof File, 'El archivo es requerido.').optional(),
});


interface DocumentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: DocumentColumn | null;
  properties: Property[];
  documentTypes: DocumentType[];
}

export const DocumentFormModal: React.FC<DocumentFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
  properties,
  documentTypes
}) => {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const isEditing = !!initialData;
  const title = isEditing ? 'Editar Documento' : 'Subir Documento';
  const description = isEditing ? 'Actualiza los detalles del documento o sube una nueva versión.' : 'Añade un nuevo documento al sistema.';
  const actionLabel = isEditing ? 'Guardar Cambios' : 'Subir';
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? { 
        nombre_documento: initialData.nombre_documento,
        id_propiedad: String(initialData.id_propiedad),
        id_tipo_documento: String(initialData.id_tipo_documento),
        fecha_vencimiento: parseISO(initialData.fecha_vencimiento),
        file: undefined,
     } : {
      nombre_documento: '',
      id_propiedad: '',
      id_tipo_documento: '',
      fecha_vencimiento: undefined,
      file: undefined,
    },
  });

  const action = isEditing ? updateDocument : createDocument;
  const [state, formAction] = useActionState(action, { error: undefined });

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    } else if (state?.success) {
      toast({ title: `Documento ${isEditing ? 'actualizado' : 'creado'} con éxito.` });
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
          <form 
            ref={formRef}
            action={formAction} 
            className="space-y-4"
          >
            {isEditing && <input type="hidden" name="id_documento" value={initialData.id_documento} />}
            <FormField
              control={form.control}
              name="nombre_documento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Documento</FormLabel>
                   <FormControl>
                    <Input placeholder="Ej: Contrato de arriendo 2024" {...field} />
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id_tipo_documento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Documento</FormLabel>
                   <FormControl>
                      <Combobox
                        options={documentTypes.map(p => ({ value: String(p.id_tipo_documento), label: p.nombre_tipo_documento }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Seleccione un tipo"
                        searchPlaceholder="Buscar tipo..."
                        emptyPlaceholder="No se encontró tipo."
                      />
                   </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fecha_vencimiento"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Vencimiento</FormLabel>
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
                name="file"
                render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                        <FormLabel>Archivo {isEditing && '(Opcional: subir nueva versión)'}</FormLabel>
                        <FormControl>
                            <Input 
                                type="file" 
                                {...rest} 
                                onChange={(event) => {
                                    onChange(event.target.files && event.target.files[0]);
                                }}
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
      {pending ? <Loader2 className="animate-spin mr-2" /> : <FileUp className="mr-2" />}
      {pending ? 'Procesando...' : label}
    </Button>
  );
}
