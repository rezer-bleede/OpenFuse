"""Twilio connector for communications data."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class TwilioSourceConnector(Connector):
    """Twilio source connector."""

    name = "twilio"
    title = "Twilio"
    description = "Extract data from Twilio (Messages, Calls, Conferences, Participants)"
    tags = ["communications", "source", "twilio", "saas", "voip"]

    config_schema = {
        "type": "object",
        "properties": {
            "account_sid": {"type": "string", "title": "Account SID"},
            "auth_token": {"type": "string", "title": "Auth Token", "format": "password"},
            "objects": {
                "type": "array",
                "title": "Objects",
                "items": {"type": "string"},
                "description": "Twilio objects to replicate",
                "default": ["Messages", "Calls"],
            },
        },
        "required": ["account_sid", "auth_token"],
    }

    def validate(self) -> None:
        if not self.config.get("account_sid"):
            raise ValueError("Account SID is required")
        if not self.config.get("auth_token"):
            raise ValueError("Auth Token is required")

    async def run(self) -> dict[str, Any]:
        from twilio.rest import Client

        account_sid = self.config["account_sid"]
        auth_token = self.config["auth_token"]

        client = Client(account_sid, auth_token)

        objects = self.config.get("objects", ["Messages", "Calls"])

        rows_extracted = 0

        if "Messages" in objects:
            logger.info("Extracting messages")
            messages = client.messages.list(limit=1000)
            rows_extracted += len(messages)
            logger.info(f"Extracted {len(messages)} messages")

        if "Calls" in objects:
            logger.info("Extracting calls")
            calls = client.calls.list(limit=1000)
            rows_extracted += len(calls)
            logger.info(f"Extracted {len(calls)} calls")

        return {"status": "completed", "rows_extracted": rows_extracted}


registry.register(TwilioSourceConnector)
