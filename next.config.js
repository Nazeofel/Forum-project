/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    API_KEY: process.env.API_KEY,
    SEARCH_ONLY_KEY: process.env.SEARCH_ONLY_KEY,
    API_KEY_FMC: process.env.NEXT_PUBLIC_API_KEY_FMC,
    AUTH_DOMAIN_FMC: process.env.NEXT_PUBLIC_AUTH_DOMAIN_FMC,
    PROJECT_ID_FMC: process.env.NEXT_PUBLIC_PROJECT_ID_FMC,
    STORAGE_BUCKET_FMC: process.env.NEXT_PUBLIC_STORAGE_BUCKET_FMC,
    MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    APP_ID: process.env.NEXT_PUBLIC_APP_ID,
    MEASUREMENT_ID: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
  },
};
module.exports = nextConfig;
