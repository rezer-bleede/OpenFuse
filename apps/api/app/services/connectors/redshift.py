"""Amazon Redshift connector for data warehouse."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class RedshiftDestinationConnector(Connector):
    """Amazon Redshift data warehouse destination connector."""

    name = "redshift"
    title = "Amazon Redshift"
    description = "Load data into Amazon Redshift data warehouses"
    tags = ["data warehouse", "destination", "redshift", "aws", "amazon"]

    config_schema = {
        "type": "object",
        "properties": {
            "host": {"type": "string", "title": "Host", "description": "Redshift cluster endpoint"},
            "port": {"type": "integer", "title": "Port", "default": 5439},
            "database": {"type": "string", "title": "Database"},
            "username": {"type": "string", "title": "Username"},
            "password": {"type": "string", "title": "Password", "format": "password"},
            "iam_role": {"type": "string", "title": "IAM Role", "description": "IAM role for S3 access"},
        },
        "required": ["host", "database", "username", "password"],
    }

    def validate(self) -> None:
        if not self.config.get("host"):
            raise ValueError("Host is required")
        if not self.config.get("database"):
            raise ValueError("Database is required")

    async def run(self) -> dict[str, Any]:
        import redshift_connector

        conn = redshift_connector.connect(
            host=self.config["host"],
            port=self.config.get("port", 5439),
            database=self.config["database"],
            user=self.config["username"],
            password=self.config["password"],
        )

        try:
            cursor = conn.cursor()
            logger.info("Redshift destination connector ready")
            cursor.close()
            return {"status": "completed", "rows_loaded": 0}

        finally:
            conn.close()


class RedshiftSourceConnector(Connector):
    """Amazon Redshift source connector."""

    name = "redshift_source"
    title = "Amazon Redshift (Source)"
    description = "Extract data from Amazon Redshift data warehouses"
    tags = ["data warehouse", "source", "redshift", "aws", "amazon"]

    config_schema = {
        "type": "object",
        "properties": {
            "host": {"type": "string", "title": "Host", "description": "Redshift cluster endpoint"},
            "port": {"type": "integer", "title": "Port", "default": 5439},
            "database": {"type": "string", "title": "Database"},
            "username": {"type": "string", "title": "Username"},
            "password": {"type": "string", "title": "Password", "format": "password"},
            "tables": {
                "type": "array",
                "title": "Tables",
                "items": {"type": "string"},
                "description": "List of tables to replicate (empty = all tables)",
            },
        },
        "required": ["host", "database", "username", "password"],
    }

    def validate(self) -> None:
        if not self.config.get("host"):
            raise ValueError("Host is required")
        if not self.config.get("database"):
            raise ValueError("Database is required")

    async def run(self) -> dict[str, Any]:
        import redshift_connector

        conn = redshift_connector.connect(
            host=self.config["host"],
            port=self.config.get("port", 5439),
            database=self.config["database"],
            user=self.config["username"],
            password=self.config["password"],
        )

        try:
            cursor = conn.cursor()

            tables = self.config.get("tables", [])
            if not tables:
                cursor.execute(
                    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'"
                )
                result = cursor.fetchall()
                tables = [r[0] for r in result]

            rows_extracted = 0
            for table in tables:
                logger.info(f"Extracting table: {table}")
                cursor.execute(f"SELECT * FROM public.{table} LIMIT 10000")
                records = cursor.fetchall()
                rows_extracted += len(records)
                logger.info(f"Extracted {len(records)} rows from {table}")

            cursor.close()
            return {"status": "completed", "rows_extracted": rows_extracted}

        finally:
            conn.close()


registry.register(RedshiftDestinationConnector)
registry.register(RedshiftSourceConnector)
