/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@workspace/ui'],
  // Ensure proper build behavior on Vercel
  ...(process.env.VERCEL && {
    experimental: {
      outputFileTracingIgnores: ['**/.next/cache/**'],
    },
  }),
};

export default nextConfig;
