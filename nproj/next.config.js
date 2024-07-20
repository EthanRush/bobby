/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'



const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  assetPrefix: isProd ? 'https://ethanrush.github.io/bobby/' : '',
  basePath: isProd ? '/bobby' : ''
}

module.exports = nextConfig
