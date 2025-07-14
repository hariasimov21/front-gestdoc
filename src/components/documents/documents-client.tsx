
'use client';

import { useState } from 'react';
import { PlusCircle, Calendar as CalendarIcon, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, parseISO } from 'date-fns';

import { DataTable } from '@/components/ui/data-table';
import { Button } from '../ui/button';
import { DocumentFormModal } from './document-form-modal';
import { columns, DocumentColumn } from './columns';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

type Property = {
  id_propiedad: number;
  direccion: string;
};

type DocumentType = {
    id_tipo_documento: number;
    nombre_tipo_documento: string;
};

interface DocumentsClientProps {
  data: DocumentColumn[];
  properties: Property[];
  documentTypes: DocumentType[];
}

export const DocumentsClient: React.FC<DocumentsClientProps> = ({ data, properties, documentTypes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filteredData = data.filter(item => {
    const textMatch = 
      item.nombre_documento.toLowerCase().includes(filter.toLowerCase()) ||
      item.propiedadDireccion.toLowerCase().includes(filter.toLowerCase()) ||
      item.tipoDocumentoNombre.toLowerCase().includes(filter.toLowerCase());

    if (!dateRange?.from) {
      return textMatch;
    }

    try {
      const uploadDate = parseISO(item.fecha_subida);
      const from = dateRange.from;
      // Set to the end of the day
      const to = dateRange.to ? new Date(dateRange.to.setHours(23, 59, 59, 999)) : from;

      const dateMatch = uploadDate >= from && uploadDate <= to;
      return textMatch && dateMatch;
    } catch(e) {
      // If date is invalid, don't filter it out by date
      return textMatch;
    }
  });

  const clearFilters = () => {
    setFilter('');
    setDateRange(undefined);
  }

  return (
    <div className="space-y-4">
      <DocumentFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
        properties={properties}
        documentTypes={documentTypes}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
         <div className="flex flex-wrap items-center gap-2">
            <Input
                placeholder="Buscar por nombre, propiedad o tipo..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="max-w-sm"
            />
             <Popover>
                <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                    "w-[260px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                    dateRange.to ? (
                        <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                        </>
                    ) : (
                        format(dateRange.from, "LLL dd, y")
                    )
                    ) : (
                    <span>Selecciona un rango</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                />
                </PopoverContent>
            </Popover>
            <Button variant="ghost" onClick={clearFilters} className="h-9 px-3">
              <X className="mr-2 h-4 w-4" />
              Limpiar
            </Button>
         </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Subir Documento
        </Button>
      </div>
      <DataTable columns={columns({ properties, documentTypes })} data={filteredData} searchKey="nombre_documento" />
    </div>
  );
};
