// @ts-check
const prefresh = require('@prefresh/vite')

/** @type {import('vite').UserConfig} */
const config = {
  jsx: {
    factory: 'h',
    fragment: 'Fragment',
  },
  plugins: [prefresh()],
}

module.exports = config
