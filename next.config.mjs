/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Setze die basePath, wenn deine GitHub Pages nicht auf der Root-Domain läuft
  // basePath: '/minecraft-server-manager',
  images: {
    unoptimized: true,
  },
  // Deaktiviere die Verwendung von /-/ Präfix für Assets
  assetPrefix: './',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
};

export default nextConfig;

