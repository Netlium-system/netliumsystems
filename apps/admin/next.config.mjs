/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@netlium/lib",
    "@netlium/ui",
    "@netlium/types",
    "@neptlium/design-system"
  ],
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3002", "admin.neptlium.com", "*.app.github.dev"]
    }
  }
};

export default nextConfig;
