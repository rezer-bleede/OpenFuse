// Auto-generated fallback connector catalogue from API registry metadata.
// Regenerate by running: python3 scripts/generate_connector_catalog.py

export const fallbackConnectorCatalog = [
  {
    "name": "airtable",
    "title": "Airtable",
    "description": "Extract data from Airtable bases and tables",
    "tags": [
      "database",
      "source",
      "airtable",
      "saas",
      "collaboration"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "api_key": {
          "type": "string",
          "title": "API Key",
          "format": "password"
        },
        "base_id": {
          "type": "string",
          "title": "Base ID"
        },
        "table_ids": {
          "type": "array",
          "title": "Table IDs",
          "items": {
            "type": "string"
          },
          "description": "Specific table IDs to extract (empty = all)"
        }
      },
      "required": [
        "api_key",
        "base_id"
      ]
    }
  },
  {
    "name": "airtable_destination",
    "title": "Airtable (Destination)",
    "description": "Load data into Airtable bases and tables",
    "tags": [
      "database",
      "destination",
      "airtable",
      "saas",
      "collaboration"
    ],
    "capabilities": [
      "destination"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "api_key": {
          "type": "string",
          "title": "API Key",
          "format": "password"
        },
        "base_id": {
          "type": "string",
          "title": "Base ID"
        },
        "table_id": {
          "type": "string",
          "title": "Table ID"
        }
      },
      "required": [
        "api_key",
        "base_id",
        "table_id"
      ]
    }
  },
  {
    "name": "asana",
    "title": "Asana",
    "description": "Extract data from Asana (Tasks, Projects, Stories, Users)",
    "tags": [
      "project management",
      "source",
      "asana",
      "saas",
      "productivity"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "access_token": {
          "type": "string",
          "title": "Access Token",
          "format": "password"
        },
        "workspace_id": {
          "type": "string",
          "title": "Workspace ID"
        },
        "project_ids": {
          "type": "array",
          "title": "Project IDs",
          "items": {
            "type": "string"
          },
          "description": "Specific project IDs (empty = all)"
        },
        "objects": {
          "type": "array",
          "title": "Objects",
          "items": {
            "type": "string"
          },
          "description": "Asana objects to replicate",
          "default": [
            "tasks",
            "projects"
          ]
        }
      },
      "required": [
        "access_token"
      ]
    }
  },
  {
    "name": "bigquery",
    "title": "Google BigQuery",
    "description": "Load data into Google BigQuery data warehouses",
    "tags": [
      "data warehouse",
      "destination",
      "bigquery",
      "gcp",
      "google"
    ],
    "capabilities": [
      "destination"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "project_id": {
          "type": "string",
          "title": "Project ID",
          "description": "GCP project ID"
        },
        "dataset": {
          "type": "string",
          "title": "Dataset",
          "description": "BigQuery dataset name"
        },
        "credentials_json": {
          "type": "string",
          "title": "Credentials JSON",
          "description": "GCP service account JSON credentials",
          "format": "password"
        },
        "location": {
          "type": "string",
          "title": "Location",
          "default": "US"
        },
        "file_format": {
          "type": "string",
          "title": "File Format",
          "enum": [
            "CSV",
            "NEWLINE_DELIMITED_JSON",
            "PARQUET"
          ],
          "default": "CSV"
        }
      },
      "required": [
        "project_id",
        "dataset"
      ]
    }
  },
  {
    "name": "bigquery_source",
    "title": "Google BigQuery (Source)",
    "description": "Extract data from Google BigQuery",
    "tags": [
      "data warehouse",
      "source",
      "bigquery",
      "gcp",
      "google"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "project_id": {
          "type": "string",
          "title": "Project ID",
          "description": "GCP project ID"
        },
        "dataset": {
          "type": "string",
          "title": "Dataset",
          "description": "BigQuery dataset name"
        },
        "credentials_json": {
          "type": "string",
          "title": "Credentials JSON",
          "description": "GCP service account JSON credentials",
          "format": "password"
        },
        "tables": {
          "type": "array",
          "title": "Tables",
          "items": {
            "type": "string"
          },
          "description": "List of tables to replicate (empty = all tables)"
        },
        "location": {
          "type": "string",
          "title": "Location",
          "default": "US"
        }
      },
      "required": [
        "project_id",
        "dataset"
      ]
    }
  },
  {
    "name": "example",
    "title": "Example JSON Source",
    "description": "Fetches JSON from a public endpoint and stores it in the OpenFuse lake.",
    "tags": [
      "source",
      "community"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "endpoint": {
          "type": "string",
          "format": "uri",
          "title": "Endpoint URL",
          "description": "HTTP endpoint returning JSON payloads."
        },
        "auth_token": {
          "type": "string",
          "title": "Auth Token",
          "description": "Optional bearer token used for authenticated requests."
        }
      },
      "required": [
        "endpoint"
      ],
      "additionalProperties": false
    }
  },
  {
    "name": "facebook_ads",
    "title": "Facebook Ads",
    "description": "Extract data from Facebook Ads (Campaigns, AdSets, Ads, Insights)",
    "tags": [
      "advertising",
      "source",
      "facebook",
      "meta",
      "marketing"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "access_token": {
          "type": "string",
          "title": "Access Token",
          "description": "Facebook Marketing API access token",
          "format": "password"
        },
        "ad_account_id": {
          "type": "string",
          "title": "Ad Account ID",
          "description": "Facebook Ad Account ID (format: act_XXXXXX)"
        },
        "objects": {
          "type": "array",
          "title": "Objects",
          "items": {
            "type": "string"
          },
          "description": "Facebook Ads objects to replicate",
          "default": [
            "campaigns",
            "adsets",
            "ads",
            "insights"
          ]
        },
        "date_preset": {
          "type": "string",
          "title": "Date Preset",
          "description": "Predefined date range for insights",
          "enum": [
            "today",
            "yesterday",
            "last_7d",
            "last_30d",
            "this_month",
            "last_month"
          ],
          "default": "last_30d"
        }
      },
      "required": [
        "access_token",
        "ad_account_id"
      ]
    }
  },
  {
    "name": "gcs",
    "title": "Google Cloud Storage",
    "description": "Extract data files from Google Cloud Storage buckets (CSV, JSON, Parquet)",
    "tags": [
      "cloud",
      "source",
      "gcs",
      "storage",
      "google"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "bucket": {
          "type": "string",
          "title": "Bucket Name"
        },
        "prefix": {
          "type": "string",
          "title": "Prefix",
          "description": "Folder prefix to filter objects"
        },
        "credentials_json": {
          "type": "string",
          "title": "Credentials JSON",
          "description": "GCP service account JSON credentials",
          "format": "password"
        },
        "file_format": {
          "type": "string",
          "title": "File Format",
          "enum": [
            "csv",
            "json",
            "parquet"
          ],
          "default": "csv"
        }
      },
      "required": [
        "bucket"
      ]
    }
  },
  {
    "name": "gcs_destination",
    "title": "Google Cloud Storage (Destination)",
    "description": "Load data files to Google Cloud Storage buckets (CSV, JSON, Parquet)",
    "tags": [
      "cloud",
      "destination",
      "gcs",
      "storage",
      "google"
    ],
    "capabilities": [
      "destination"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "bucket": {
          "type": "string",
          "title": "Bucket Name"
        },
        "prefix": {
          "type": "string",
          "title": "Prefix",
          "description": "Folder prefix for uploaded files"
        },
        "credentials_json": {
          "type": "string",
          "title": "Credentials JSON",
          "description": "GCP service account JSON credentials",
          "format": "password"
        },
        "file_format": {
          "type": "string",
          "title": "File Format",
          "enum": [
            "csv",
            "json",
            "parquet"
          ],
          "default": "csv"
        }
      },
      "required": [
        "bucket"
      ]
    }
  },
  {
    "name": "github",
    "title": "GitHub",
    "description": "Extract data from GitHub (Issues, PRs, Commits, Releases, Contributors)",
    "tags": [
      "developer",
      "source",
      "github",
      "saas",
      "version control"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "token": {
          "type": "string",
          "title": "Personal Access Token",
          "format": "password"
        },
        "owner": {
          "type": "string",
          "title": "Repository Owner",
          "description": "GitHub username or organization"
        },
        "repo": {
          "type": "string",
          "title": "Repository Name"
        },
        "objects": {
          "type": "array",
          "title": "Objects",
          "items": {
            "type": "string"
          },
          "description": "GitHub objects to replicate",
          "default": [
            "issues",
            "pull_requests",
            "commits",
            "releases"
          ]
        }
      },
      "required": [
        "token",
        "owner",
        "repo"
      ]
    }
  },
  {
    "name": "google_analytics",
    "title": "Google Analytics",
    "description": "Extract data from Google Analytics 4 (GA4) reports",
    "tags": [
      "analytics",
      "source",
      "google",
      "saas",
      "marketing"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "property_id": {
          "type": "string",
          "title": "Property ID",
          "description": "GA4 property ID"
        },
        "credentials_json": {
          "type": "string",
          "title": "Credentials JSON",
          "description": "GCP service account JSON credentials",
          "format": "password"
        },
        "start_date": {
          "type": "string",
          "title": "Start Date",
          "description": "Start date in YYYY-MM-DD format",
          "default": "30daysAgo"
        },
        "metrics": {
          "type": "array",
          "title": "Metrics",
          "items": {
            "type": "string"
          },
          "default": [
            "sessions",
            "users",
            "pageviews",
            "bounceRate"
          ]
        },
        "dimensions": {
          "type": "array",
          "title": "Dimensions",
          "items": {
            "type": "string"
          },
          "default": [
            "date",
            "country",
            "deviceCategory"
          ]
        }
      },
      "required": [
        "property_id"
      ]
    }
  },
  {
    "name": "google_sheets",
    "title": "Google Sheets",
    "description": "Extract data from Google Sheets spreadsheets",
    "tags": [
      "spreadsheet",
      "source",
      "google",
      "sheets"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "spreadsheet_id": {
          "type": "string",
          "title": "Spreadsheet ID",
          "description": "Google Sheets ID from URL"
        },
        "credentials_json": {
          "type": "string",
          "title": "Credentials JSON",
          "description": "GCP service account JSON credentials",
          "format": "password"
        },
        "sheet_names": {
          "type": "array",
          "title": "Sheet Names",
          "items": {
            "type": "string"
          },
          "description": "Specific sheets to extract (empty = all sheets)"
        },
        "header_row": {
          "type": "integer",
          "title": "Header Row",
          "default": 1
        }
      },
      "required": [
        "spreadsheet_id"
      ]
    }
  },
  {
    "name": "google_sheets_destination",
    "title": "Google Sheets (Destination)",
    "description": "Load data into Google Sheets spreadsheets",
    "tags": [
      "spreadsheet",
      "destination",
      "google",
      "sheets"
    ],
    "capabilities": [
      "destination"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "spreadsheet_id": {
          "type": "string",
          "title": "Spreadsheet ID",
          "description": "Google Sheets ID from URL"
        },
        "credentials_json": {
          "type": "string",
          "title": "Credentials JSON",
          "description": "GCP service account JSON credentials",
          "format": "password"
        },
        "sheet_name": {
          "type": "string",
          "title": "Sheet Name",
          "default": "Sheet1"
        }
      },
      "required": [
        "spreadsheet_id"
      ]
    }
  },
  {
    "name": "hubspot",
    "title": "HubSpot",
    "description": "Extract data from HubSpot CRM (Contacts, Companies, Deals, Tickets)",
    "tags": [
      "crm",
      "source",
      "hubspot",
      "saas",
      "marketing"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "api_key": {
          "type": "string",
          "title": "API Key",
          "description": "HubSpot private app access token",
          "format": "password"
        },
        "objects": {
          "type": "array",
          "title": "Objects",
          "items": {
            "type": "string"
          },
          "description": "HubSpot objects to replicate",
          "default": [
            "contacts",
            "companies",
            "deals",
            "tickets"
          ]
        }
      },
      "required": [
        "api_key"
      ]
    }
  },
  {
    "name": "intercom",
    "title": "Intercom",
    "description": "Extract data from Intercom (Contacts, Conversations, Users, Teams)",
    "tags": [
      "messaging",
      "source",
      "intercom",
      "saas",
      "customer support"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "access_token": {
          "type": "string",
          "title": "Access Token",
          "format": "password"
        },
        "objects": {
          "type": "array",
          "title": "Objects",
          "items": {
            "type": "string"
          },
          "description": "Intercom objects to replicate",
          "default": [
            "contacts",
            "conversations",
            "teams"
          ]
        }
      },
      "required": [
        "access_token"
      ]
    }
  },
  {
    "name": "jira",
    "title": "Jira",
    "description": "Extract data from Jira (Issues, Projects, Boards, Sprints)",
    "tags": [
      "project management",
      "source",
      "jira",
      "saas",
      "agile"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "title": "Domain",
          "description": "Your Jira domain (e.g., company.atlassian.net)"
        },
        "email": {
          "type": "string",
          "title": "Email"
        },
        "api_token": {
          "type": "string",
          "title": "API Token",
          "format": "password"
        },
        "project_keys": {
          "type": "array",
          "title": "Project Keys",
          "items": {
            "type": "string"
          },
          "description": "Specific project keys (empty = all)"
        },
        "objects": {
          "type": "array",
          "title": "Objects",
          "items": {
            "type": "string"
          },
          "description": "Jira objects to replicate",
          "default": [
            "issues",
            "projects"
          ]
        }
      },
      "required": [
        "domain",
        "email",
        "api_token"
      ]
    }
  },
  {
    "name": "mailchimp",
    "title": "Mailchimp",
    "description": "Extract data from Mailchimp (Lists, Members, Campaigns, Automations)",
    "tags": [
      "marketing",
      "source",
      "mailchimp",
      "saas",
      "email"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "api_key": {
          "type": "string",
          "title": "API Key",
          "description": "Mailchimp API key",
          "format": "password"
        },
        "dc": {
          "type": "string",
          "title": "Data Center",
          "description": "Mailchimp data center (e.g., us1, us2)"
        },
        "objects": {
          "type": "array",
          "title": "Objects",
          "items": {
            "type": "string"
          },
          "description": "Mailchimp objects to replicate",
          "default": [
            "lists",
            "members",
            "campaigns"
          ]
        }
      },
      "required": [
        "api_key",
        "dc"
      ]
    }
  },
  {
    "name": "mongodb",
    "title": "MongoDB",
    "description": "Extract data from MongoDB databases with full or incremental replication",
    "tags": [
      "database",
      "source",
      "mongodb",
      "nosql"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "host": {
          "type": "string",
          "title": "Host",
          "default": "localhost"
        },
        "port": {
          "type": "integer",
          "title": "Port",
          "default": 27017
        },
        "database": {
          "type": "string",
          "title": "Database",
          "description": "Database name"
        },
        "username": {
          "type": "string",
          "title": "Username"
        },
        "password": {
          "type": "string",
          "title": "Password",
          "format": "password"
        },
        "tls": {
          "type": "boolean",
          "title": "Use TLS",
          "default": false
        },
        "collections": {
          "type": "array",
          "title": "Collections",
          "items": {
            "type": "string"
          },
          "description": "List of collections to replicate (empty = all)"
        }
      },
      "required": [
        "host",
        "database"
      ]
    }
  },
  {
    "name": "mongodb_destination",
    "title": "MongoDB (Destination)",
    "description": "Load data into MongoDB databases",
    "tags": [
      "database",
      "destination",
      "mongodb",
      "nosql"
    ],
    "capabilities": [
      "destination"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "host": {
          "type": "string",
          "title": "Host",
          "default": "localhost"
        },
        "port": {
          "type": "integer",
          "title": "Port",
          "default": 27017
        },
        "database": {
          "type": "string",
          "title": "Database",
          "description": "Database name"
        },
        "username": {
          "type": "string",
          "title": "Username"
        },
        "password": {
          "type": "string",
          "title": "Password",
          "format": "password"
        },
        "tls": {
          "type": "boolean",
          "title": "Use TLS",
          "default": false
        }
      },
      "required": [
        "host",
        "database"
      ]
    }
  },
  {
    "name": "mysql",
    "title": "MySQL",
    "description": "Extract data from MySQL databases with full table or incremental replication",
    "tags": [
      "database",
      "source",
      "mysql"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "host": {
          "type": "string",
          "title": "Host",
          "default": "localhost"
        },
        "port": {
          "type": "integer",
          "title": "Port",
          "default": 3306
        },
        "database": {
          "type": "string",
          "title": "Database",
          "description": "Database name"
        },
        "username": {
          "type": "string",
          "title": "Username"
        },
        "password": {
          "type": "string",
          "title": "Password",
          "format": "password"
        },
        "ssl": {
          "type": "boolean",
          "title": "Use SSL",
          "default": false
        },
        "tables": {
          "type": "array",
          "title": "Tables",
          "items": {
            "type": "string"
          },
          "description": "List of tables to replicate (empty = all tables)"
        }
      },
      "required": [
        "host",
        "database",
        "username",
        "password"
      ]
    }
  },
  {
    "name": "mysql_destination",
    "title": "MySQL (Destination)",
    "description": "Load data into MySQL databases",
    "tags": [
      "database",
      "destination",
      "mysql"
    ],
    "capabilities": [
      "destination"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "host": {
          "type": "string",
          "title": "Host",
          "default": "localhost"
        },
        "port": {
          "type": "integer",
          "title": "Port",
          "default": 3306
        },
        "database": {
          "type": "string",
          "title": "Database",
          "description": "Database name"
        },
        "username": {
          "type": "string",
          "title": "Username"
        },
        "password": {
          "type": "string",
          "title": "Password",
          "format": "password"
        },
        "ssl": {
          "type": "boolean",
          "title": "Use SSL",
          "default": false
        },
        "truncate_before_load": {
          "type": "boolean",
          "title": "Truncate Before Load",
          "description": "Truncate tables before loading data",
          "default": false
        }
      },
      "required": [
        "host",
        "database",
        "username",
        "password"
      ]
    }
  },
  {
    "name": "postgres",
    "title": "PostgreSQL",
    "description": "Extract data from PostgreSQL databases with full table or incremental replication",
    "tags": [
      "database",
      "source",
      "postgresql"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "host": {
          "type": "string",
          "title": "Host",
          "default": "localhost"
        },
        "port": {
          "type": "integer",
          "title": "Port",
          "default": 5432
        },
        "database": {
          "type": "string",
          "title": "Database",
          "description": "Database name"
        },
        "username": {
          "type": "string",
          "title": "Username"
        },
        "password": {
          "type": "string",
          "title": "Password",
          "format": "password"
        },
        "ssl_mode": {
          "type": "string",
          "title": "SSL Mode",
          "enum": [
            "disable",
            "require",
            "verify-full"
          ],
          "default": "disable"
        },
        "tables": {
          "type": "array",
          "title": "Tables",
          "items": {
            "type": "string"
          },
          "description": "List of tables to replicate (empty = all tables)"
        },
        "schema": {
          "type": "string",
          "title": "Schema",
          "default": "public"
        }
      },
      "required": [
        "host",
        "database",
        "username",
        "password"
      ]
    }
  },
  {
    "name": "postgres_destination",
    "title": "PostgreSQL (Destination)",
    "description": "Load data into PostgreSQL databases",
    "tags": [
      "database",
      "destination",
      "postgresql"
    ],
    "capabilities": [
      "destination"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "host": {
          "type": "string",
          "title": "Host",
          "default": "localhost"
        },
        "port": {
          "type": "integer",
          "title": "Port",
          "default": 5432
        },
        "database": {
          "type": "string",
          "title": "Database",
          "description": "Database name"
        },
        "username": {
          "type": "string",
          "title": "Username"
        },
        "password": {
          "type": "string",
          "title": "Password",
          "format": "password"
        },
        "ssl_mode": {
          "type": "string",
          "title": "SSL Mode",
          "enum": [
            "disable",
            "require",
            "verify-full"
          ],
          "default": "disable"
        },
        "schema": {
          "type": "string",
          "title": "Schema",
          "default": "public"
        },
        "truncate_before_load": {
          "type": "boolean",
          "title": "Truncate Before Load",
          "description": "Truncate tables before loading data",
          "default": false
        }
      },
      "required": [
        "host",
        "database",
        "username",
        "password"
      ]
    }
  },
  {
    "name": "quickbooks",
    "title": "QuickBooks",
    "description": "Extract data from QuickBooks Online (Invoices, Customers, Payments, Products)",
    "tags": [
      "accounting",
      "source",
      "quickbooks",
      "saas",
      "finance"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "realm_id": {
          "type": "string",
          "title": "Realm ID",
          "description": "QuickBooks Company ID"
        },
        "access_token": {
          "type": "string",
          "title": "Access Token",
          "format": "password"
        },
        "refresh_token": {
          "type": "string",
          "title": "Refresh Token",
          "format": "password"
        },
        "client_id": {
          "type": "string",
          "title": "Client ID"
        },
        "client_secret": {
          "type": "string",
          "title": "Client Secret",
          "format": "password"
        },
        "objects": {
          "type": "array",
          "title": "Objects",
          "items": {
            "type": "string"
          },
          "description": "QuickBooks objects to replicate",
          "default": [
            "Invoice",
            "Customer",
            "Payment",
            "Item"
          ]
        }
      },
      "required": [
        "realm_id",
        "access_token",
        "client_id"
      ]
    }
  },
  {
    "name": "redshift",
    "title": "Amazon Redshift",
    "description": "Load data into Amazon Redshift data warehouses",
    "tags": [
      "data warehouse",
      "destination",
      "redshift",
      "aws",
      "amazon"
    ],
    "capabilities": [
      "destination"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "host": {
          "type": "string",
          "title": "Host",
          "description": "Redshift cluster endpoint"
        },
        "port": {
          "type": "integer",
          "title": "Port",
          "default": 5439
        },
        "database": {
          "type": "string",
          "title": "Database"
        },
        "username": {
          "type": "string",
          "title": "Username"
        },
        "password": {
          "type": "string",
          "title": "Password",
          "format": "password"
        },
        "iam_role": {
          "type": "string",
          "title": "IAM Role",
          "description": "IAM role for S3 access"
        }
      },
      "required": [
        "host",
        "database",
        "username",
        "password"
      ]
    }
  },
  {
    "name": "redshift_source",
    "title": "Amazon Redshift (Source)",
    "description": "Extract data from Amazon Redshift data warehouses",
    "tags": [
      "data warehouse",
      "source",
      "redshift",
      "aws",
      "amazon"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "host": {
          "type": "string",
          "title": "Host",
          "description": "Redshift cluster endpoint"
        },
        "port": {
          "type": "integer",
          "title": "Port",
          "default": 5439
        },
        "database": {
          "type": "string",
          "title": "Database"
        },
        "username": {
          "type": "string",
          "title": "Username"
        },
        "password": {
          "type": "string",
          "title": "Password",
          "format": "password"
        },
        "tables": {
          "type": "array",
          "title": "Tables",
          "items": {
            "type": "string"
          },
          "description": "List of tables to replicate (empty = all tables)"
        }
      },
      "required": [
        "host",
        "database",
        "username",
        "password"
      ]
    }
  },
  {
    "name": "s3",
    "title": "Amazon S3",
    "description": "Extract data files from Amazon S3 buckets (CSV, JSON, Parquet)",
    "tags": [
      "cloud",
      "source",
      "s3",
      "storage"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "access_key_id": {
          "type": "string",
          "title": "Access Key ID"
        },
        "secret_access_key": {
          "type": "string",
          "title": "Secret Access Key",
          "format": "password"
        },
        "region": {
          "type": "string",
          "title": "Region",
          "default": "us-east-1"
        },
        "bucket": {
          "type": "string",
          "title": "Bucket Name"
        },
        "prefix": {
          "type": "string",
          "title": "Prefix",
          "description": "Folder prefix to filter objects"
        },
        "file_format": {
          "type": "string",
          "title": "File Format",
          "enum": [
            "csv",
            "json",
            "parquet"
          ],
          "default": "csv"
        },
        "delimiter": {
          "type": "string",
          "title": "CSV Delimiter",
          "default": ","
        }
      },
      "required": [
        "access_key_id",
        "secret_access_key",
        "bucket"
      ]
    }
  },
  {
    "name": "s3_destination",
    "title": "Amazon S3 (Destination)",
    "description": "Load data files to Amazon S3 buckets (CSV, JSON, Parquet)",
    "tags": [
      "cloud",
      "destination",
      "s3",
      "storage"
    ],
    "capabilities": [
      "destination"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "access_key_id": {
          "type": "string",
          "title": "Access Key ID"
        },
        "secret_access_key": {
          "type": "string",
          "title": "Secret Access Key",
          "format": "password"
        },
        "region": {
          "type": "string",
          "title": "Region",
          "default": "us-east-1"
        },
        "bucket": {
          "type": "string",
          "title": "Bucket Name"
        },
        "prefix": {
          "type": "string",
          "title": "Prefix",
          "description": "Folder prefix for uploaded files"
        },
        "file_format": {
          "type": "string",
          "title": "File Format",
          "enum": [
            "csv",
            "json",
            "parquet"
          ],
          "default": "csv"
        },
        "delimiter": {
          "type": "string",
          "title": "CSV Delimiter",
          "default": ","
        }
      },
      "required": [
        "access_key_id",
        "secret_access_key",
        "bucket"
      ]
    }
  },
  {
    "name": "salesforce",
    "title": "Salesforce",
    "description": "Extract data from Salesforce CRM (Accounts, Contacts, Opportunities, etc.)",
    "tags": [
      "crm",
      "source",
      "salesforce",
      "saas",
      "enterprise"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "title": "Username",
          "description": "Salesforce username"
        },
        "password": {
          "type": "string",
          "title": "Password",
          "format": "password"
        },
        "security_token": {
          "type": "string",
          "title": "Security Token",
          "format": "password"
        },
        "login_url": {
          "type": "string",
          "title": "Login URL",
          "enum": [
            "https://login.salesforce.com",
            "https://test.salesforce.com"
          ],
          "default": "https://login.salesforce.com"
        },
        "objects": {
          "type": "array",
          "title": "Objects",
          "items": {
            "type": "string"
          },
          "description": "Salesforce objects to replicate (empty = standard objects)",
          "default": [
            "Account",
            "Contact",
            "Opportunity",
            "Lead"
          ]
        },
        "soql_query": {
          "type": "string",
          "title": "SOQL Query",
          "description": "Custom SOQL query (overrides objects)"
        }
      },
      "required": [
        "username",
        "password",
        "security_token"
      ]
    }
  },
  {
    "name": "salesforce_destination",
    "title": "Salesforce (Destination)",
    "description": "Load data into Salesforce CRM (limited capabilities)",
    "tags": [
      "crm",
      "destination",
      "salesforce",
      "saas",
      "enterprise"
    ],
    "capabilities": [
      "destination"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "title": "Username",
          "description": "Salesforce username"
        },
        "password": {
          "type": "string",
          "title": "Password",
          "format": "password"
        },
        "security_token": {
          "type": "string",
          "title": "Security Token",
          "format": "password"
        },
        "login_url": {
          "type": "string",
          "title": "Login URL",
          "enum": [
            "https://login.salesforce.com",
            "https://test.salesforce.com"
          ],
          "default": "https://login.salesforce.com"
        }
      },
      "required": [
        "username",
        "password",
        "security_token"
      ]
    }
  },
  {
    "name": "shopify",
    "title": "Shopify",
    "description": "Extract data from Shopify stores (Orders, Products, Customers, Collections)",
    "tags": [
      "ecommerce",
      "source",
      "shopify",
      "saas",
      "retail"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "shop_name": {
          "type": "string",
          "title": "Shop Name",
          "description": "Your Shopify store name (without .myshopify.com)"
        },
        "api_key": {
          "type": "string",
          "title": "API Key",
          "description": "Shopify Admin API access token",
          "format": "password"
        },
        "api_version": {
          "type": "string",
          "title": "API Version",
          "default": "2024-01"
        },
        "objects": {
          "type": "array",
          "title": "Objects",
          "items": {
            "type": "string"
          },
          "description": "Shopify objects to replicate",
          "default": [
            "orders",
            "products",
            "customers",
            "collections"
          ]
        }
      },
      "required": [
        "shop_name",
        "api_key"
      ]
    }
  },
  {
    "name": "slack",
    "title": "Slack",
    "description": "Extract data from Slack workspaces (Channels, Messages, Users, Files)",
    "tags": [
      "communication",
      "source",
      "slack",
      "saas",
      "team"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "token": {
          "type": "string",
          "title": "Bot Token",
          "description": "Slack Bot User OAuth token",
          "format": "password"
        },
        "objects": {
          "type": "array",
          "title": "Objects",
          "items": {
            "type": "string"
          },
          "description": "Slack objects to replicate",
          "default": [
            "channels",
            "messages",
            "users"
          ]
        },
        "channel_ids": {
          "type": "array",
          "title": "Channel IDs",
          "items": {
            "type": "string"
          },
          "description": "Specific channel IDs to extract (empty = all)"
        }
      },
      "required": [
        "token"
      ]
    }
  },
  {
    "name": "slack_destination",
    "title": "Slack (Destination)",
    "description": "Send pipeline notifications to Slack channels",
    "tags": [
      "communication",
      "destination",
      "slack",
      "saas",
      "notifications"
    ],
    "capabilities": [
      "destination"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "token": {
          "type": "string",
          "title": "Bot Token",
          "description": "Slack Bot User OAuth token",
          "format": "password"
        },
        "channel": {
          "type": "string",
          "title": "Channel",
          "description": "Channel ID or name to send messages to"
        }
      },
      "required": [
        "token",
        "channel"
      ]
    }
  },
  {
    "name": "snowflake",
    "title": "Snowflake",
    "description": "Load data into Snowflake data warehouses",
    "tags": [
      "data warehouse",
      "destination",
      "snowflake",
      "cloud"
    ],
    "capabilities": [
      "destination"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "account": {
          "type": "string",
          "title": "Account",
          "description": "Snowflake account identifier"
        },
        "user": {
          "type": "string",
          "title": "Username"
        },
        "password": {
          "type": "string",
          "title": "Password",
          "format": "password"
        },
        "database": {
          "type": "string",
          "title": "Database"
        },
        "schema": {
          "type": "string",
          "title": "Schema",
          "default": "PUBLIC"
        },
        "warehouse": {
          "type": "string",
          "title": "Warehouse"
        },
        "role": {
          "type": "string",
          "title": "Role"
        },
        "file_format": {
          "type": "string",
          "title": "File Format",
          "enum": [
            "CSV",
            "JSON",
            "PARQUET"
          ],
          "default": "CSV"
        }
      },
      "required": [
        "account",
        "user",
        "password",
        "database"
      ]
    }
  },
  {
    "name": "snowflake_source",
    "title": "Snowflake (Source)",
    "description": "Extract data from Snowflake data warehouses",
    "tags": [
      "data warehouse",
      "source",
      "snowflake",
      "cloud"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "account": {
          "type": "string",
          "title": "Account",
          "description": "Snowflake account identifier"
        },
        "user": {
          "type": "string",
          "title": "Username"
        },
        "password": {
          "type": "string",
          "title": "Password",
          "format": "password"
        },
        "database": {
          "type": "string",
          "title": "Database"
        },
        "schema": {
          "type": "string",
          "title": "Schema",
          "default": "PUBLIC"
        },
        "warehouse": {
          "type": "string",
          "title": "Warehouse"
        },
        "role": {
          "type": "string",
          "title": "Role"
        },
        "tables": {
          "type": "array",
          "title": "Tables",
          "items": {
            "type": "string"
          },
          "description": "List of tables to replicate (empty = all tables)"
        }
      },
      "required": [
        "account",
        "user",
        "password",
        "database"
      ]
    }
  },
  {
    "name": "sqlserver",
    "title": "Microsoft SQL Server",
    "description": "Extract data from Microsoft SQL Server databases",
    "tags": [
      "database",
      "source",
      "sqlserver",
      "microsoft"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "host": {
          "type": "string",
          "title": "Host",
          "default": "localhost"
        },
        "port": {
          "type": "integer",
          "title": "Port",
          "default": 1433
        },
        "database": {
          "type": "string",
          "title": "Database"
        },
        "username": {
          "type": "string",
          "title": "Username"
        },
        "password": {
          "type": "string",
          "title": "Password",
          "format": "password"
        },
        "driver": {
          "type": "string",
          "title": "ODBC Driver",
          "default": "ODBC Driver 17 for SQL Server"
        },
        "encrypt": {
          "type": "boolean",
          "title": "Encrypt Connection",
          "default": true
        },
        "tables": {
          "type": "array",
          "title": "Tables",
          "items": {
            "type": "string"
          },
          "description": "List of tables to replicate (empty = all tables)"
        }
      },
      "required": [
        "host",
        "database",
        "username",
        "password"
      ]
    }
  },
  {
    "name": "sqlserver_destination",
    "title": "Microsoft SQL Server (Destination)",
    "description": "Load data into Microsoft SQL Server databases",
    "tags": [
      "database",
      "destination",
      "sqlserver",
      "microsoft"
    ],
    "capabilities": [
      "destination"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "host": {
          "type": "string",
          "title": "Host",
          "default": "localhost"
        },
        "port": {
          "type": "integer",
          "title": "Port",
          "default": 1433
        },
        "database": {
          "type": "string",
          "title": "Database"
        },
        "username": {
          "type": "string",
          "title": "Username"
        },
        "password": {
          "type": "string",
          "title": "Password",
          "format": "password"
        },
        "driver": {
          "type": "string",
          "title": "ODBC Driver",
          "default": "ODBC Driver 17 for SQL Server"
        },
        "encrypt": {
          "type": "boolean",
          "title": "Encrypt Connection",
          "default": true
        }
      },
      "required": [
        "host",
        "database",
        "username",
        "password"
      ]
    }
  },
  {
    "name": "stripe",
    "title": "Stripe",
    "description": "Extract data from Stripe payment platform (Charges, Customers, Invoices, Subscriptions)",
    "tags": [
      "payments",
      "source",
      "stripe",
      "saas",
      "finance"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "api_key": {
          "type": "string",
          "title": "API Key",
          "description": "Stripe secret key",
          "format": "password"
        },
        "api_version": {
          "type": "string",
          "title": "API Version",
          "default": "2023-10-16"
        },
        "objects": {
          "type": "array",
          "title": "Objects",
          "items": {
            "type": "string"
          },
          "description": "Stripe objects to replicate",
          "default": [
            "charges",
            "customers",
            "invoices",
            "subscriptions"
          ]
        }
      },
      "required": [
        "api_key"
      ]
    }
  },
  {
    "name": "twilio",
    "title": "Twilio",
    "description": "Extract data from Twilio (Messages, Calls, Conferences, Participants)",
    "tags": [
      "communications",
      "source",
      "twilio",
      "saas",
      "voip"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "account_sid": {
          "type": "string",
          "title": "Account SID"
        },
        "auth_token": {
          "type": "string",
          "title": "Auth Token",
          "format": "password"
        },
        "objects": {
          "type": "array",
          "title": "Objects",
          "items": {
            "type": "string"
          },
          "description": "Twilio objects to replicate",
          "default": [
            "Messages",
            "Calls"
          ]
        }
      },
      "required": [
        "account_sid",
        "auth_token"
      ]
    }
  },
  {
    "name": "zendesk",
    "title": "Zendesk",
    "description": "Extract data from Zendesk (Tickets, Users, Organizations, Comments)",
    "tags": [
      "support",
      "source",
      "zendesk",
      "saas",
      "crm"
    ],
    "capabilities": [
      "source"
    ],
    "config_schema": {
      "type": "object",
      "properties": {
        "subdomain": {
          "type": "string",
          "title": "Subdomain",
          "description": "Your Zendesk subdomain (e.g., company.zendesk.com)"
        },
        "email": {
          "type": "string",
          "title": "Email",
          "description": "Agent email"
        },
        "api_token": {
          "type": "string",
          "title": "API Token",
          "format": "password"
        },
        "objects": {
          "type": "array",
          "title": "Objects",
          "items": {
            "type": "string"
          },
          "description": "Zendesk objects to replicate",
          "default": [
            "tickets",
            "users",
            "organizations"
          ]
        }
      },
      "required": [
        "subdomain",
        "email",
        "api_token"
      ]
    }
  }
] as const;
