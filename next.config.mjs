/** @type {import('next').NextConfig} */
const nextConfig = {
	typescript: {
		// Allow production builds to successfully complete even if there are type errors.
		ignoreBuildErrors: true,
	},
	eslint: {
		// Ignore ESLint errors during builds. Local dev will still show them.
		ignoreDuringBuilds: true,
	},
	pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
	images: {
		domains: ['uniserver-4hkz.onrender.com', 'res.cloudinary.com'],
	},
};

export default nextConfig;
