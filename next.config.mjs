/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/minecraft-team-dashboard',
  trailingSlash: true,
}

export default nextConfig

