
'use client';

import { useState, useTransition } from 'react';
import { PlusCircle, Users, Briefcase, Trash, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Combobox } from '@/components/ui/combobox';
import { UserSocietyFormModal } from './user-society-form-modal';
import { getSocietiesForUser, getUsersForSociety, deleteAssociation } from '@/app/user-society/actions';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type User = {
  id_usuario: number;
  nombre: string;
};

type Society = {
  id_sociedad: number;
  nombre: string;
};

interface UserSocietyClientProps {
  users: User[];
  societies: Society[];
}

export const UserSocietyClient: React.FC<UserSocietyClientProps> = ({ users, societies }) => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedSocietyId, setSelectedSocietyId] = useState<string>('');
  
  const [userSocieties, setUserSocieties] = useState<Society[]>([]);
  const [societyUsers, setSocietyUsers] = useState<User[]>([]);

  const handleUserChange = (userId: string) => {
    const id = Number(userId);
    setSelectedUserId(userId);
    
    if (!id) {
        setUserSocieties([]);
        return;
    }
    
    startTransition(async () => {
        const result = await getSocietiesForUser(id);
        setUserSocieties(result);
    });
  };

  const handleSocietyChange = (societyId: string) => {
    const id = Number(societyId);
    setSelectedSocietyId(societyId);
    
    if (!id) {
        setSocietyUsers([]);
        return;
    }

    startTransition(async () => {
        const result = await getUsersForSociety(id);
        setSocietyUsers(result);
    });
  };

  const onTabChange = (value: string) => {
    if (value === 'user') {
      setSelectedSocietyId('');
      setSocietyUsers([]);
    } else {
      setSelectedUserId('');
      setUserSocieties([]);
    }
  }

  const handleDelete = async (userId: number, societyId: number) => {
    setIsDeleting(`${userId}-${societyId}`);
    const result = await deleteAssociation(userId, societyId);
    if (result.error) {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
    } else {
        toast({ title: 'Asociación eliminada' });
        if (selectedUserId) handleUserChange(selectedUserId);
        if (selectedSocietyId) handleSocietyChange(selectedSocietyId);
    }
    setIsDeleting(null);
  };

  return (
    <>
      <UserSocietyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={users}
        societies={societies}
        onSuccess={() => {
            if (selectedUserId) handleUserChange(selectedUserId);
            if (selectedSocietyId) handleSocietyChange(selectedSocietyId);
        }}
      />
      <div className="flex items-center justify-end mb-4">
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Asociar
        </Button>
      </div>

      <Tabs defaultValue="user" className="w-full" onValueChange={onTabChange}>
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user"><Users className="mr-2 h-4 w-4"/> Ver por Usuario</TabsTrigger>
            <TabsTrigger value="society"><Briefcase className="mr-2 h-4 w-4"/> Ver por Sociedad</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
            <Card>
                <CardHeader>
                    <CardTitle>Selecciona un Usuario</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Combobox
                        options={users.map(u => ({ value: String(u.id_usuario), label: u.nombre }))}
                        value={selectedUserId}
                        onChange={handleUserChange}
                        placeholder="Selecciona un usuario"
                        searchPlaceholder="Buscar usuario..."
                        emptyPlaceholder="No se encontraron usuarios."
                    />
                    {isPending && selectedUserId && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin h-4 w-4" /> Cargando sociedades...</div>}
                    {userSocieties.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="font-medium">Sociedades Asociadas:</h4>
                            <ul className="list-disc list-inside bg-secondary p-3 rounded-md space-y-2">
                                {userSocieties.map(society => (
                                    <li key={society.id_sociedad} className="flex items-center justify-between">
                                        <span>{society.nombre}</span>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-7 w-7" disabled={isDeleting === `${selectedUserId}-${society.id_sociedad}`}>
                                                    {isDeleting === `${selectedUserId}-${society.id_sociedad}` ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash className="h-4 w-4 text-destructive"/>}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                    <AlertDialogDescription>Esta acción desasociará al usuario de la sociedad. No se puede deshacer.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(Number(selectedUserId), society.id_sociedad)} className="bg-destructive hover:bg-destructive/90">Desasociar</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {selectedUserId && !isPending && userSocieties.length === 0 && <p className="text-muted-foreground text-sm">Este usuario no está asociado a ninguna sociedad.</p>}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="society">
             <Card>
                <CardHeader>
                    <CardTitle>Selecciona una Sociedad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Combobox
                        options={societies.map(s => ({ value: String(s.id_sociedad), label: s.nombre }))}
                        value={selectedSocietyId}
                        onChange={handleSocietyChange}
                        placeholder="Selecciona una sociedad"
                        searchPlaceholder="Buscar sociedad..."
                        emptyPlaceholder="No se encontraron sociedades."
                    />
                    {isPending && selectedSocietyId && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin h-4 w-4" /> Cargando usuarios...</div>}
                    {societyUsers.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="font-medium">Usuarios Asociados:</h4>
                            <ul className="list-disc list-inside bg-secondary p-3 rounded-md space-y-2">
                                {societyUsers.map(user => (
                                    <li key={user.id_usuario} className="flex items-center justify-between">
                                        <span>{user.nombre}</span>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-7 w-7" disabled={isDeleting === `${user.id_usuario}-${selectedSocietyId}`}>
                                                    {isDeleting === `${user.id_usuario}-${selectedSocietyId}` ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash className="h-4 w-4 text-destructive"/>}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                    <AlertDialogDescription>Esta acción desasociará al usuario de la sociedad. No se puede deshacer.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(user.id_usuario, Number(selectedSocietyId))} className="bg-destructive hover:bg-destructive/90">Desasociar</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {selectedSocietyId && !isPending && societyUsers.length === 0 && <p className="text-muted-foreground text-sm">Esta sociedad no tiene usuarios asociados.</p>}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};
