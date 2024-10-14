/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Enable React Strict Mode for catching potential problems
    swcMinify: true, // Enable SWC minification for smaller build size

    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback, // Preserve existing fallbacks
            fs: false, // Disable 'fs' for client-side
        };

        return config;
    },
};

export default nextConfig;
