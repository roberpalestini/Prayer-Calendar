/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};


// for transpiling all ESM @fullcalendar/* packages
// also, for piping fullcalendar thru babel (to learn why, see babel.config.js)
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/interaction',
  '@fullcalendar/resource-timeline',
  '@fullcalendar/timeline',
  '@fullcalendar/daygrid',
  '@fullcalendar/core',
])


module.exports = withTM({
  experimental: {
    forceSwcTransforms: true,
  },
  images: {
    disableStaticImages: true,
      dangerouslyAllowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  nextConfig,
})
