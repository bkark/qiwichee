import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import SiteFooter from "./components/SiteFooter";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://qiwichee.com"),
  title: {
    template: "%s | Qiwi Chee",
    default: "Qiwi Chee — Pop alternative",
  },
  description:
    "Autrice-compositrice-interprète indépendante, basée à Paris. Pop alternative franco-algérienne-américaine, en français et en anglais.",
  alternates: {
    canonical: "https://qiwichee.com",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Qiwi Chee",
    title: "Qiwi Chee — Pop alternative",
    description:
      "Autrice-compositrice-interprète indépendante, basée à Paris. Pop alternative franco-algérienne-américaine, en français et en anglais.",
    url: "https://qiwichee.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${bricolage.variable} ${inter.variable}`}>
      <body className="antialiased">
{children}
 <SiteFooter />
</body>
    </html>
  );
}
