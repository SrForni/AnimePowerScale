import './globals.css';
import { ReactNode } from 'react';
import ClientLayout from '@/components/ClientLayout';
import LayoutWrapper from '@/components/LayoutWrapper';

export const metadata = {
  title: 'Anime Power Scale',
  description: 'Ordena personajes de anime por poder',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="w-full h-full overflow-hidden bg-gray-950">
        <ClientLayout>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ClientLayout>
      </body>
    </html>
  );
}
