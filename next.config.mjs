import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  pageExtensions: ["js", "jsx", "ts", "tsx"],

  // ✅ PERFORMANCE: Optimized image configuration
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "uniserver-4hkz.onrender.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "rrdhgqcockacjqfuwyit.supabase.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
    // AVIF first (best compression), then WebP fallback
    formats: ["image/avif", "image/webp"],
    // Responsive image sizes for different devices
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images for 60 days
    minimumCacheTTL: 60 * 60 * 24 * 60,
    // Disable image optimization in dev for faster builds
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // ✅ PERFORMANCE: Enable compression
  compress: true,
  
  // ✅ PERFORMANCE: Reduce build output
  poweredByHeader: false,
  
  // ✅ PERFORMANCE: Experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: [
      'lucide-react',
      '@heroicons/react',
      '@phosphor-icons/react',
      'react-icons',
    ],
  },

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
