import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IFUNO - Latest Releases',
  description: 'Discover music that isn\'t mainstream but if you know, you know - from rising stars to cult favorites',
  icons: {
    icon: 'https://ik.imagekit.io/vv1coyjgq/ifuno%20favicon%20162.png?updatedAt=1751624873967',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://ik.imagekit.io/vv1coyjgq/ifuno%20favicon%20162.png?updatedAt=1751624873967" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}