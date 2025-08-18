import type { Metadata } from 'next';
import './globals.css';
import { Roboto } from 'next/font/google';
import { Toaster } from 'sonner';

const roboto = Roboto({
  weight: ['100', '200', '300', '400', '500', '600', '700'], // Add weights as needed
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vouchify',
  description: 'A Voucher Management System',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${roboto.variable}`} cz-shortcut-listen='true'>
        <Toaster richColors />

        {children}
      </body>
    </html>
  );
}
