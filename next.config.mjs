/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    RESAS_API_ENDPOINT: process.env.RESAS_API_ENDPOINT,
    RESAS_API_KEY: process.env.RESAS_API_KEY,
  },
};

export default nextConfig;
