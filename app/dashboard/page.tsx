import Dashboard from '../Dashboard';
import { Metadata } from 'next';

const BASE_URL = "https://green-cafe-audit.vercel.app";

export const metadata: Metadata = {
  title: "Dashboard | Green Cafe Audit",
  description: "View and manage your Green Cafe audit reports and data. Track branch performance, analyze results, and export audit data.",
  alternates: {
    canonical: `${BASE_URL}/dashboard`,
  },
  openGraph: {
    title: "Dashboard | Green Cafe Audit",
    description: "View and manage your Green Cafe audit reports and data.",
    url: `${BASE_URL}/dashboard`,
    type: "website",
  },
};

export default function DashboardPage() {
  return <Dashboard />;
}