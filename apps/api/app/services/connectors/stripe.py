"""Stripe connector for payment data extraction."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class StripeSourceConnector(Connector):
    """Stripe payment platform source connector."""

    name = "stripe"
    title = "Stripe"
    description = "Extract data from Stripe payment platform (Charges, Customers, Invoices, Subscriptions)"
    tags = ["payments", "source", "stripe", "saas", "finance"]

    config_schema = {
        "type": "object",
        "properties": {
            "api_key": {"type": "string", "title": "API Key", "description": "Stripe secret key", "format": "password"},
            "api_version": {"type": "string", "title": "API Version", "default": "2023-10-16"},
            "objects": {
                "type": "array",
                "title": "Objects",
                "items": {"type": "string"},
                "description": "Stripe objects to replicate",
                "default": ["charges", "customers", "invoices", "subscriptions"],
            },
        },
        "required": ["api_key"],
    }

    def validate(self) -> None:
        if not self.config.get("api_key"):
            raise ValueError("API Key is required")

    async def run(self) -> dict[str, Any]:
        import stripe

        stripe.api_key = self.config["api_key"]
        stripe.api_version = self.config.get("api_version", "2023-10-16")

        objects = self.config.get("objects", ["charges", "customers", "invoices", "subscriptions"])

        rows_extracted = 0

        object_mapping = {
            "charges": stripe.Charge,
            "customers": stripe.Customer,
            "invoices": stripe.Invoice,
            "subscriptions": stripe.Subscription,
            "payments": stripe.PaymentIntent,
        }

        for obj_name in objects:
            logger.info(f"Extracting {obj_name}")
            stripe_obj = object_mapping.get(obj_name)

            if stripe_obj:
                page = stripe_obj.list(limit=100)
                count = 0

                while page:
                    count += len(page.data)
                    page = page.next_page()

                rows_extracted += count
                logger.info(f"Extracted {count} {obj_name}")

        return {"status": "completed", "rows_extracted": rows_extracted}


registry.register(StripeSourceConnector)
