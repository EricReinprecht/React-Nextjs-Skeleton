import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  sassOptions: {
    implementation: 'sass-embedded',
    includePaths: [path.join(__dirname, 'src/assets/styles')],
    additionalData: `
      @use "variables" as *;
      @use "default" as *;
    ` // Combine both @use statements into one string
  }
};

export default nextConfig;
