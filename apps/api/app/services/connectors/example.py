"""Example connector demonstrating the extension API."""

from app.services.connectors import Connector, registry


class ExampleConnector(Connector):
    """Minimal connector used for smoke tests and documentation."""

    name = "example"
    title = "Example JSON Source"
    description = "Fetches JSON from a public endpoint and stores it in the OpenFuse lake."
    tags = ["source", "community"]
    config_schema = {
        "type": "object",
        "properties": {
            "endpoint": {
                "type": "string",
                "format": "uri",
                "title": "Endpoint URL",
                "description": "HTTP endpoint returning JSON payloads.",
            },
            "auth_token": {
                "type": "string",
                "title": "Auth Token",
                "description": "Optional bearer token used for authenticated requests.",
            },
        },
        "required": ["endpoint"],
        "additionalProperties": False,
    }

    def validate(self) -> None:
        if "endpoint" not in self.config:
            raise ValueError("`endpoint` configuration is required")

    async def run(self) -> None:
        self.validate()
        # Placeholder for I/O operations
        return None


registry.register(ExampleConnector)
