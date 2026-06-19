/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  // rahman-shared ships TS source — must be transpiled by the app build.
  transpilePackages: ["rahman-shared"],
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.convex.cloud" },
    ],
  },
};

export default nextConfig;
