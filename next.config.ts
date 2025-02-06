import type { NextConfig } from "next";
import path from "path";
const nextConfig: NextConfig = {
  sassOptions: {
    implementation: 'sass-embedded',
    includePaths: [path.join(__dirname, 'src/assets/styles')],
    additionalData: `@use "variables" as *;` //global import for a file (no need to import it cause its automatically applied to every file)
  }
};

export default nextConfig;
