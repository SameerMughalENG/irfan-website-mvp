import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Irfan Electronics MVP | Wholesale Storefront',
  description: 'Clean, production-lean wholesale electronics catalog powered by Next.js and Supabase.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <header className="main-header">
            <Link href="/products" className="brand-logo">
              IRFAN ELECTRONICS
              <span className="brand-badge">Wholesale MVP</span>
            </Link>
            <nav className="nav-links">
              <Link href="/products" className="nav-link">Catalog</Link>
            </nav>
          </header>
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
