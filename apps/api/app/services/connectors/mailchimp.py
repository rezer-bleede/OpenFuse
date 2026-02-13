"""Mailchimp connector for email marketing data."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class MailchimpSourceConnector(Connector):
    """Mailchimp email marketing source connector."""

    name = "mailchimp"
    title = "Mailchimp"
    description = "Extract data from Mailchimp (Lists, Members, Campaigns, Automations)"
    tags = ["marketing", "source", "mailchimp", "saas", "email"]

    config_schema = {
        "type": "object",
        "properties": {
            "api_key": {"type": "string", "title": "API Key", "description": "Mailchimp API key", "format": "password"},
            "dc": {"type": "string", "title": "Data Center", "description": "Mailchimp data center (e.g., us1, us2)"},
            "objects": {
                "type": "array",
                "title": "Objects",
                "items": {"type": "string"},
                "description": "Mailchimp objects to replicate",
                "default": ["lists", "members", "campaigns"],
            },
        },
        "required": ["api_key", "dc"],
    }

    def validate(self) -> None:
        if not self.config.get("api_key"):
            raise ValueError("API Key is required")
        if not self.config.get("dc"):
            raise ValueError("Data Center is required")

    async def run(self) -> dict[str, Any]:
        import httpx

        api_key = self.config["api_key"]
        dc = self.config["dc"]

        headers = {"Authorization": f"apikey {api_key}"}
        base_url = f"https://{dc}.api.mailchimp.com/3.0"

        objects = self.config.get("objects", ["lists", "campaigns"])

        rows_extracted = 0
        async with httpx.AsyncClient(headers=headers, timeout=60.0) as client:
            if "lists" in objects:
                logger.info("Extracting lists")
                response = await client.get(f"{base_url}/lists")
                response.raise_for_status()
                data = response.json()
                lists = data.get("lists", [])
                rows_extracted += len(lists)
                logger.info(f"Extracted {len(lists)} lists")

                for lst in lists:
                    list_id = lst["id"]
                    members_response = await client.get(f"{base_url}/lists/{list_id}/members")
                    if members_response.status_code == 200:
                        members_data = members_response.json()
                        members_count = members_data.get("total_items", 0)
                        rows_extracted += members_count
                        logger.info(f"Extracted {members_count} members from list {lst['name']}")

            if "campaigns" in objects:
                logger.info("Extracting campaigns")
                response = await client.get(f"{base_url}/campaigns")
                response.raise_for_status()
                data = response.json()
                campaigns = data.get("campaigns", [])
                rows_extracted += len(campaigns)
                logger.info(f"Extracted {len(campaigns)} campaigns")

        return {"status": "completed", "rows_extracted": rows_extracted}


registry.register(MailchimpSourceConnector)
