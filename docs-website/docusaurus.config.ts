import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'OpenFuse',
  tagline: 'Open-source data integration platform for modern data teams',
  favicon: 'img/favicon.ico',

  url: 'https://your-username.github.io',
  baseUrl: '/openfuse/',

  organizationName: 'your-username',
  projectName: 'openfuse',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/your-username/openfuse/tree/main/docs-website/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  themeConfig: {
    image: 'img/openfuse-social-card.jpg',
    metadata: [
      {
        name: 'description',
        content: 'OpenFuse is an open-source data integration platform that lets you extract, transform, and load (ETL) data from 30+ sources into your analytics warehouse.',
      },
      {
        name: 'keywords',
        content: 'ETL, data integration, data pipeline, open source, analytics, ELT, data warehouse, connectors, integrations',
      },
      {
        property: 'og:title',
        content: 'OpenFuse - Open Source Data Integration Platform',
      },
      {
        property: 'og:description',
        content: 'Extract, transform, and load data from 30+ sources into your analytics warehouse with OpenFuse.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'OpenFuse - Open Source Data Integration Platform',
      },
      {
        name: 'twitter:description',
        content: 'Extract, transform, and load data from 30+ sources into your analytics warehouse with OpenFuse.',
      },
    ],
    announcementBar: {
      id: 'announcement',
      content: 'OpenFuse v1.0 is now available! <a href="/openfuse/docs/getting-started/quick-start">Get Started</a>',
      backgroundColor: '#2563eb',
      textColor: '#ffffff',
      isCloseable: true,
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'OpenFuse',
      logo: {
        alt: 'OpenFuse Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'docSidebar',
          sidebarId: 'connectorsSidebar',
          position: 'left',
          label: 'Connectors',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API',
        },
        {
          href: 'https://github.com/your-username/openfuse',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://discord.gg/openfuse',
          label: 'Discord',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/openfuse/docs/getting-started/introduction',
            },
            {
              label: 'Quick Start',
              to: '/openfuse/docs/getting-started/quick-start',
            },
            {
              label: 'Installation',
              to: '/openfuse/docs/getting-started/installation',
            },
          ],
        },
        {
          title: 'Connectors',
          items: [
            {
              label: 'All Connectors',
              to: '/openfuse/docs/connectors/overview',
            },
            {
              label: 'Sources',
              to: '/openfuse/docs/connectors/sources/stripe',
            },
            {
              label: 'Destinations',
              to: '/openfuse/docs/connectors/destinations/postgres',
            },
          ],
        },
        {
          title: 'API Reference',
          items: [
            {
              label: 'Authentication',
              to: '/openfuse/docs/api-reference/authentication',
            },
            {
              label: 'Pipelines',
              to: '/openfuse/docs/api-reference/pipelines',
            },
            {
              label: 'Connectors API',
              to: '/openfuse/docs/api-reference/connectors',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Contributing',
              to: '/openfuse/docs/community/contributing',
            },
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/your-username/openfuse/discussions',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/openfuse',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} OpenFuse. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml', 'python'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
