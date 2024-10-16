/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*bucket.programmingmy.com",
            }
        ]
    }
};

export default nextConfig;
