import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

const BASE_PATH = "/Meu-Portifolio";

/** @type {(phase: string) => import('next').NextConfig} */
const nextConfig = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    // "output: export" não roda em "next dev" e não suporta redirects/rewrites,
    // então só é aplicado no build de produção (usado pelo GitHub Pages).
    ...(isDev ? {} : { output: "export" }),
    basePath: BASE_PATH,
    assetPrefix: `${BASE_PATH}/`,
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
    // Conveniência só em dev: localhost:3000/ (sem o basePath) redireciona
    // direto para localhost:3000/Meu-Portifolio/, em vez de dar 404.
    ...(isDev
      ? {
          async redirects() {
            return [
              {
                source: "/",
                destination: `${BASE_PATH}/`,
                basePath: false,
                permanent: false,
              },
            ];
          },
        }
      : {}),
  };
};

export default nextConfig;
