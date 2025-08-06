
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
  tokenExp?: number;
};

export default function ProfilePage() {
  const sessionCookie = cookies().get('session')?.value;
  
  if (!sessionCookie) {
    redirect('/login');
  }

  const user: Session = JSON.parse(sessionCookie);

  return (
    <DashboardLayout 
        user={user} 
        title="Mi Perfil" 
        description="Actualiza tu información personal y contraseña."
    >
        <div className="mt-8">
            <ProfileForm user={user} />
        </div>
    </DashboardLayout>
  );
}
