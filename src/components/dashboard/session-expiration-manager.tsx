
'use client';

import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { logout } from '@/app/actions';
import { Button } from '../ui/button';
import { AlertTriangle, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SessionExpirationManagerProps {
  sessionExp?: number;
}

const EXPIRATION_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

export function SessionExpirationManager({ sessionExp }: SessionExpirationManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!sessionExp) return;

    const checkExpiration = () => {
      const now = new Date().getTime();
      const timeRemaining = sessionExp - now;
      
      if (timeRemaining < 0) {
        // Session expired, force logout
        logout().then(() => router.push('/ingresar'));
      } else if (timeRemaining <= EXPIRATION_THRESHOLD) {
        // Show modal if within threshold
        const minutes = Math.floor((timeRemaining / 1000) / 60);
        const seconds = Math.floor((timeRemaining / 1000) % 60);
        setTimeLeft(`${minutes}m ${seconds}s`);
        setIsModalOpen(true);
      } else {
        setIsModalOpen(false);
      }
    };

    // Check immediately and then every second
    checkExpiration();
    const interval = setInterval(checkExpiration, 1000);

    return () => clearInterval(interval);
  }, [sessionExp, router]);

  const handleLogout = async () => {
    await logout();
  };

  if (!isModalOpen) {
    return null;
  }

  return (
    <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              </div>
          </div>
          <AlertDialogTitle className="text-center">Tu sesión está a punto de expirar</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Tu sesión se cerrará automáticamente en <span className="font-bold">{timeLeft}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center pt-4">
          <AlertDialogCancel>Permanecer</AlertDialogCancel>
          <Button onClick={handleLogout} variant="destructive">
            <LogOut className="mr-2" />
            Cerrar Sesión Ahora
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
