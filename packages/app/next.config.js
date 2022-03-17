/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.devtool = "eval-source-map";
    return config;
  },
  experimental: { 
    externalDir: true,
  }
}

const withTM = require('next-transpile-modules')(["date-fns"]); // pass the modules you would like to see transpiled

module.exports = withTM(nextConfig);
