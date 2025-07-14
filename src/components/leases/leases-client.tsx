
'use client';

import { useState } from 'react';
import { PlusCircle, Calendar as CalendarIcon, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, parseISO, startOfDay, endOfDay } from 'date-fns';

import { DataTable } from '@/components/ui/data-table';
import { Button } from '../ui/button';
import { LeaseFormModal } from './lease-form-modal';
import { columns, LeaseColumn } from './columns';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';

type Tenant = {
  id_arrendatario: number;
  nombre: string;
};

type Property = {
  id_propiedad: number;
  direccion: string;
};

interface LeasesClientProps {
  data: LeaseColumn[];
  tenants: Tenant[];
  properties: Property[];
}

export const LeasesClient: React.FC<LeasesClientProps> = ({ data, tenants, properties }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filteredData = data.filter(item => {
    // Text search
    const textMatch = 
      item.arrendatarioNombre.toLowerCase().includes(globalFilter.toLowerCase()) ||
      item.propiedadDireccion.toLowerCase().includes(globalFilter.toLowerCase());
      
    // Date search
    let dateMatch = true;
    if (dateRange?.from) {
      try {
        const itemDate = startOfDay(parseISO(item.fecha_inicio_arriendo));
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

  const tableColumns = columns({ tenants, properties });

  return (
    <div className="space-y-4">
      <LeaseFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
        tenants={tenants}
        properties={properties}
      />
      <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
              <Input
                  placeholder="Buscar por arrendatario o propiedad..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
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
                      <span>Filtrar por fecha de inicio</span>
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
              {(globalFilter || dateRange) && (
                <Button variant="ghost" onClick={clearFilters} className="h-9 px-3">
                    <X className="mr-2 h-4 w-4" />
                    Limpiar
                </Button>
              )}
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear Arriendo
          </Button>
      </div>
      <DataTable columns={tableColumns} data={filteredData} />
    </div>
  );
};
