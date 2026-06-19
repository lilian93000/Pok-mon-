// Le basePath/export ne sont activés que pour le déploiement GitHub Pages
// (variables fournies par le workflow). En local et sur Vercel : config standard.
const isExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(isExport
    ? {
        output: "export",
        basePath: basePath || undefined,
        assetPrefix: basePath || undefined,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
