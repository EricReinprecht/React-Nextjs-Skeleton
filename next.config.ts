import type { NextConfig } from "next";
import path from "path";
// import dotenv from 'dotenv';

// Load the environment variables from `.env.local`
// dotenv.config({ path: '.env.local' });

const nextConfig: NextConfig = {
  reactStrictMode: false, // TODO REMOVE WHEN PRODUCTION
  sassOptions: {
    implementation: 'sass-embedded',
    includePaths: [path.join(__dirname, 'src/assets/styles')],
    env: {
      ...process.env, 
    },
    additionalData: `
      @use "variables" as *;
      @use "default" as *;
      @use "reset" as *; 
    ` // Combine both @use statements into one string
  },
  //  i18n: {
  //   locales: ['en', 'de'], // Add your supported languages here
  //   defaultLocale: 'en',   // Set the default language
  //   localeDetection: true, // Optional: Auto-detect based on browser
  // },
};

export default nextConfig;
