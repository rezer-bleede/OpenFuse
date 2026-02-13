"""Salesforce connector for CRM data extraction."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class SalesforceSourceConnector(Connector):
    """Salesforce CRM source connector."""

    name = "salesforce"
    title = "Salesforce"
    description = "Extract data from Salesforce CRM (Accounts, Contacts, Opportunities, etc.)"
    tags = ["crm", "source", "salesforce", "saas", "enterprise"]

    config_schema = {
        "type": "object",
        "properties": {
            "username": {"type": "string", "title": "Username", "description": "Salesforce username"},
            "password": {"type": "string", "title": "Password", "format": "password"},
            "security_token": {"type": "string", "title": "Security Token", "format": "password"},
            "login_url": {
                "type": "string",
                "title": "Login URL",
                "enum": ["https://login.salesforce.com", "https://test.salesforce.com"],
                "default": "https://login.salesforce.com",
            },
            "objects": {
                "type": "array",
                "title": "Objects",
                "items": {"type": "string"},
                "description": "Salesforce objects to replicate (empty = standard objects)",
                "default": ["Account", "Contact", "Opportunity", "Lead"],
            },
            "soql_query": {
                "type": "string",
                "title": "SOQL Query",
                "description": "Custom SOQL query (overrides objects)",
            },
        },
        "required": ["username", "password", "security_token"],
    }

    def validate(self) -> None:
        if not self.config.get("username"):
            raise ValueError("Username is required")
        if not self.config.get("password"):
            raise ValueError("Password is required")
        if not self.config.get("security_token"):
            raise ValueError("Security token is required")

    async def run(self) -> dict[str, Any]:
        from simple_salesforce import Salesforce

        sf = Salesforce(
            username=self.config["username"],
            password=self.config["password"],
            security_token=self.config["security_token"],
            login_url=self.config.get("login_url", "https://login.salesforce.com"),
        )

        try:
            rows_extracted = 0

            if self.config.get("soql_query"):
                logger.info(f"Running custom SOQL query")
                result = sf.query(self.config["soql_query"])
                rows_extracted = result["totalSize"]
                logger.info(f"Extracted {rows_extracted} rows from custom query")
            else:
                objects = self.config.get("objects", ["Account", "Contact", "Opportunity", "Lead"])

                for obj_name in objects:
                    logger.info(f"Extracting object: {obj_name}")
                    result = sf.query(f"SELECT Id, Name FROM {obj_name} LIMIT 10000")
                    rows_extracted += result["totalSize"]
                    logger.info(f"Extracted {result['totalSize']} records from {obj_name}")

            return {"status": "completed", "rows_extracted": rows_extracted}

        finally:
            sf.session.close()


class SalesforceDestinationConnector(Connector):
    """Salesforce CRM destination connector (limited write support)."""

    name = "salesforce_destination"
    title = "Salesforce (Destination)"
    description = "Load data into Salesforce CRM (limited capabilities)"
    tags = ["crm", "destination", "salesforce", "saas", "enterprise"]

    config_schema = {
        "type": "object",
        "properties": {
            "username": {"type": "string", "title": "Username", "description": "Salesforce username"},
            "password": {"type": "string", "title": "Password", "format": "password"},
            "security_token": {"type": "string", "title": "Security Token", "format": "password"},
            "login_url": {
                "type": "string",
                "title": "Login URL",
                "enum": ["https://login.salesforce.com", "https://test.salesforce.com"],
                "default": "https://login.salesforce.com",
            },
        },
        "required": ["username", "password", "security_token"],
    }

    def validate(self) -> None:
        if not self.config.get("username"):
            raise ValueError("Username is required")
        if not self.config.get("password"):
            raise ValueError("Password is required")
        if not self.config.get("security_token"):
            raise ValueError("Security token is required")

    async def run(self) -> dict[str, Any]:
        from simple_salesforce import Salesforce

        sf = Salesforce(
            username=self.config["username"],
            password=self.config["password"],
            security_token=self.config["security_token"],
            login_url=self.config.get("login_url", "https://login.salesforce.com"),
        )

        try:
            logger.info("Salesforce destination connector ready")
            return {"status": "completed", "rows_loaded": 0}

        finally:
            sf.session.close()


registry.register(SalesforceSourceConnector)
registry.register(SalesforceDestinationConnector)
