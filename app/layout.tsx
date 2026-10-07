import type { Metadata } from "next";
import { Raleway, Inter } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OCA – Old Columbans Association",
  description: "The Old Columbans Association of St. Columba's School, New Delhi — fellowship, membership, governance and support for the school.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" className={`${raleway.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
