import type { Metadata } from 'next';
import { Poppins, Great_Vibes } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-great-vibes',
});

export const metadata: Metadata = {
  title: 'Askesis - Enlighten Your Mind Through Socratic AI Inquiry',
  description: 'Learn through guided questioning with AI teachers in Philosophy, Literature, and History.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${greatVibes.variable} font-poppins bg-[#0f0e17] text-[#fffffe]`}>
        {children}
      </body>
    </html>
  );
}