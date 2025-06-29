// Comment this code block if you want the analytes landing page

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/customer-login',
        permanent: false,
      },
    ];
  },
};

export default nextConfig; // ✅ use 'export default' in .mjs


// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
// this is the analytes landing page by default