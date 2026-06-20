import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://qiwichee.com"),
  title: {
    template: "%s | Qiwi Chee",
    default: "Qiwi Chee — Hybrid Pop Artist",
  },
  description:
    "Franco-Algerian-American singer-songwriter based in Paris. Hybrid pop in French and English.",
  alternates: {
    canonical: "https://qiwichee.com",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Qiwi Chee",
    title: "Qiwi Chee — Hybrid Pop Artist",
    description:
      "Franco-Algerian-American singer-songwriter based in Paris. Hybrid pop in French and English.",
    url: "https://qiwichee.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
