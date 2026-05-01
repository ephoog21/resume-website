/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The site is content-only (no DB, no API routes), so we keep the bundle lean
  // and let Next handle font subsetting + image optimization for the static
  // layer. Add images.remotePatterns here if you ever swap the placeholder
  // headshot for a hosted asset.
};

module.exports = nextConfig;
