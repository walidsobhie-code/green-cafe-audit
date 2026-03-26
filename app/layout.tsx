import type { Metadata, Viewport } from "next";
import "./globals.css";

const BASE_URL = "https://green-cafe-audit.vercel.app";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Green Cafe Audit | تدقيق جرين كافيه",
  description: "50-Point Bilingual Audit Checklist for Green Cafe Branch Visits - Conduct comprehensive branch audits with this detailed checklist covering customer service, cleanliness, food quality, and more.",
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: BASE_URL,
    languages: {
      "ar-SA": `${BASE_URL}/ar`,
      "en": BASE_URL,
    },
  },
  openGraph: {
    title: "Green Cafe Audit | تدقيق جرين كافيه",
    description: "50-Point Bilingual Audit Checklist for Green Cafe Branch Visits",
    url: BASE_URL,
    siteName: "Green Cafe Audit",
    locale: "ar-SA",
    alternateLocale: "en",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Green Cafe Audit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Green Cafe Audit | تدقيق جرين كافيه",
    description: "50-Point Bilingual Audit Checklist for Green Cafe Branch Visits",
    images: [`${BASE_URL}/og-image.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar-SA" dir="rtl">
      <head>
        <link rel="canonical" href={BASE_URL} />
      </head>
      <body className="antialiased bg-gray-100">
        {children}
      </body>
    </html>
  );
}
