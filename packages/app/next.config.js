/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config, {isServer, webpack}) {
    config.devtool = "eval-source-map";

    if (isServer) {
      config.plugins.push(new webpack.IgnorePlugin(/^wagmi$/));
    }

    return config;
  },
};

const withTM = require("next-transpile-modules")(["date-fns"]); // pass the modules you would like to see transpiled

module.exports = withTM(nextConfig);
