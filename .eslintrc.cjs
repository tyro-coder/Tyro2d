const { getESLintConfig } = require('@applint/spec');

module.exports = getESLintConfig(
  'common-ts',
  {
    rules: { 'id-length': 'off' },
  },
);
