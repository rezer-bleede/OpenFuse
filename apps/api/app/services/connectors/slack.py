"""Slack connector for workspace data extraction."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class SlackSourceConnector(Connector):
    """Slack workspace source connector."""

    name = "slack"
    title = "Slack"
    description = "Extract data from Slack workspaces (Channels, Messages, Users, Files)"
    tags = ["communication", "source", "slack", "saas", "team"]

    config_schema = {
        "type": "object",
        "properties": {
            "token": {"type": "string", "title": "Bot Token", "description": "Slack Bot User OAuth token", "format": "password"},
            "objects": {
                "type": "array",
                "title": "Objects",
                "items": {"type": "string"},
                "description": "Slack objects to replicate",
                "default": ["channels", "messages", "users"],
            },
            "channel_ids": {
                "type": "array",
                "title": "Channel IDs",
                "items": {"type": "string"},
                "description": "Specific channel IDs to extract (empty = all)",
            },
        },
        "required": ["token"],
    }

    def validate(self) -> None:
        if not self.config.get("token"):
            raise ValueError("Bot Token is required")

    async def run(self) -> dict[str, Any]:
        from slack_sdk import WebClient

        client = WebClient(token=self.config["token"])

        objects = self.config.get("objects", ["channels", "users"])
        rows_extracted = 0

        if "channels" in objects:
            logger.info("Extracting channels")
            response = client.conversations_list(types="public_channel,private_channel")
            channels = response["channels"]
            rows_extracted += len(channels)
            logger.info(f"Extracted {len(channels)} channels")

            if self.config.get("channel_ids"):
                channel_ids = self.config["channel_ids"]
            else:
                channel_ids = [c["id"] for c in channels[:10]]

            if "messages" in objects:
                for channel_id in channel_ids:
                    logger.info(f"Extracting messages from channel {channel_id}")
                    response = client.conversations_history(channel=channel_id, limit=1000)
                    messages = response["messages"]
                    rows_extracted += len(messages)
                    logger.info(f"Extracted {len(messages)} messages")

        if "users" in objects:
            logger.info("Extracting users")
            response = client.users_list()
            users = response["members"]
            rows_extracted += len(users)
            logger.info(f"Extracted {len(users)} users")

        return {"status": "completed", "rows_extracted": rows_extracted}


class SlackDestinationConnector(Connector):
    """Slack destination connector for sending notifications."""

    name = "slack_destination"
    title = "Slack (Destination)"
    description = "Send pipeline notifications to Slack channels"
    tags = ["communication", "destination", "slack", "saas", "notifications"]

    config_schema = {
        "type": "object",
        "properties": {
            "token": {"type": "string", "title": "Bot Token", "description": "Slack Bot User OAuth token", "format": "password"},
            "channel": {"type": "string", "title": "Channel", "description": "Channel ID or name to send messages to"},
        },
        "required": ["token", "channel"],
    }

    def validate(self) -> None:
        if not self.config.get("token"):
            raise ValueError("Bot Token is required")
        if not self.config.get("channel"):
            raise ValueError("Channel is required")

    async def run(self) -> dict[str, Any]:
        from slack_sdk import WebClient

        client = WebClient(token=self.config["token"])

        channel = self.config["channel"]
        client.chat_postMessage(
            channel=channel,
            text="OpenFuse pipeline completed successfully",
        )

        logger.info(f"Sent notification to Slack channel: {channel}")
        return {"status": "completed", "rows_loaded": 0}


registry.register(SlackSourceConnector)
registry.register(SlackDestinationConnector)
