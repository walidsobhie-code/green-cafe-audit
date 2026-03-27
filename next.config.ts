import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  trailingSlash: true,
};

const withPWAConfig = withPWA({
  disable: process.env.NODE_ENV === "development",
  dest: "public",
  register: true,
  scope: "/",
  sw: "service-worker.js",
});

export default withPWAConfig(nextConfig);
