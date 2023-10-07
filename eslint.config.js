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
}, {
  rules: {
    'curly': ['error', 'multi-line'],
    'max-statements-per-line': ['warn', { max: 2 }],
    'no-console': 'warn',
  },
})
