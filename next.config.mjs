/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback, // preserve existing fallbacks
            fs: false, // Disable 'fs' for client-side

        };

        

        return config;
    },
};

export default nextConfig;

