import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Green Cafe Audit System | نظام تدقيق جرين كافيه",
  description: "50-Point Bilingual Audit Checklist for Green Cafe Branch Visits",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
