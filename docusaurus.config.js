/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Tyro2D',
  tagline: '一个简单的 HTML5 2D 游戏引擎',
  favicon: 'img/favicon.ico',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  baseUrlIssueBanner: true,

  organizationName: 'facebook',
  projectName: 'Tyro2d',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  staticDirectories: ['docs/static'],
  scripts: [],
  stylesheets: [],

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
        },
        blog: false,
      }),
    ],
  ],
};

module.exports = config;
