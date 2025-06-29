// Comment this code block if you want the analytes landing page

const nextConfig = {
  async redirects() {
    return [{
      source: '/',
      destination: '/customer-login',
      permanent: false,
    }];
  },
  experimental: {
    clientRouterFilter: true,
    clientRouterFilterRedirects: true,
  }
};



// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
// this is the analytes landing page by default