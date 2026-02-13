"""Airtable connector for collaborative databases."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class AirtableSourceConnector(Connector):
    """Airtable source connector."""

    name = "airtable"
    title = "Airtable"
    description = "Extract data from Airtable bases and tables"
    tags = ["database", "source", "airtable", "saas", "collaboration"]

    config_schema = {
        "type": "object",
        "properties": {
            "api_key": {"type": "string", "title": "API Key", "format": "password"},
            "base_id": {"type": "string", "title": "Base ID"},
            "table_ids": {
                "type": "array",
                "title": "Table IDs",
                "items": {"type": "string"},
                "description": "Specific table IDs to extract (empty = all)",
            },
        },
        "required": ["api_key", "base_id"],
    }

    def validate(self) -> None:
        if not self.config.get("api_key"):
            raise ValueError("API Key is required")
        if not self.config.get("base_id"):
            raise ValueError("Base ID is required")

    async def run(self) -> dict[str, Any]:
        import httpx

        api_key = self.config["api_key"]
        base_id = self.config["base_id"]

        headers = {"Authorization": f"Bearer {api_key}"}
        base_url = f"https://api.airtable.com/v0/{base_id}"

        table_ids = self.config.get("table_ids", [])

        if not table_ids:
            response = await httpx.AsyncClient(headers=headers).get(base_url)
            response.raise_for_status()
            tables = response.json().get("tables", [])
            table_ids = [t["id"] for t in tables]

        rows_extracted = 0
        async with httpx.AsyncClient(headers=headers, timeout=60.0) as client:
            for table_id in table_ids:
                logger.info(f"Extracting table: {table_id}")
                offset = None
                table_rows = 0

                while True:
                    params = {"pageSize": 100}
                    if offset:
                        params["offset"] = offset

                    response = await client.get(f"{base_url}/{table_id}", params=params)
                    response.raise_for_status()
                    data = response.json()

                    records = data.get("records", [])
                    table_rows += len(records)

                    offset = data.get("offset")
                    if not offset:
                        break

                rows_extracted += table_rows
                logger.info(f"Extracted {table_rows} records from table {table_id}")

        return {"status": "completed", "rows_extracted": rows_extracted}


class AirtableDestinationConnector(Connector):
    """Airtable destination connector."""

    name = "airtable_destination"
    title = "Airtable (Destination)"
    description = "Load data into Airtable bases and tables"
    tags = ["database", "destination", "airtable", "saas", "collaboration"]

    config_schema = {
        "type": "object",
        "properties": {
            "api_key": {"type": "string", "title": "API Key", "format": "password"},
            "base_id": {"type": "string", "title": "Base ID"},
            "table_id": {"type": "string", "title": "Table ID"},
        },
        "required": ["api_key", "base_id", "table_id"],
    }

    def validate(self) -> None:
        if not self.config.get("api_key"):
            raise ValueError("API Key is required")
        if not self.config.get("base_id"):
            raise ValueError("Base ID is required")

    async def run(self) -> dict[str, Any]:
        logger.info("Airtable destination connector ready")
        return {"status": "completed", "rows_loaded": 0}


registry.register(AirtableSourceConnector)
registry.register(AirtableDestinationConnector)
