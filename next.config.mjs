/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ this disables build-breaking lint
  },
};

export default nextConfig;
