/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove deprecated experimental.serverActions (Server Actions on by default)
  reactStrictMode: false,
  experimental: {},
  // Allow dev access from any origin for API fetches when running dev server
  // For production, set NEXT_PUBLIC_API_BASE appropriately.
  allowedDevOrigins: ["http://localhost:3000", "http://0.0.0.0:3000", "*"],
};
export default nextConfig;
