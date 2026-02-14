export interface Connector {
  name: string;
  title: string;
  description: string;
  tags: string[];
}

export interface Pipeline {
  id?: number;
  name: string;
  source_connector: string;
  destination_connector: string;
  source_config?: Record<string, any>;
  destination_config?: Record<string, any>;
  status?: string;
  schedule_cron?: string | null;
  replication_mode?: string;
  incremental_key?: string | null;
  batch_size?: number;
}

export const mockConnectors: Connector[] = [
  {
    name: 'slack',
    title: 'Slack',
    description: 'Send notifications and orchestrate workflows using Slack channels and threads.',
    tags: ['communication', 'notifications']
  },
  {
    name: 'snowflake',
    title: 'Snowflake',
    description: 'Ingest analytics-ready datasets into Snowflake with automatic schema evolution.',
    tags: ['data', 'warehouse']
  },
  {
    name: 'postgres',
    title: 'PostgreSQL',
    description: 'Extract data from PostgreSQL databases with full table or incremental replication.',
    tags: ['database']
  },
  {
    name: 'snowflake_destination',
    title: 'Snowflake (Destination)',
    description: 'Load data into Snowflake data warehouses.',
    tags: ['data', 'warehouse', 'destination']
  },
  {
    name: 'salesforce',
    title: 'Salesforce',
    description: 'Synchronize accounts, opportunities, and leads with bidirectional syncing.',
    tags: ['crm', 'enterprise']
  },
  {
    name: 'mysql',
    title: 'MySQL',
    description: 'Extract data from MySQL databases with full table or incremental replication.',
    tags: ['database']
  },
  {
    name: 'bigquery',
    title: 'Google BigQuery',
    description: 'Load data into Google BigQuery data warehouses.',
    tags: ['data', 'warehouse']
  },
  {
    name: 'redshift',
    title: 'Amazon Redshift',
    description: 'Load data into Amazon Redshift data warehouses.',
    tags: ['data', 'warehouse']
  }
];

export const mockPipeline: Pipeline = {
  name: 'Test Pipeline',
  source_connector: 'slack',
  destination_connector: 'snowflake',
  source_config: {},
  destination_config: {},
  status: 'draft'
};

export const mockPipelines: Pipeline[] = [
  {
    id: 1,
    name: 'Slack to Snowflake',
    source_connector: 'slack',
    destination_connector: 'snowflake',
    source_config: {},
    destination_config: {},
    status: 'draft'
  },
  {
    id: 2,
    name: 'PostgreSQL to BigQuery',
    source_connector: 'postgres',
    destination_connector: 'bigquery',
    source_config: {},
    destination_config: {},
    status: 'active'
  }
];
