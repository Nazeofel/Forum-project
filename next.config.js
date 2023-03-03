/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    API_KEY: process.env.API_KEY,
    SEARCH_ONLY_KEY: process.env.SEARCH_ONLY_KEY,
  },
};

module.exports = nextConfig;
