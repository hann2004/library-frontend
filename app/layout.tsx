import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import {AuthProvider}  from './contexts/AuthContext';
import Layout from './components/Layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Empower Library - Your Digital Book Haven',
  description: 'Manage and explore your library collection with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}