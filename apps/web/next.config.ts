import type { NextConfig } from "next";

// We're using middleware for dynamic redirects from Sanity, but this function
// can be used if we ever need to add static redirects as well
async function getStaticRedirects() {
  return [
    // Add any static redirects here if needed
    // Example: { source: '/old-page', destination: '/new-page', permanent: true }
  ];
}

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@workspace/ui"],
  experimental: {
    reactCompiler: true,
    ppr: true,
    inlineCss: true,
  },
  logging: {
    fetches: {},
  },
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/**`,
      },
    ],
  },
  // Static redirects (if needed)
  async redirects() {
    return await getStaticRedirects();
  },
};

export default nextConfig;
