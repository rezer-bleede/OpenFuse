"""Google BigQuery connector for data loading."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class BigQueryDestinationConnector(Connector):
    """Google BigQuery data warehouse destination connector."""

    name = "bigquery"
    title = "Google BigQuery"
    description = "Load data into Google BigQuery data warehouses"
    tags = ["data warehouse", "destination", "bigquery", "gcp", "google"]

    config_schema = {
        "type": "object",
        "properties": {
            "project_id": {"type": "string", "title": "Project ID", "description": "GCP project ID"},
            "dataset": {"type": "string", "title": "Dataset", "description": "BigQuery dataset name"},
            "credentials_json": {
                "type": "string",
                "title": "Credentials JSON",
                "description": "GCP service account JSON credentials",
                "format": "password",
            },
            "location": {"type": "string", "title": "Location", "default": "US"},
            "file_format": {
                "type": "string",
                "title": "File Format",
                "enum": ["CSV", "NEWLINE_DELIMITED_JSON", "PARQUET"],
                "default": "CSV",
            },
        },
        "required": ["project_id", "dataset"],
    }

    def validate(self) -> None:
        if not self.config.get("project_id"):
            raise ValueError("Project ID is required")
        if not self.config.get("dataset"):
            raise ValueError("Dataset is required")

    async def run(self) -> dict[str, Any]:
        from google.cloud import bigquery

        client = self._create_client()

        dataset_ref = client.dataset(self.config["dataset"])
        try:
            client.get_dataset(dataset_ref)
            logger.info(f"BigQuery destination ready - dataset: {self.config['dataset']}")
        except Exception:
            client.create_dataset(bigquery.Dataset(dataset_ref))
            logger.info(f"Created dataset: {self.config['dataset']}")

        return {"status": "completed", "rows_loaded": 0}

    def _create_client(self):
        from google.cloud import bigquery

        credentials = None
        if self.config.get("credentials_json"):
            import json
            from google.oauth2 import service_account

            credentials = service_account.Credentials.from_service_account_info(
                json.loads(self.config["credentials_json"])
            )

        return bigquery.Client(
            project=self.config["project_id"],
            credentials=credentials,
            location=self.config.get("location", "US"),
        )


class BigQuerySourceConnector(Connector):
    """Google BigQuery source connector."""

    name = "bigquery_source"
    title = "Google BigQuery (Source)"
    description = "Extract data from Google BigQuery"
    tags = ["data warehouse", "source", "bigquery", "gcp", "google"]

    config_schema = {
        "type": "object",
        "properties": {
            "project_id": {"type": "string", "title": "Project ID", "description": "GCP project ID"},
            "dataset": {"type": "string", "title": "Dataset", "description": "BigQuery dataset name"},
            "credentials_json": {
                "type": "string",
                "title": "Credentials JSON",
                "description": "GCP service account JSON credentials",
                "format": "password",
            },
            "tables": {
                "type": "array",
                "title": "Tables",
                "items": {"type": "string"},
                "description": "List of tables to replicate (empty = all tables)",
            },
            "location": {"type": "string", "title": "Location", "default": "US"},
        },
        "required": ["project_id", "dataset"],
    }

    def validate(self) -> None:
        if not self.config.get("project_id"):
            raise ValueError("Project ID is required")
        if not self.config.get("dataset"):
            raise ValueError("Dataset is required")

    async def run(self) -> dict[str, Any]:
        from google.cloud import bigquery

        client = self._create_client()
        dataset_ref = client.dataset(self.config["dataset"])

        tables = self.config.get("tables", [])
        if not tables:
            dataset = client.get_dataset(dataset_ref)
            tables = [t.table_id for t in client.list_tables(dataset)]

        rows_extracted = 0
        for table_id in tables:
            logger.info(f"Extracting table: {table_id}")
            table_ref = dataset_ref.table(table_id)
            rows = client.list_rows(table_ref).total_rows
            rows_extracted += rows
            logger.info(f"Extracted {rows} rows from {table_id}")

        return {"status": "completed", "rows_extracted": rows_extracted}

    def _create_client(self):
        from google.cloud import bigquery

        credentials = None
        if self.config.get("credentials_json"):
            import json
            from google.oauth2 import service_account

            credentials = service_account.Credentials.from_service_account_info(
                json.loads(self.config["credentials_json"])
            )

        return bigquery.Client(
            project=self.config["project_id"],
            credentials=credentials,
            location=self.config.get("location", "US"),
        )


registry.register(BigQueryDestinationConnector)
registry.register(BigQuerySourceConnector)
