import '@workspace/ui/globals.css';

import React from 'react';
import { Toaster } from '@workspace/ui/components/sonner';

export const metadata = {
  title: 'morphly',
  description: 'The best text-to-CAD platform',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <Toaster position="bottom-left" />
      </body>
    </html>
  );
}
