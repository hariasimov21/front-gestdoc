
'use client';

import { useState } from 'react';
import { PlusCircle, Calendar as CalendarIcon, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, parseISO, startOfDay, endOfDay } from 'date-fns';

import { DataTable } from '@/components/ui/data-table';
import { Button } from '../ui/button';
import { DocumentFormModal } from './document-form-modal';
import { columns, DocumentColumn } from './columns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader } from '../ui/card';

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
  const [globalFilter, setGlobalFilter] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filteredData = data.filter(item => {
    // Text search
    const textMatch = 
      item.nombre_documento.toLowerCase().includes(globalFilter.toLowerCase()) ||
      item.propiedadDireccion.toLowerCase().includes(globalFilter.toLowerCase()) ||
      item.tipoDocumentoNombre.toLowerCase().includes(globalFilter.toLowerCase()) ||
      String(item.version).toLowerCase().includes(globalFilter.toLowerCase());
      
    // Date search
    let dateMatch = true;
    if (dateRange?.from) {
      try {
        const itemDate = startOfDay(parseISO(item.fecha_subida));
        const fromDate = startOfDay(dateRange.from);
        const toDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
        dateMatch = itemDate >= fromDate && itemDate <= toDate;
      } catch (e) {
        dateMatch = true; // If date is invalid, don't filter it out
      }
    }

    return textMatch && dateMatch;
  });

  const clearFilters = () => {
    setGlobalFilter('');
    setDateRange(undefined);
  }

  const tableColumns = columns({ properties, documentTypes });

  return (
    <div className="space-y-4">
      <DocumentFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
        properties={properties}
        documentTypes={documentTypes}
      />
      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row flex-1 items-center gap-2 w-full">
                  <Popover>
                      <PopoverTrigger asChild>
                      <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                          "h-9 w-full md:w-[260px] justify-start text-left font-normal",
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
                          <span>Filtrar por fecha de subida</span>
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
                  <Input
                      placeholder="Buscar en la tabla..."
                      value={globalFilter}
                      onChange={(e) => setGlobalFilter(e.target.value)}
                      className="h-9 w-full md:w-[260px]"
                  />
                  {(globalFilter || dateRange) && (
                      <Button variant="ghost" onClick={clearFilters} className="h-9 px-3 w-full md:w-auto">
                          <X className="mr-2 h-4 w-4" />
                          Limpiar
                      </Button>
                  )}
              </div>
              <div className="flex items-center space-x-2 w-full md:w-auto">
                  <Button onClick={() => setIsModalOpen(true)} size="sm" className="w-full md:w-auto">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Subir Documento
                  </Button>
              </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
            <DataTable 
              columns={tableColumns} 
              data={filteredData}
              rowIdKey="id_documento"
            />
        </CardContent>
      </Card>
    </div>
  );
};
