
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Loader2, AlertTriangle, FileWarning, ArrowRight } from 'lucide-react';
import { getExpiringLeases } from '@/app/arriendos/actions';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { Badge } from '../ui/badge';

type Lease = {
  id_arriendo: number;
  fecha_fin_arriendo: string;
  local: {
    id_local: number;
    nombre_local: string;
    id_propiedad: number;
    propiedad: {
      direccion: string;
    }
  };

  arrendatario: {
    nombre: string;
  };
};

export function ExpiringLeases() {
  const [days, setDays] = useState(30);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    startTransition(async () => {
      const { payload, error } = await getExpiringLeases(days);
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error,
        });
      } else {
        setLeases(payload);
      }
    });
  }, [days, toast]);

  const timeFrames = [7, 15, 30];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Arriendos por Vencer</CardTitle>
        <div className="flex space-x-2 pt-2">
          {timeFrames.map((frame) => (
            <Button
              key={frame}
              size="sm"
              variant={days === frame ? 'default' : 'outline'}
              onClick={() => setDays(frame)}
            >
              {frame} días
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isPending && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {!isPending && leases.length === 0 && (
            <div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
              <FileWarning className="h-8 w-8 mb-2" />
              <p className="font-medium">Todo en orden</p>
              <p className="text-sm">No hay arriendos que venzan en los próximos {days} días.</p>
            </div>
          )}
          {!isPending && leases.map((lease) => (
            <div key={lease.id_arriendo} className="flex items-start gap-3 group">
              <div className="bg-destructive/10 text-destructive p-2 rounded-full mt-1">
                <Clock className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{lease.arrendatario.nombre}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {lease.local.propiedad.direccion}
                </p>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>Vence el {format(new Date(lease.fecha_fin_arriendo), 'dd/MM/yyyy')}</span>
                  <Badge variant="outline" className="text-destructive border-destructive">
                    {formatDistanceToNow(new Date(lease.fecha_fin_arriendo), { addSuffix: true, locale: es })}
                  </Badge>
                </div>
              </div>
              <Link href={`/arriendos?highlight=${lease.id_arriendo}`} className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
