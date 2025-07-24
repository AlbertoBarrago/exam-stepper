import './globals.css';
import Header from '@/components/layout/Header';
import React from 'react';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Exam Stepper',
  description: 'Test and certify your English in 50 minutes.',
};

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
