
import { LoginForm } from '@/components/auth/login-form';
import Image from 'next/image';

//comentario de prueba fdhjfhasdjk

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="relative flex items-center justify-center h-56 lg:h-full flex-col overflow-hidden bg-muted p-10 text-white dark:border-r">
        <Image
          src="/login.jpeg"
          alt="Oficina moderna con torre de vidrio"
          fill
          className="object-cover"
          unoptimized
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-zinc-900/60" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-6 w-6"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          GestDoc
        </div>
        <div className="relative z-20 mt-auto hidden lg:block">
            <blockquote className="space-y-2">
                <p className="text-lg">
                "La plataforma líder para la gestión de documentos inmobiliarios."
                </p>
            </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <LoginForm />
      </div>
    </div>
  );
}
