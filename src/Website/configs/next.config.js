// next.config.js
const withPlugins = require('next-compose-plugins')
const withSourceMaps = require('@zeit/next-source-maps')
const path = require('path')

module.exports = withPlugins([
  [withSourceMaps],
])

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: `
              accelerometer=(),
              camera=(),
              geolocation=(self),
              microphone=(),
              payment=(),
              usb=()
            `.replace(/\s+/g, ' ').trim(), 
          },
        ],
      },
    ];
  },
};
module.exports = {
  async redirects() {
    return [
      {
        source: '/initiative/knowledge-management',
        destination: '/knowledge-management',
        permanent: true,
      },
      {
        source: '/ex-connect-nc',
        destination: '/ex-connect-nyc/lunch-and-learn',
        permanent: true,
      },
      {
        source: '/ex-connect-nyc',
        destination: '/ex-connect-nyc/lunch-and-learn',
        permanent: true,
      },
      {
        source: '/blog/employee-mental-…th-at-workplaces/',
        destination: '/blog/employee-mental-health-at-workplaces',
        permanent: true,
      },
      {
        source: '/engagement.html',
        destination: '/initiative/employee-engagement-software',
        permanent: true,
      },
      {
        source: '/function',
        destination: '/',
        permanent: true,
      },
      {
        source: '/ai-glossary/%5Bblog%5D',
        destination: '/ai-glossary',
        permanent: true,
      },
      {
        source: '/blog/hr-tech-improve-employee-experience/_wp_link_placeholder',
        destination: '/blog/hr-tech-improve-employee-experience',
        permanent: true,
      },
      {
        source: '/use-cases',
        destination: '/',
        permanent: true,
      },
      {
        source: '/initiative',
        destination: '/',
        permanent: true,
      },
      {
        source: '/labs',
        destination: '/labs/knowledge-gpt',
        permanent: true,
      },
      {
        source: '/helpdesk-insights',
        destination: '/use-cases/helpdesk-insights',
        permanent: true,
      },
      {
        source: '/employee-engagement-in-a-hybrid-workplace-report-2022',
        destination: '/employee-engagement-in-a-hybrid-workplace-report',
        permanent: true,
      },
      {
        source: '/employee-engagement-survey-2',
        destination: '/employee-engagement-survey',
        permanent: true,
      },
      {
        source: '/employee-engagement-product',
        destination: '/employee-engagement',
        permanent: true,
      },
      {
        source: '/airasia-employee-query-resolution',
        destination: '/case-studies',
        permanent: true,
      },
      {
        source: '/lead',
        destination: '/case-studies',
        permanent: true,
      },
    ]
  },
}