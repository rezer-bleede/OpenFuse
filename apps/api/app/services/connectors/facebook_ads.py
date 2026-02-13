"""Facebook Ads connector for advertising data."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class FacebookAdsSourceConnector(Connector):
    """Facebook Ads source connector."""

    name = "facebook_ads"
    title = "Facebook Ads"
    description = "Extract data from Facebook Ads (Campaigns, AdSets, Ads, Insights)"
    tags = ["advertising", "source", "facebook", "meta", "marketing"]

    config_schema = {
        "type": "object",
        "properties": {
            "access_token": {"type": "string", "title": "Access Token", "description": "Facebook Marketing API access token", "format": "password"},
            "ad_account_id": {"type": "string", "title": "Ad Account ID", "description": "Facebook Ad Account ID (format: act_XXXXXX)"},
            "objects": {
                "type": "array",
                "title": "Objects",
                "items": {"type": "string"},
                "description": "Facebook Ads objects to replicate",
                "default": ["campaigns", "adsets", "ads", "insights"],
            },
            "date_preset": {
                "type": "string",
                "title": "Date Preset",
                "description": "Predefined date range for insights",
                "enum": ["today", "yesterday", "last_7d", "last_30d", "this_month", "last_month"],
                "default": "last_30d",
            },
        },
        "required": ["access_token", "ad_account_id"],
    }

    def validate(self) -> None:
        if not self.config.get("access_token"):
            raise ValueError("Access Token is required")
        if not self.config.get("ad_account_id"):
            raise ValueError("Ad Account ID is required")

    async def run(self) -> dict[str, Any]:
        import httpx

        access_token = self.config["access_token"]
        ad_account_id = self.config["ad_account_id"]

        headers = {"Authorization": f"Bearer {access_token}"}
        base_url = f"https://graph.facebook.com/v18.0/{ad_account_id}"

        objects = self.config.get("objects", ["campaigns", "insights"])
        date_preset = self.config.get("date_preset", "last_30d")

        rows_extracted = 0
        async with httpx.AsyncClient(headers=headers, timeout=60.0) as client:
            if "campaigns" in objects:
                logger.info("Extracting campaigns")
                response = await client.get(f"{base_url}/campaigns", params={"limit": 100})
                if response.status_code == 200:
                    data = response.json()
                    campaigns = data.get("data", [])
                    rows_extracted += len(campaigns)
                    logger.info(f"Extracted {len(campaigns)} campaigns")

            if "adsets" in objects:
                logger.info("Extracting adsets")
                response = await client.get(f"{base_url}/adsets", params={"limit": 100})
                if response.status_code == 200:
                    data = response.json()
                    adsets = data.get("data", [])
                    rows_extracted += len(adsets)
                    logger.info(f"Extracted {len(adsets)} adsets")

            if "ads" in objects:
                logger.info("Extracting ads")
                response = await client.get(f"{base_url}/ads", params={"limit": 100})
                if response.status_code == 200:
                    data = response.json()
                    ads = data.get("data", [])
                    rows_extracted += len(ads)
                    logger.info(f"Extracted {len(ads)} ads")

            if "insights" in objects:
                logger.info("Extracting insights")
                response = await client.get(
                    f"{base_url}/insights",
                    params={"level": "campaign", "date_preset": date_preset, "limit": 100},
                )
                if response.status_code == 200:
                    data = response.json()
                    insights = data.get("data", [])
                    rows_extracted += len(insights)
                    logger.info(f"Extracted {len(insights)} insights")

        return {"status": "completed", "rows_extracted": rows_extracted}


registry.register(FacebookAdsSourceConnector)
