"""Intercom connector for customer messaging data."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class IntercomSourceConnector(Connector):
    """Intercom source connector."""

    name = "intercom"
    title = "Intercom"
    description = "Extract data from Intercom (Contacts, Conversations, Users, Teams)"
    tags = ["messaging", "source", "intercom", "saas", "customer support"]

    config_schema = {
        "type": "object",
        "properties": {
            "access_token": {"type": "string", "title": "Access Token", "format": "password"},
            "objects": {
                "type": "array",
                "title": "Objects",
                "items": {"type": "string"},
                "description": "Intercom objects to replicate",
                "default": ["contacts", "conversations", "teams"],
            },
        },
        "required": ["access_token"],
    }

    def validate(self) -> None:
        if not self.config.get("access_token"):
            raise ValueError("Access Token is required")

    async def run(self) -> dict[str, Any]:
        import httpx

        access_token = self.config["access_token"]

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json",
        }
        base_url = "https://api.intercom.io"

        objects = self.config.get("objects", ["contacts", "conversations"])

        rows_extracted = 0
        async with httpx.AsyncClient(headers=headers, timeout=60.0) as client:
            if "contacts" in objects:
                logger.info("Extracting contacts")
                response = await client.get(f"{base_url}/contacts")
                if response.status_code == 200:
                    data = response.json()
                    contacts = data.get("contacts", [])
                    rows_extracted += len(contacts)
                    logger.info(f"Extracted {len(contacts)} contacts")

            if "conversations" in objects:
                logger.info("Extracting conversations")
                response = await client.get(f"{base_url}/conversations")
                if response.status_code == 200:
                    data = response.json()
                    conversations = data.get("conversations", [])
                    rows_extracted += len(conversations)
                    logger.info(f"Extracted {len(conversations)} conversations")

            if "teams" in objects:
                logger.info("Extracting teams")
                response = await client.get(f"{base_url}/teams")
                if response.status_code == 200:
                    data = response.json()
                    teams = data.get("teams", [])
                    rows_extracted += len(teams)
                    logger.info(f"Extracted {len(teams)} teams")

        return {"status": "completed", "rows_extracted": rows_extracted}


registry.register(IntercomSourceConnector)
