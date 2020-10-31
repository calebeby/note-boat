module.exports = (api) => {
  const isTest = api.env('test')
  if (!isTest) return {}
  return {
    presets: ['@babel/preset-typescript'],
    plugins: [
      ['const-enum', { transform: 'constObject' }],
      isTest && '@babel/plugin-transform-modules-commonjs',
    ].filter(Boolean),
  }
}
