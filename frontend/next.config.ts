import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // The project root directory, which is the directory that contains the `node_modules` directory.
    // This is an absolute path.
    root: __dirname,
  },
};

export default nextConfig;
