/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PRIVATE_KEY: process.env.PRIVATE_KEY,
  },
};

module.exports = nextConfig;
