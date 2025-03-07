/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Setze die Basis-URL für GitHub Pages
  // Ersetze 'dein-username' mit deinem GitHub-Benutzernamen und 'repository-name' mit dem Namen deines Repositories
  basePath: process.env.NODE_ENV === 'production' ? '/repository-name' : '',
  images: {
    unoptimized: true,
  },
  // Deaktiviere die Verwendung von React StrictMode für die Produktion
  reactStrictMode: process.env.NODE_ENV !== 'production',
}

export default nextConfig
