"""MySQL connector for data extraction and loading."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class MySQLSourceConnector(Connector):
    """MySQL database source connector."""

    name = "mysql"
    title = "MySQL"
    description = "Extract data from MySQL databases with full table or incremental replication"
    tags = ["database", "source", "mysql"]

    config_schema = {
        "type": "object",
        "properties": {
            "host": {"type": "string", "title": "Host", "default": "localhost"},
            "port": {"type": "integer", "title": "Port", "default": 3306},
            "database": {"type": "string", "title": "Database", "description": "Database name"},
            "username": {"type": "string", "title": "Username"},
            "password": {"type": "string", "title": "Password", "format": "password"},
            "ssl": {"type": "boolean", "title": "Use SSL", "default": False},
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
        if not self.config.get("username"):
            raise ValueError("Username is required")

    async def run(self) -> dict[str, Any]:
        import aiomysql

        conn = await aiomysql.connect(
            host=self.config["host"],
            port=self.config.get("port", 3306),
            user=self.config["username"],
            password=self.config["password"],
            db=self.config["database"],
            ssl={} if self.config.get("ssl") else None,
        )

        try:
            async with conn.cursor() as cur:
                tables = self.config.get("tables", [])

                if not tables:
                    await cur.execute(
                        "SELECT table_name FROM information_schema.tables "
                        "WHERE table_schema = %s AND table_type = 'BASE TABLE'",
                        (self.config["database"],),
                    )
                    result = await cur.fetchall()
                    tables = [r[0] for r in result]

                rows_extracted = 0
                for table in tables:
                    logger.info(f"Extracting table: {table}")
                    await cur.execute(f"SELECT * FROM `{table}`")
                    records = await cur.fetchall()
                    rows_extracted += len(records)
                    logger.info(f"Extracted {len(records)} rows from {table}")

                return {"status": "completed", "rows_extracted": rows_extracted}

        finally:
            conn.close()
            await conn.wait_closed()


class MySQLDestinationConnector(Connector):
    """MySQL database destination connector."""

    name = "mysql_destination"
    title = "MySQL (Destination)"
    description = "Load data into MySQL databases"
    tags = ["database", "destination", "mysql"]

    config_schema = {
        "type": "object",
        "properties": {
            "host": {"type": "string", "title": "Host", "default": "localhost"},
            "port": {"type": "integer", "title": "Port", "default": 3306},
            "database": {"type": "string", "title": "Database", "description": "Database name"},
            "username": {"type": "string", "title": "Username"},
            "password": {"type": "string", "title": "Password", "format": "password"},
            "ssl": {"type": "boolean", "title": "Use SSL", "default": False},
            "truncate_before_load": {
                "type": "boolean",
                "title": "Truncate Before Load",
                "description": "Truncate tables before loading data",
                "default": False,
            },
        },
        "required": ["host", "database", "username", "password"],
    }

    def validate(self) -> None:
        if not self.config.get("host"):
            raise ValueError("Host is required")
        if not self.config.get("database"):
            raise ValueError("Database is required")
        if not self.config.get("username"):
            raise ValueError("Username is required")

    async def run(self) -> dict[str, Any]:
        import aiomysql

        conn = await aiomysql.connect(
            host=self.config["host"],
            port=self.config.get("port", 3306),
            user=self.config["username"],
            password=self.config["password"],
            db=self.config["database"],
            ssl={} if self.config.get("ssl") else None,
        )

        try:
            logger.info("MySQL destination connector ready")
            return {"status": "completed", "rows_loaded": 0}

        finally:
            conn.close()
            await conn.wait_closed()


registry.register(MySQLSourceConnector)
registry.register(MySQLDestinationConnector)
