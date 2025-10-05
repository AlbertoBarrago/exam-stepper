'use client';

import './globals.css';
import Header from '@/components/layout/Header';
import React, { useEffect, useState } from 'react';
import Footer from '@/components/layout/Footer';
import { usePathname, useRouter } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
