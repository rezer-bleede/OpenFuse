"""Jira connector for project management data."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class JiraSourceConnector(Connector):
    """Jira source connector."""

    name = "jira"
    title = "Jira"
    description = "Extract data from Jira (Issues, Projects, Boards, Sprints)"
    tags = ["project management", "source", "jira", "saas", "agile"]

    config_schema = {
        "type": "object",
        "properties": {
            "domain": {"type": "string", "title": "Domain", "description": "Your Jira domain (e.g., company.atlassian.net)"},
            "email": {"type": "string", "title": "Email"},
            "api_token": {"type": "string", "title": "API Token", "format": "password"},
            "project_keys": {
                "type": "array",
                "title": "Project Keys",
                "items": {"type": "string"},
                "description": "Specific project keys (empty = all)",
            },
            "objects": {
                "type": "array",
                "title": "Objects",
                "items": {"type": "string"},
                "description": "Jira objects to replicate",
                "default": ["issues", "projects"],
            },
        },
        "required": ["domain", "email", "api_token"],
    }

    def validate(self) -> None:
        if not self.config.get("domain"):
            raise ValueError("Domain is required")
        if not self.config.get("email"):
            raise ValueError("Email is required")
        if not self.config.get("api_token"):
            raise ValueError("API Token is required")

    async def run(self) -> dict[str, Any]:
        import httpx
        from base64 import b64encode

        domain = self.config["domain"]
        email = self.config["email"]
        api_token = self.config["api_token"]

        auth = b64encode(f"{email}:{api_token}".encode()).decode()
        headers = {"Authorization": f"Basic {auth}", "Accept": "application/json"}
        base_url = f"https://{domain}/rest/api/3"

        objects = self.config.get("objects", ["issues", "projects"])
        project_keys = self.config.get("project_keys", [])

        rows_extracted = 0
        async with httpx.AsyncClient(headers=headers, timeout=60.0) as client:
            if "projects" in objects:
                logger.info("Extracting projects")
                response = await client.get(f"{base_url}/project")
                if response.status_code == 200:
                    projects = response.json()
                    rows_extracted += len(projects)
                    logger.info(f"Extracted {len(projects)} projects")

            if "issues" in objects:
                jql = ""
                if project_keys:
                    jql = f"project IN ({','.join(project_keys)})"

                logger.info("Extracting issues")
                start_at = 0
                max_results = 100

                while True:
                    params = {"startAt": start_at, "maxResults": max_results}
                    if jql:
                        params["jql"] = jql

                    response = await client.get(f"{base_url}/search", params=params)
                    if response.status_code != 200:
                        break

                    data = response.json()
                    issues = data.get("issues", [])
                    rows_extracted += len(issues)
                    logger.info(f"Extracted {len(issues)} issues")

                    if start_at + max_results >= data.get("total", 0):
                        break
                    start_at += max_results

        return {"status": "completed", "rows_extracted": rows_extracted}


registry.register(JiraSourceConnector)
