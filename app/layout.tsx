import { NextAuthProvider } from './NextAuthProvider';
import type { Metadata } from 'next';
import { Poppins, Roboto } from 'next/font/google';
import './globals.css';

const poppins = Poppins({ 
  weight: ["700"], 
  subsets: ["latin"],
  variable: "--font-poppins" 
});

const roboto = Roboto({ 
  weight: ["400"], 
  subsets: ["latin"],
  variable: "--font-roboto" 
});

export const metadata: Metadata = {
  title: "Union of Security Employees",
  description: "Union of Security Employees",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${roboto.className}`}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
