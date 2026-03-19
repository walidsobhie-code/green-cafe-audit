import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Green Cafe Audit | تدقيق جرين كافيه",
  description: "50-Point Bilingual Audit Checklist for Green Cafe Branch Visits",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className="antialiased bg-gray-100">
        {children}
      </body>
    </html>
  );
}
