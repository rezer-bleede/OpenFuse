"""Shopify connector for e-commerce data extraction."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class ShopifySourceConnector(Connector):
    """Shopify e-commerce platform source connector."""

    name = "shopify"
    title = "Shopify"
    description = "Extract data from Shopify stores (Orders, Products, Customers, Collections)"
    tags = ["ecommerce", "source", "shopify", "saas", "retail"]

    config_schema = {
        "type": "object",
        "properties": {
            "shop_name": {"type": "string", "title": "Shop Name", "description": "Your Shopify store name (without .myshopify.com)"},
            "api_key": {"type": "string", "title": "API Key", "description": "Shopify Admin API access token", "format": "password"},
            "api_version": {"type": "string", "title": "API Version", "default": "2024-01"},
            "objects": {
                "type": "array",
                "title": "Objects",
                "items": {"type": "string"},
                "description": "Shopify objects to replicate",
                "default": ["orders", "products", "customers", "collections"],
            },
        },
        "required": ["shop_name", "api_key"],
    }

    def validate(self) -> None:
        if not self.config.get("shop_name"):
            raise ValueError("Shop name is required")
        if not self.config.get("api_key"):
            raise ValueError("API Key is required")

    async def run(self) -> dict[str, Any]:
        import httpx

        shop_name = self.config["shop_name"]
        api_key = self.config["api_key"]
        api_version = self.config.get("api_version", "2024-01")

        headers = {"X-Shopify-Access-Token": api_key}
        base_url = f"https://{shop_name}.myshopify.com/admin/api/{api_version}"

        objects = self.config.get("objects", ["orders", "products", "customers"])

        rows_extracted = 0
        async with httpx.AsyncClient(headers=headers, timeout=60.0) as client:
            for obj in objects:
                logger.info(f"Extracting {obj}")

                endpoint = f"{base_url}/{obj}.json?limit=250"

                while endpoint:
                    response = await client.get(endpoint)
                    response.raise_for_status()
                    data = response.json()

                    obj_key = obj
                    if obj_key not in data:
                        obj_key = f"{obj[:-1]}" if obj.endswith("s") else obj

                    if obj_key in data:
                        items = data[obj_key]
                        rows_extracted += len(items)
                        logger.info(f"Extracted {len(items)} {obj}")

                    next_link = response.links.get("next")
                    endpoint = next_link["url"] if next_link else None

        return {"status": "completed", "rows_extracted": rows_extracted}


registry.register(ShopifySourceConnector)
