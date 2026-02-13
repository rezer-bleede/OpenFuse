"""QuickBooks connector for accounting data."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class QuickBooksSourceConnector(Connector):
    """QuickBooks Online source connector."""

    name = "quickbooks"
    title = "QuickBooks"
    description = "Extract data from QuickBooks Online (Invoices, Customers, Payments, Products)"
    tags = ["accounting", "source", "quickbooks", "saas", "finance"]

    config_schema = {
        "type": "object",
        "properties": {
            "realm_id": {"type": "string", "title": "Realm ID", "description": "QuickBooks Company ID"},
            "access_token": {"type": "string", "title": "Access Token", "format": "password"},
            "refresh_token": {"type": "string", "title": "Refresh Token", "format": "password"},
            "client_id": {"type": "string", "title": "Client ID"},
            "client_secret": {"type": "string", "title": "Client Secret", "format": "password"},
            "objects": {
                "type": "array",
                "title": "Objects",
                "items": {"type": "string"},
                "description": "QuickBooks objects to replicate",
                "default": ["Invoice", "Customer", "Payment", "Item"],
            },
        },
        "required": ["realm_id", "access_token", "client_id"],
    }

    def validate(self) -> None:
        if not self.config.get("realm_id"):
            raise ValueError("Realm ID is required")
        if not self.config.get("access_token"):
            raise ValueError("Access Token is required")
        if not self.config.get("client_id"):
            raise ValueError("Client ID is required")

    async def run(self) -> dict[str, Any]:
        import httpx

        realm_id = self.config["realm_id"]
        access_token = self.config["access_token"]

        headers = {"Authorization": f"Bearer {access_token}", "Accept": "application/json"}
        base_url = f"https://quickbooks.api.intuit.com/v3/company/{realm_id}"

        objects = self.config.get("objects", ["Invoice", "Customer", "Payment"])

        rows_extracted = 0
        async with httpx.AsyncClient(headers=headers, timeout=60.0) as client:
            for obj in objects:
                logger.info(f"Extracting {obj}")
                response = await client.get(f"{base_url}/query", params={"query": f"SELECT * FROM {obj}"})

                if response.status_code == 200:
                    data = response.json()
                    query_response = data.get("QueryResponse", {})
                    items = query_response.get(obj, [])
                    rows_extracted += len(items)
                    logger.info(f"Extracted {len(items)} {obj}")

        return {"status": "completed", "rows_extracted": rows_extracted}


registry.register(QuickBooksSourceConnector)
