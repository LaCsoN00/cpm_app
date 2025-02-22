
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withWorkbox = require('next-with-workbox')

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: {
      resolveAlias: {
        underscore: 'lodash',
        mocha: { browser: 'mocha/browser-entry.js' },
      },
    },
  },
}

const plugins = [
  withWorkbox,
]

module.exports = plugins.reduce((acc, curr) => {
  if (curr.name === 'withWorkbox') {
    return curr(acc, { workbox: { swSrc: 'service-worker.js' } })
  }
  return curr(acc)
}, nextConfig)