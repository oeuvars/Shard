import type { NextConfig } from 'next';
import { withNextVideo } from 'next-video/process';

/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'o5sg8eau7u.ufs.sh',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withNextVideo(nextConfig, {
  provider: 'amazon-s3',
  providerConfig: {
    'amazon-s3': {
      endpoint: 'https://s3.amazonaws.com',
    },
  },
});
