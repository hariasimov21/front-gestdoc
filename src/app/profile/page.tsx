
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ProfileForm } from '@/components/profile/profile-form';

type Session = {
  nombre: string;
  email: string;
  rol_usuario_id: number;
  nombre_rol: string;
  id_usuario: number;
};

export default function ProfilePage() {
  const sessionCookie = cookies().get('session')?.value;
  
  if (!sessionCookie) {
    redirect('/login');
  }

  const user: Session = JSON.parse(sessionCookie);

  return (
    <DashboardLayout user={user}>
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
            <p className="text-muted-foreground mt-2">
                Actualiza tu información personal y contraseña.
            </p>
            <div className="mt-8">
                <ProfileForm user={user} />
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
