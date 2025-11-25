import type { NextConfig } from "next";

type remotePatternType = {
    protocol: string;
    hostname: string;
    port?: string;
    pathname: string;
};

const remotePatterns: Array<remotePatternType> = [
    {
        protocol: "http",
        hostname: "localhost",
        port: process.env.NEXT_IMAGE_PORT ?? "3000",
        pathname: "/**",
    },
    {
        protocol: "https",
        hostname: "s3.ap-northeast-2.amazonaws.com",
        pathname: "/**",
    },
];

if (process.env.NEXT_IMAGE_HOSTNAME) {
    remotePatterns.push({
        protocol: "http",
        hostname: process.env.NEXT_IMAGE_HOSTNAME,
        port: process.env.NEXT_IMAGE_PORT ?? "3000",
        pathname: "/**",
    });
}

const nextConfig: NextConfig = {
    reactStrictMode: true,
    trailingSlash: true,
    images: {
        remotePatterns: remotePatterns as any,
    },
    basePath: process.env.NEXT_PUBLIC_LOCAL_SERVER_PREFIX
};

export default nextConfig;
