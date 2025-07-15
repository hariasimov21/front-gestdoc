
import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="hidden bg-muted lg:flex lg:flex-col lg:items-center lg:justify-center p-8">
        <div className="flex flex-col items-center text-center">
           <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-16 w-16 text-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
           <h1 className="mt-4 text-4xl font-bold tracking-tight">GestDoc</h1>
           <p className="mt-2 text-lg text-muted-foreground">Tu centro de control documental.</p>
        </div>
        <div className="mt-10 w-full max-w-md">
            <Image
                src="https://placehold.co/600x400.png"
                alt="Modern office"
                width="600"
                height="400"
                data-ai-hint="office building"
                className="h-full w-full object-cover rounded-lg shadow-md"
            />
        </div>
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <LoginForm />
      </div>
    </div>
  );
}
