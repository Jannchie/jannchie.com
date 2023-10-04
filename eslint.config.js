const antfu = require('@antfu/eslint-config').default

module.exports = antfu({}, {
  files: ['**/*.vue'],
  rules: {
    'vue/max-attributes-per-line': ['warn', {
      multiline: {
        max: 1,
      },
    }],
  },
})
