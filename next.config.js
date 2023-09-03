/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['ojfedpzmizfnveluqprs.supabase.co'],
  }
}

module.exports = nextConfig
