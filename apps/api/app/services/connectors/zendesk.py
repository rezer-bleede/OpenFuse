"""Zendesk connector for customer support data."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class ZendeskSourceConnector(Connector):
    """Zendesk support source connector."""

    name = "zendesk"
    title = "Zendesk"
    description = "Extract data from Zendesk (Tickets, Users, Organizations, Comments)"
    tags = ["support", "source", "zendesk", "saas", "crm"]

    config_schema = {
        "type": "object",
        "properties": {
            "subdomain": {"type": "string", "title": "Subdomain", "description": "Your Zendesk subdomain (e.g., company.zendesk.com)"},
            "email": {"type": "string", "title": "Email", "description": "Agent email"},
            "api_token": {"type": "string", "title": "API Token", "format": "password"},
            "objects": {
                "type": "array",
                "title": "Objects",
                "items": {"type": "string"},
                "description": "Zendesk objects to replicate",
                "default": ["tickets", "users", "organizations"],
            },
        },
        "required": ["subdomain", "email", "api_token"],
    }

    def validate(self) -> None:
        if not self.config.get("subdomain"):
            raise ValueError("Subdomain is required")
        if not self.config.get("email"):
            raise ValueError("Email is required")
        if not self.config.get("api_token"):
            raise ValueError("API Token is required")

    async def run(self) -> dict[str, Any]:
        import httpx
        from base64 import b64encode

        subdomain = self.config["subdomain"]
        email = self.config["email"]
        api_token = self.config["api_token"]

        auth = b64encode(f"{email}/token:{api_token}".encode()).decode()
        headers = {"Authorization": f"Basic {auth}"}
        base_url = f"https://{subdomain}.zendesk.com/api/v2"

        objects = self.config.get("objects", ["tickets", "users", "organizations"])

        rows_extracted = 0
        async with httpx.AsyncClient(headers=headers, timeout=60.0) as client:
            for obj in objects:
                logger.info(f"Extracting {obj}")

                endpoint_map = {
                    "tickets": f"{base_url}/tickets.json?per_page=100",
                    "users": f"{base_url}/users.json?per_page=100",
                    "organizations": f"{base_url}/organizations.json?per_page=100",
                    "comments": f"{base_url}/ticket_comments.json?per_page=100",
                }

                endpoint = endpoint_map.get(obj)
                if not endpoint:
                    continue

                while endpoint:
                    response = await client.get(endpoint)
                    response.raise_for_status()
                    data = response.json()

                    obj_key = obj
                    if obj_key in data:
                        rows_extracted += len(data[obj_key])
                        logger.info(f"Extracted {len(data[obj_key])} {obj}")

                    endpoint = data.get("next_page")

        return {"status": "completed", "rows_extracted": rows_extracted}


registry.register(ZendeskSourceConnector)
