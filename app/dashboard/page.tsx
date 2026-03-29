import Dashboard from '../Dashboard';
import { Metadata } from 'next';

const BASE_URL = "https://green-cafe-audit.vercel.app";

export const metadata: Metadata = {
  title: "Green Cafe Dashboard | Audit Reports & Analytics",
  description: "View and manage your Green Cafe branch audit reports. Track performance, analyze results, and export audit data.",
  alternates: {
    canonical: `${BASE_URL}/dashboard`,
  },
  openGraph: {
    title: "Green Cafe Dashboard | Audit Reports & Analytics",
    description: "View and manage your Green Cafe branch audit reports.",
    url: `${BASE_URL}/dashboard`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Green Cafe Dashboard",
      },
    ],
  },
};

export default function DashboardPage() {
  return <Dashboard />;
}