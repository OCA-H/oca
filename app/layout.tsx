import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Raleway, Inter } from "next/font/google";
import "./globals.css";
import { ContactProvider } from "@/app/(view)/common/component/ContactProvider";
import { getContactDetails } from "@/app/api/(features)/(pview)/site/services/siteContentService";

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

// The contact details come from a cached read (Settings → Contact details in the admin panel), so
// pages still prerender; saving them refreshes every page.
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" className={`${raleway.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ContactProvider contact={await getContactDetails()}>{children}</ContactProvider>
        {/* Real-visitor page speed, reported to the Vercel dashboard (Speed Insights). */}
        <SpeedInsights />
      </body>
    </html>
  );
}
