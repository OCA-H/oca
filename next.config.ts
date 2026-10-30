import type { NextConfig } from "next";

/** Hostname of APP_URL, e.g. www.oldcolumban.net when testing CCAvenue against the registered domain locally. */
const appHost = (() => {
  try {
    return new URL(process.env.APP_URL ?? "").hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  // `next dev` only serves its scripts to localhost; without this, a page opened on APP_URL's
  // domain renders but never becomes interactive. Development only; no effect on production.
  allowedDevOrigins: appHost && appHost !== "localhost" ? [appHost] : [],
  cacheComponents: true,
  experimental: {
    // Requests to /api/sv pass through proxy.ts, which buffers bodies up to this size (default 10mb).
    // Uploads are capped by their own rules (images 10 MB, Hangout videos 20 MB); this leaves room
    // for the multipart wrapping.
    proxyClientMaxBodySize: "21mb",
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
