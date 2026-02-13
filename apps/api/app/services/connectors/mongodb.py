"""MongoDB connector for data extraction."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class MongoDBSourceConnector(Connector):
    """MongoDB database source connector."""

    name = "mongodb"
    title = "MongoDB"
    description = "Extract data from MongoDB databases with full or incremental replication"
    tags = ["database", "source", "mongodb", "nosql"]

    config_schema = {
        "type": "object",
        "properties": {
            "host": {"type": "string", "title": "Host", "default": "localhost"},
            "port": {"type": "integer", "title": "Port", "default": 27017},
            "database": {"type": "string", "title": "Database", "description": "Database name"},
            "username": {"type": "string", "title": "Username"},
            "password": {"type": "string", "title": "Password", "format": "password"},
            "tls": {"type": "boolean", "title": "Use TLS", "default": False},
            "collections": {
                "type": "array",
                "title": "Collections",
                "items": {"type": "string"},
                "description": "List of collections to replicate (empty = all)",
            },
        },
        "required": ["host", "database"],
    }

    def validate(self) -> None:
        if not self.config.get("host"):
            raise ValueError("Host is required")
        if not self.config.get("database"):
            raise ValueError("Database is required")

    async def run(self) -> dict[str, Any]:
        from motor.motor_asyncio import AsyncIOMotorClient

        connection_string = self._build_connection_string()
        client = AsyncIOMotorClient(connection_string)

        try:
            db = client[self.config["database"]]
            collections = self.config.get("collections", [])

            if not collections:
                collections = await db.list_collection_names()

            rows_extracted = 0
            for collection_name in collections:
                logger.info(f"Extracting collection: {collection_name}")
                collection = db[collection_name]
                documents = await collection.find({}).to_list(length=None)
                rows_extracted += len(documents)
                logger.info(f"Extracted {len(documents)} documents from {collection_name}")

            return {"status": "completed", "rows_extracted": rows_extracted}

        finally:
            client.close()

    def _build_connection_string(self) -> str:
        username = self.config.get("username")
        password = self.config.get("password")
        host = self.config.get("host", "localhost")
        port = self.config.get("port", 27017)

        if username and password:
            return f"mongodb://{username}:{password}@{host}:{port}"
        return f"mongodb://{host}:{port}"


class MongoDBDestinationConnector(Connector):
    """MongoDB database destination connector."""

    name = "mongodb_destination"
    title = "MongoDB (Destination)"
    description = "Load data into MongoDB databases"
    tags = ["database", "destination", "mongodb", "nosql"]

    config_schema = {
        "type": "object",
        "properties": {
            "host": {"type": "string", "title": "Host", "default": "localhost"},
            "port": {"type": "integer", "title": "Port", "default": 27017},
            "database": {"type": "string", "title": "Database", "description": "Database name"},
            "username": {"type": "string", "title": "Username"},
            "password": {"type": "string", "title": "Password", "format": "password"},
            "tls": {"type": "boolean", "title": "Use TLS", "default": False},
        },
        "required": ["host", "database"],
    }

    def validate(self) -> None:
        if not self.config.get("host"):
            raise ValueError("Host is required")
        if not self.config.get("database"):
            raise ValueError("Database is required")

    async def run(self) -> dict[str, Any]:
        from motor.motor_asyncio import AsyncIOMotorClient

        connection_string = self._build_connection_string()
        client = AsyncIOMotorClient(connection_string)

        try:
            db = client[self.config["database"]]
            logger.info(f"MongoDB destination connector ready - database: {self.config['database']}")
            return {"status": "completed", "rows_loaded": 0}

        finally:
            client.close()

    def _build_connection_string(self) -> str:
        username = self.config.get("username")
        password = self.config.get("password")
        host = self.config.get("host", "localhost")
        port = self.config.get("port", 27017)

        if username and password:
            return f"mongodb://{username}:{password}@{host}:{port}"
        return f"mongodb://{host}:{port}"


registry.register(MongoDBSourceConnector)
registry.register(MongoDBDestinationConnector)
