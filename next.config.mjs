import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  pageExtensions: ["js", "jsx", "ts", "tsx"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "uniserver-4hkz.onrender.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "rrdhgqcockacjqfuwyit.supabase.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  compress: true,

  webpack(config) {
    const base = path.resolve(__dirname, "src/app");

    // ✅ Both alias versions
    config.resolve.alias["@components"] = path.join(base, "_components");
    config.resolve.alias["_components"] = path.join(base, "_components"); // ← Add this
    config.resolve.alias["@lib"] = path.join(base, "lib");
    config.resolve.alias["@assets"] = path.resolve(__dirname, "public/assets");
    config.resolve.alias["@config"] = path.resolve(__dirname, "src/config");

    return config;
  },

  // Turbopack configuration (mirrors Webpack aliases)
  turbopack: {
    resolveAlias: {
      "@components": "./src/app/_components",
      "_components": "./src/app/_components",
      "@lib": "./src/app/lib",
      "@assets": "./public/assets",
      "@config": "./src/config",
    },
  },
};

export default nextConfig;
