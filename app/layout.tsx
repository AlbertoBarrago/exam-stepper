import './globals.css'
import Header from '@/components/Header'
import React from "react";

export const metadata = {
    title: 'Exam Stepper',
    description: 'Test and certify your English in 50 minutes.',
}

export default function RootLayout({children}: {
    children: React.ReactNode
}) {
    const currentYear = new Date().getFullYear();
    return (
        <html lang="en">
        <body className="min-h-screen flex flex-col font-sans text-gray-800">
        <Header/>
        <main className="flex-1">
            {children}
        </main>
        <footer className="py-4 text-center text-sm text-gray-500">
            ©{currentYear} IdCert
        </footer>
        </body>
        </html>
    );
}