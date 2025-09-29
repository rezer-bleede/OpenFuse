"""Example connector demonstrating the extension API."""

from app.services.connectors import Connector, registry


class ExampleConnector(Connector):
    """Minimal connector used for smoke tests and documentation."""

    name = "example"

    def validate(self) -> None:
        if "endpoint" not in self.config:
            raise ValueError("`endpoint` configuration is required")

    async def run(self) -> None:
        self.validate()
        # Placeholder for I/O operations
        return None


registry.register(ExampleConnector)
