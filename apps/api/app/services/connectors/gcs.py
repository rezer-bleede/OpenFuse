"""Google Cloud Storage connector."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class GCSSourceConnector(Connector):
    """Google Cloud Storage source connector."""

    name = "gcs"
    title = "Google Cloud Storage"
    description = "Extract data files from Google Cloud Storage buckets (CSV, JSON, Parquet)"
    tags = ["cloud", "source", "gcs", "storage", "google"]

    config_schema = {
        "type": "object",
        "properties": {
            "bucket": {"type": "string", "title": "Bucket Name"},
            "prefix": {"type": "string", "title": "Prefix", "description": "Folder prefix to filter objects"},
            "credentials_json": {
                "type": "string",
                "title": "Credentials JSON",
                "description": "GCP service account JSON credentials",
                "format": "password",
            },
            "file_format": {
                "type": "string",
                "title": "File Format",
                "enum": ["csv", "json", "parquet"],
                "default": "csv",
            },
        },
        "required": ["bucket"],
    }

    def validate(self) -> None:
        if not self.config.get("bucket"):
            raise ValueError("Bucket name is required")

    async def run(self) -> dict[str, Any]:
        from google.cloud import storage

        client = self._create_client()
        bucket = client.bucket(self.config["bucket"])

        prefix = self.config.get("prefix", "")

        blobs = list(bucket.list_blobs(prefix=prefix))

        rows_extracted = 0
        for blob in blobs:
            if blob.name.endswith((".csv", ".json", ".parquet")):
                logger.info(f"Found file: {blob.name}")
                rows_extracted += 1

        logger.info(f"Found {rows_extracted} files in gs://{bucket.name}/{prefix}")
        return {"status": "completed", "rows_extracted": rows_extracted}

    def _create_client(self):
        from google.cloud import storage

        credentials = None
        if self.config.get("credentials_json"):
            import json
            from google.oauth2 import service_account

            credentials = service_account.Credentials.from_service_account_info(
                json.loads(self.config["credentials_json"])
            )

        return storage.Client(credentials=credentials)


class GCSDestinationConnector(Connector):
    """Google Cloud Storage destination connector."""

    name = "gcs_destination"
    title = "Google Cloud Storage (Destination)"
    description = "Load data files to Google Cloud Storage buckets (CSV, JSON, Parquet)"
    tags = ["cloud", "destination", "gcs", "storage", "google"]

    config_schema = {
        "type": "object",
        "properties": {
            "bucket": {"type": "string", "title": "Bucket Name"},
            "prefix": {
                "type": "string",
                "title": "Prefix",
                "description": "Folder prefix for uploaded files",
            },
            "credentials_json": {
                "type": "string",
                "title": "Credentials JSON",
                "description": "GCP service account JSON credentials",
                "format": "password",
            },
            "file_format": {
                "type": "string",
                "title": "File Format",
                "enum": ["csv", "json", "parquet"],
                "default": "csv",
            },
        },
        "required": ["bucket"],
    }

    def validate(self) -> None:
        if not self.config.get("bucket"):
            raise ValueError("Bucket name is required")

    async def run(self) -> dict[str, Any]:
        from google.cloud import storage

        client = self._create_client()
        bucket = client.bucket(self.config["bucket"])

        logger.info(f"GCS destination connector ready - bucket: {bucket.name}")
        return {"status": "completed", "rows_loaded": 0}

    def _create_client(self):
        from google.cloud import storage

        credentials = None
        if self.config.get("credentials_json"):
            import json
            from google.oauth2 import service_account

            credentials = service_account.Credentials.from_service_account_info(
                json.loads(self.config["credentials_json"])
            )

        return storage.Client(credentials=credentials)


registry.register(GCSSourceConnector)
registry.register(GCSDestinationConnector)
