import path from 'path';

const nextConfig = {
  distDir: 'dist',
  turbopack: {
    root: path.join(__dirname),
    rules: {
      '*.svg?url': {
        loaders: ['file-loader'],
        as: '*.js',
      },
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
