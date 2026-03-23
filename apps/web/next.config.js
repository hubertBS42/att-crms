/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone',
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'www.attelecoms.co.uk',
				port: '',
			},
		],
	},
}

export default nextConfig
