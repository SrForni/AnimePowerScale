import './globals.css';
import { ReactNode } from 'react';
import ClientLayout from '@/components/ClientLayout';

export const metadata = {
  title: 'Anime Power Scale',
  description: 'Ordena personajes de anime por poder',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ClientLayout>
          <main className="min-h-screen flex items-center justify-center">
            {children}
          </main>
        </ClientLayout>
      </body>
    </html>
  );
}
