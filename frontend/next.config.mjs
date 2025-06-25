// Comment this code block if you want the analytes landing page

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/customer-login',
        permanent: false, // Set to true for a 308 redirect (SEO-friendly)
      },
    ];
  },
};

export default nextConfig;



// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
// this is the analytes landing page by default