'use client';

import './globals.css';
import Header from '@/components/layout/Header';
import React from 'react';
import Footer from '@/components/layout/Footer';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showHeader = pathname !== '/login';

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {showHeader && <Header />}
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
