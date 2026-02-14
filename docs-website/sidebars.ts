import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/introduction',
        'getting-started/quick-start',
        'getting-started/installation',
        'getting-started/configuration',
      ],
    },
    {
      type: 'category',
      label: 'Pipelines',
      items: [
        'pipelines/concepts',
        'pipelines/creating',
        'pipelines/scheduling',
        'pipelines/transformations',
        'pipelines/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/data-warehousing',
        'guides/reverse-etl',
        'guides/security',
        'guides/best-practices',
      ],
    },
    {
      type: 'category',
      label: 'Community',
      items: [
        'community/contributing',
        'community/roadmap',
        'community/support',
      ],
    },
  ],

  connectorsSidebar: [
    'connectors/overview',
    {
      type: 'category',
      label: 'Sources',
      items: [
        'connectors/sources/stripe',
        'connectors/sources/slack',
        'connectors/sources/jira',
        'connectors/sources/salesforce',
        'connectors/sources/hubspot',
        'connectors/sources/shopify',
        'connectors/sources/mailchimp',
        'connectors/sources/zendesk',
        'connectors/sources/intercom',
        'connectors/sources/twilio',
        'connectors/sources/facebook-ads',
        'connectors/sources/google-analytics',
        'connectors/sources/github',
        'connectors/sources/airtable',
        'connectors/sources/asana',
        'connectors/sources/google-sheets',
        'connectors/sources/quickbooks',
      ],
    },
    {
      type: 'category',
      label: 'Destinations',
      items: [
        'connectors/destinations/postgres',
        'connectors/destinations/mysql',
        'connectors/destinations/snowflake',
        'connectors/destinations/bigquery',
        'connectors/destinations/redshift',
        'connectors/destinations/s3',
        'connectors/destinations/gcs',
        'connectors/destinations/mongodb',
        'connectors/destinations/sqlserver',
      ],
    },
  ],

  apiSidebar: [
    'api-reference/overview',
    'api-reference/authentication',
    'api-reference/pipelines',
    'api-reference/connectors',
    'api-reference/jobs',
    'api-reference/webhooks',
  ],
};

export default sidebars;
