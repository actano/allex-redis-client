module.exports = {
  plugins: [
    'add-module-exports',
  ],
  presets: [
    ['@babel/env', {
      targets: {
        node: 'current',
      },
    }],
    '@babel/typescript',
  ],
}
