import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";

// Load the fonts with proper configuration
const poppins = Poppins({ 
  weight: ["700"], 
  subsets: ["latin"], // Add subsets to ensure proper character support
  variable: "--font-poppins" // Optional: Set CSS variable for font if needed
});

const roboto = Roboto({ 
  weight: ["400"], 
  subsets: ["latin"], // Add subsets to ensure proper character support
  variable: "--font-roboto" // Optional: Set CSS variable for font if needed
});

export const metadata: Metadata = {
  title: "Union of Security Employees",
  description: "Union of Security Employees",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${roboto.className}`}>{children}</body>
    </html>
  );
}
