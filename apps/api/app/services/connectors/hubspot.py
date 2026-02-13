"""HubSpot connector for CRM data extraction."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class HubSpotSourceConnector(Connector):
    """HubSpot CRM source connector."""

    name = "hubspot"
    title = "HubSpot"
    description = "Extract data from HubSpot CRM (Contacts, Companies, Deals, Tickets)"
    tags = ["crm", "source", "hubspot", "saas", "marketing"]

    config_schema = {
        "type": "object",
        "properties": {
            "api_key": {"type": "string", "title": "API Key", "description": "HubSpot private app access token", "format": "password"},
            "objects": {
                "type": "array",
                "title": "Objects",
                "items": {"type": "string"},
                "description": "HubSpot objects to replicate",
                "default": ["contacts", "companies", "deals", "tickets"],
            },
        },
        "required": ["api_key"],
    }

    def validate(self) -> None:
        if not self.config.get("api_key"):
            raise ValueError("API Key is required")

    async def run(self) -> dict[str, Any]:
        import httpx

        headers = {"Authorization": f"Bearer {self.config['api_key']}"}
        base_url = "https://api.hubapi.com"

        objects = self.config.get("objects", ["contacts", "companies", "deals", "tickets"])

        rows_extracted = 0
        async with httpx.AsyncClient(headers=headers, timeout=60.0) as client:
            for obj in objects:
                logger.info(f"Extracting {obj}")
                endpoint = f"{base_url}/crm/v3/objects/{obj}?limit=100"

                while endpoint:
                    response = await client.get(endpoint)
                    response.raise_for_status()
                    data = response.json()

                    rows_extracted += len(data.get("results", []))
                    logger.info(f"Extracted {len(data.get('results', []))} {obj}")

                    endpoint = data.get("paging", {}).get("next", {}).get("link")

        return {"status": "completed", "rows_extracted": rows_extracted}


registry.register(HubSpotSourceConnector)
