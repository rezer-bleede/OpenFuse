"""Microsoft SQL Server connector for data extraction and loading."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class SQLServerSourceConnector(Connector):
    """Microsoft SQL Server database source connector."""

    name = "sqlserver"
    title = "Microsoft SQL Server"
    description = "Extract data from Microsoft SQL Server databases"
    tags = ["database", "source", "sqlserver", "microsoft"]

    config_schema = {
        "type": "object",
        "properties": {
            "host": {"type": "string", "title": "Host", "default": "localhost"},
            "port": {"type": "integer", "title": "Port", "default": 1433},
            "database": {"type": "string", "title": "Database"},
            "username": {"type": "string", "title": "Username"},
            "password": {"type": "string", "title": "Password", "format": "password"},
            "driver": {"type": "string", "title": "ODBC Driver", "default": "ODBC Driver 17 for SQL Server"},
            "encrypt": {"type": "boolean", "title": "Encrypt Connection", "default": True},
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
        import aioodbc

        connection_string = self._build_connection_string()

        async with aioodbc.connect(connection_string) as conn:
            async with conn.cursor() as cursor:
                tables = self.config.get("tables", [])

                if not tables:
                    await cursor.execute(
                        "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'"
                    )
                    result = await cursor.fetchall()
                    tables = [r[0] for r in result]

                rows_extracted = 0
                for table in tables:
                    logger.info(f"Extracting table: {table}")
                    await cursor.execute(f"SELECT * FROM [{table}]")
                    records = await cursor.fetchall()
                    rows_extracted += len(records)
                    logger.info(f"Extracted {len(records)} rows from {table}")

                return {"status": "completed", "rows_extracted": rows_extracted}

    def _build_connection_string(self) -> str:
        driver = self.config.get("driver", "ODBC Driver 17 for SQL Server")
        host = self.config["host"]
        port = self.config.get("port", 1433)
        database = self.config["database"]
        username = self.config["username"]
        password = self.config["password"]
        encrypt = "yes" if self.config.get("encrypt", True) else "no"

        return (
            f"DRIVER={{{driver}}};SERVER={host},{port};DATABASE={database};"
            f"UID={username};PWD={password};Encrypt={encrypt}"
        )


class SQLServerDestinationConnector(Connector):
    """Microsoft SQL Server destination connector."""

    name = "sqlserver_destination"
    title = "Microsoft SQL Server (Destination)"
    description = "Load data into Microsoft SQL Server databases"
    tags = ["database", "destination", "sqlserver", "microsoft"]

    config_schema = {
        "type": "object",
        "properties": {
            "host": {"type": "string", "title": "Host", "default": "localhost"},
            "port": {"type": "integer", "title": "Port", "default": 1433},
            "database": {"type": "string", "title": "Database"},
            "username": {"type": "string", "title": "Username"},
            "password": {"type": "string", "title": "Password", "format": "password"},
            "driver": {"type": "string", "title": "ODBC Driver", "default": "ODBC Driver 17 for SQL Server"},
            "encrypt": {"type": "boolean", "title": "Encrypt Connection", "default": True},
        },
        "required": ["host", "database", "username", "password"],
    }

    def validate(self) -> None:
        if not self.config.get("host"):
            raise ValueError("Host is required")
        if not self.config.get("database"):
            raise ValueError("Database is required")

    async def run(self) -> dict[str, Any]:
        import aioodbc

        connection_string = self._build_connection_string()

        async with aioodbc.connect(connection_string) as conn:
            logger.info("SQL Server destination connector ready")
            return {"status": "completed", "rows_loaded": 0}

    def _build_connection_string(self) -> str:
        driver = self.config.get("driver", "ODBC Driver 17 for SQL Server")
        host = self.config["host"]
        port = self.config.get("port", 1433)
        database = self.config["database"]
        username = self.config["username"]
        password = self.config["password"]
        encrypt = "yes" if self.config.get("encrypt", True) else "no"

        return (
            f"DRIVER={{{driver}}};SERVER={host},{port};DATABASE={database};"
            f"UID={username};PWD={password};Encrypt={encrypt}"
        )


registry.register(SQLServerSourceConnector)
registry.register(SQLServerDestinationConnector)
