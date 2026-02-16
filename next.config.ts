import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
    compress: true,
    poweredByHeader: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: "/ph/static/:path*",
                destination: "https://us-assets.i.posthog.com/static/:path*",
            },
            {
                source: "/ph/:path*",
                destination: "https://us.i.posthog.com/:path*",
            },
        ];
    },
    skipTrailingSlashRedirect: true,
};

const withMDX = createMDX({
    extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
