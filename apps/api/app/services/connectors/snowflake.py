"""Snowflake connector for data loading."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class SnowflakeDestinationConnector(Connector):
    """Snowflake data warehouse destination connector."""

    name = "snowflake"
    title = "Snowflake"
    description = "Load data into Snowflake data warehouses"
    tags = ["data warehouse", "destination", "snowflake", "cloud"]

    config_schema = {
        "type": "object",
        "properties": {
            "account": {"type": "string", "title": "Account", "description": "Snowflake account identifier"},
            "user": {"type": "string", "title": "Username"},
            "password": {"type": "string", "title": "Password", "format": "password"},
            "database": {"type": "string", "title": "Database"},
            "schema": {"type": "string", "title": "Schema", "default": "PUBLIC"},
            "warehouse": {"type": "string", "title": "Warehouse"},
            "role": {"type": "string", "title": "Role"},
            "file_format": {
                "type": "string",
                "title": "File Format",
                "enum": ["CSV", "JSON", "PARQUET"],
                "default": "CSV",
            },
        },
        "required": ["account", "user", "password", "database"],
    }

    def validate(self) -> None:
        if not self.config.get("account"):
            raise ValueError("Account is required")
        if not self.config.get("user"):
            raise ValueError("Username is required")
        if not self.config.get("password"):
            raise ValueError("Password is required")
        if not self.config.get("database"):
            raise ValueError("Database is required")

    async def run(self) -> dict[str, Any]:
        import snowflake.connector

        conn = snowflake.connector.connect(
            user=self.config["user"],
            password=self.config["password"],
            account=self.config["account"],
            database=self.config.get("database"),
            schema=self.config.get("schema", "PUBLIC"),
            warehouse=self.config.get("warehouse"),
            role=self.config.get("role"),
        )

        try:
            cursor = conn.cursor()

            warehouse = self.config.get("warehouse")
            if warehouse:
                cursor.execute(f"USE WAREHOUSE {warehouse}")
                logger.info(f"Using warehouse: {warehouse}")

            logger.info("Snowflake destination connector ready")
            cursor.close()

            return {"status": "completed", "rows_loaded": 0}

        finally:
            conn.close()


class SnowflakeSourceConnector(Connector):
    """Snowflake data warehouse source connector."""

    name = "snowflake_source"
    title = "Snowflake (Source)"
    description = "Extract data from Snowflake data warehouses"
    tags = ["data warehouse", "source", "snowflake", "cloud"]

    config_schema = {
        "type": "object",
        "properties": {
            "account": {"type": "string", "title": "Account", "description": "Snowflake account identifier"},
            "user": {"type": "string", "title": "Username"},
            "password": {"type": "string", "title": "Password", "format": "password"},
            "database": {"type": "string", "title": "Database"},
            "schema": {"type": "string", "title": "Schema", "default": "PUBLIC"},
            "warehouse": {"type": "string", "title": "Warehouse"},
            "role": {"type": "string", "title": "Role"},
            "tables": {
                "type": "array",
                "title": "Tables",
                "items": {"type": "string"},
                "description": "List of tables to replicate (empty = all tables)",
            },
        },
        "required": ["account", "user", "password", "database"],
    }

    def validate(self) -> None:
        if not self.config.get("account"):
            raise ValueError("Account is required")
        if not self.config.get("user"):
            raise ValueError("Username is required")
        if not self.config.get("password"):
            raise ValueError("Password is required")
        if not self.config.get("database"):
            raise ValueError("Database is required")

    async def run(self) -> dict[str, Any]:
        import snowflake.connector

        conn = snowflake.connector.connect(
            user=self.config["user"],
            password=self.config["password"],
            account=self.config["account"],
            database=self.config.get("database"),
            schema=self.config.get("schema", "PUBLIC"),
            warehouse=self.config.get("warehouse"),
            role=self.config.get("role"),
        )

        try:
            cursor = conn.cursor()

            warehouse = self.config.get("warehouse")
            if warehouse:
                cursor.execute(f"USE WAREHOUSE {warehouse}")

            tables = self.config.get("tables", [])
            schema = self.config.get("schema", "PUBLIC")

            if not tables:
                cursor.execute(
                    f"SELECT table_name FROM information_schema.tables "
                    f"WHERE table_schema = '{schema}' AND table_type = 'BASE TABLE'"
                )
                result = cursor.fetchall()
                tables = [r[0] for r in result]

            rows_extracted = 0
            for table in tables:
                logger.info(f"Extracting table: {table}")
                cursor.execute(f'SELECT * FROM "{schema}"."{table}"')
                records = cursor.fetchall()
                rows_extracted += len(records)
                logger.info(f"Extracted {len(records)} rows from {table}")

            cursor.close()

            return {"status": "completed", "rows_extracted": rows_extracted}

        finally:
            conn.close()


registry.register(SnowflakeDestinationConnector)
registry.register(SnowflakeSourceConnector)
