"""Generate the web fallback connector catalog from API connector metadata."""

from __future__ import annotations

import json
from pathlib import Path
import sys


ROOT = Path(__file__).resolve().parents[1]
API_APP = ROOT / "apps" / "api"
WEB_OUTPUT = ROOT / "apps" / "web" / "app" / "lib" / "connectors.catalog.ts"

sys.path.insert(0, str(API_APP))
sys.path.insert(0, str(API_APP / "app"))

from app.services.connectors import derive_capabilities, registry  # noqa: E402


def main() -> None:
    catalog = []
    for definition in registry.describe():
        catalog.append(
            {
                "name": definition.name,
                "title": definition.title,
                "description": definition.description,
                "tags": definition.tags,
                "capabilities": derive_capabilities(definition.tags),
                "config_schema": definition.config_schema,
            }
        )

    catalog = sorted(catalog, key=lambda item: item["name"])
    content = (
        "// Auto-generated fallback connector catalogue from API registry metadata.\n"
        "// Regenerate by running: python3 scripts/generate_connector_catalog.py\n\n"
        f"export const fallbackConnectorCatalog = {json.dumps(catalog, indent=2)} as const;\n"
    )
    WEB_OUTPUT.write_text(content)
    print(f"Wrote {len(catalog)} connectors to {WEB_OUTPUT}")


if __name__ == "__main__":
    main()
