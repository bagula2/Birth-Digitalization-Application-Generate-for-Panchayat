import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Birth Certificate Application | Bagula Panchayat',
  description: 'Digital birth certificate application system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-blue-600">
              🏛️ Bagula Panchayat - Birth Certificate System
            </h1>
          </div>
        </nav>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-800 text-white text-center py-4 mt-8">
          <p>© 2026 Bagula 2 No Gram Panchayat. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}