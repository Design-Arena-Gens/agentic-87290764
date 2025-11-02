import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pattern Maker Agent',
  description: 'Design precise procedural patterns in real-time and export ready-to-use CSS background gradients.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="app-shell">{children}</body>
    </html>
  );
}
