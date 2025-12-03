
'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PlusCircle, Calendar as CalendarIcon, X, Search } from 'lucide-react';
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
import { Card, CardContent, CardHeader } from '../ui/card';

type Tenant = {
  id_arrendatario: number;
  nombre: string;
};

interface LeasesClientProps {
  data: LeaseColumn[];
  tenants: Tenant[];
  locals: { id_local: number; nombre_local: string }[];
}

function LeasesClientContent({ data, tenants, locals }: LeasesClientProps) {
  const searchParams = useSearchParams();
  const highlightedId = searchParams.get('highlight');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filteredData = data.filter(item => {
    const textMatch =
      (item.arrendatarioNombre && item.arrendatarioNombre.toLowerCase().includes(globalFilter.toLowerCase())) ||
      (item.propiedadDireccion && item.propiedadDireccion.toLowerCase().includes(globalFilter.toLowerCase())) ||
      (item.nombre_local && item.nombre_local.toLowerCase().includes(globalFilter.toLowerCase())) ||
      (item.id_local && String(item.id_local).toLowerCase().includes(globalFilter.toLowerCase()));
      
    let dateMatch = true;
    if (dateRange?.from) {
      try {
        const itemDate = startOfDay(parseISO(item.fecha_inicio_arriendo));
        const fromDate = startOfDay(dateRange.from);
        const toDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
        dateMatch = itemDate >= fromDate && itemDate <= toDate;
      } catch (e) {
        dateMatch = true;
      }
    }

    return textMatch && dateMatch;
  });

  const clearFilters = () => {
    setGlobalFilter('');
    setDateRange(undefined);
  }

  const tableColumns = columns({ tenants, locals });

  return (
    <div className="space-y-4">
      <LeaseFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={null}
        tenants={tenants}
        locals={locals}
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
                    <div className="relative w-full md:w-[260px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por arrendatario o propiedad..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="h-9 w-full pl-8"
                        />
                    </div>
                    {(globalFilter || dateRange) && (
                        <Button variant="ghost" onClick={clearFilters} className="h-9 px-3 w-full md:w-auto">
                            <X className="mr-2 h-4 w-4" />
                            Limpiar
                        </Button>
                    )}
                </div>
                  <div className="flex items-center space-x-2 w-full md:w-auto">
                      <Button onClick={() => setIsModalOpen(true)} size="sm" className="w-full">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Crear Arriendo
                      </Button>
                  </div>
            </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
            <DataTable 
                columns={tableColumns} 
                data={filteredData} 
                highlightedRowId={highlightedId}
                rowIdKey="id_arriendo"
            />
        </CardContent>
      </Card>
    </div>
  );
}

export const LeasesClient: React.FC<LeasesClientProps> = (props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeasesClientContent {...props} />
    </Suspense>
  )
}
