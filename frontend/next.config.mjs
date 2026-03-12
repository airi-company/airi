/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {},
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://0.0.0.0:3000",
    "http://72.155.88.236:3000",
    "*",
  ],
};
export default nextConfig;
