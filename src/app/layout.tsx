import type { Metadata } from 'next';
import { Outfit, Poppins } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Askesis - Unlock the Future of Education',
  description: 'Experience personalized AI-powered learning through the ancient art of Socratic questioning. Discover knowledge in Philosophy, Literature, and History like never before.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${poppins.variable} font-outfit bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}