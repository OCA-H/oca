import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Raleway, Inter } from "next/font/google";
import "./globals.css";
import { ContactProvider } from "@/app/(view)/common/component/ContactProvider";
import { HEADER_AUTH_WIDTH_SCRIPT } from "@/app/(view)/common/helper/headerAuthWidth";
import { IMAGE_PLACEHOLDER_GUARD_SCRIPT } from "@/app/(view)/common/helper/placeholders";
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
    // suppressHydrationWarning: the script below sets attributes on <html> before React loads.
    <html lang="en-US" className={`${raleway.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Sizes the header's sign-in area before the first paint, so it does not jump (see headerAuthWidth). */}
        <script dangerouslySetInnerHTML={{ __html: HEADER_AUTH_WIDTH_SCRIPT }} />
        {/* Fallback safety net for images across all pages matching the template's placeholder art */}
        <script dangerouslySetInnerHTML={{ __html: IMAGE_PLACEHOLDER_GUARD_SCRIPT }} />
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
