/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/Meu-Portifolio",
  assetPrefix: "/Meu-Portifolio/",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
