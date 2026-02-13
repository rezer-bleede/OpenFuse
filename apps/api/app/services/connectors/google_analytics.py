"""Google Analytics connector for data extraction."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class GoogleAnalyticsSourceConnector(Connector):
    """Google Analytics 4 source connector."""

    name = "google_analytics"
    title = "Google Analytics"
    description = "Extract data from Google Analytics 4 (GA4) reports"
    tags = ["analytics", "source", "google", "saas", "marketing"]

    config_schema = {
        "type": "object",
        "properties": {
            "property_id": {"type": "string", "title": "Property ID", "description": "GA4 property ID"},
            "credentials_json": {
                "type": "string",
                "title": "Credentials JSON",
                "description": "GCP service account JSON credentials",
                "format": "password",
            },
            "start_date": {
                "type": "string",
                "title": "Start Date",
                "description": "Start date in YYYY-MM-DD format",
                "default": "30daysAgo",
            },
            "metrics": {
                "type": "array",
                "title": "Metrics",
                "items": {"type": "string"},
                "default": ["sessions", "users", "pageviews", "bounceRate"],
            },
            "dimensions": {
                "type": "array",
                "title": "Dimensions",
                "items": {"type": "string"},
                "default": ["date", "country", "deviceCategory"],
            },
        },
        "required": ["property_id"],
    }

    def validate(self) -> None:
        if not self.config.get("property_id"):
            raise ValueError("Property ID is required")

    async def run(self) -> dict[str, Any]:
        from google.analytics.data import BetaAnalyticsDataClient
        from google.analytics.data_v1beta.types import DateRange, Dimension, Metric

        client = self._create_client()
        property_id = f"properties/{self.config['property_id']}"

        metrics = [Metric(name=m) for m in self.config.get("metrics", ["sessions", "users"])]
        dimensions = [Dimension(name=d) for d in self.config.get("dimensions", ["date"])]

        request = BetaAnalyticsDataClient().run_report_request(
            property=property_id,
            date_ranges=[DateRange(start_date=self.config.get("start_date", "30daysAgo"), end_date="today")],
            dimensions=dimensions,
            metrics=metrics,
            limit=100000,
        )

        rows_extracted = 0
        for row in request.rows:
            rows_extracted += 1

        logger.info(f"Extracted {rows_extracted} rows from Google Analytics")
        return {"status": "completed", "rows_extracted": rows_extracted}

    def _create_client(self):
        from google.analytics.data import BetaAnalyticsDataClient

        credentials = None
        if self.config.get("credentials_json"):
            import json
            from google.oauth2 import service_account

            credentials = service_account.Credentials.from_service_account_info(
                json.loads(self.config["credentials_json"]),
                scopes=["https://www.googleapis.com/auth/analytics.readonly"],
            )

        return BetaAnalyticsDataClient(credentials=credentials)


registry.register(GoogleAnalyticsSourceConnector)
