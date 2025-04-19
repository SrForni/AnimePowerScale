'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = !['/login', '/signup'].includes(pathname);

  return showSidebar ? (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950 text-white">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden p-6">
        {children}
      </main>
    </div>
  ) : (
    <main className="h-screen w-screen flex items-center justify-center overflow-hidden">
      {children}
    </main>
  );
}
