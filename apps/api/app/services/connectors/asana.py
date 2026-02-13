"""Asana connector for project management data."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class AsanaSourceConnector(Connector):
    """Asana source connector."""

    name = "asana"
    title = "Asana"
    description = "Extract data from Asana (Tasks, Projects, Stories, Users)"
    tags = ["project management", "source", "asana", "saas", "productivity"]

    config_schema = {
        "type": "object",
        "properties": {
            "access_token": {"type": "string", "title": "Access Token", "format": "password"},
            "workspace_id": {"type": "string", "title": "Workspace ID"},
            "project_ids": {
                "type": "array",
                "title": "Project IDs",
                "items": {"type": "string"},
                "description": "Specific project IDs (empty = all)",
            },
            "objects": {
                "type": "array",
                "title": "Objects",
                "items": {"type": "string"},
                "description": "Asana objects to replicate",
                "default": ["tasks", "projects"],
            },
        },
        "required": ["access_token"],
    }

    def validate(self) -> None:
        if not self.config.get("access_token"):
            raise ValueError("Access Token is required")

    async def run(self) -> dict[str, Any]:
        import httpx

        access_token = self.config["access_token"]

        headers = {"Authorization": f"Bearer {access_token}"}
        base_url = "https://app.asana.com/api/1.0"

        objects = self.config.get("objects", ["tasks", "projects"])
        project_ids = self.config.get("project_ids", [])

        rows_extracted = 0
        async with httpx.AsyncClient(headers=headers, timeout=60.0) as client:
            if "projects" in objects and not project_ids:
                workspace_id = self.config.get("workspace_id", "")
                if workspace_id:
                    response = await client.get(f"{base_url}/workspaces/{workspace_id}/projects")
                    if response.status_code == 200:
                        projects = response.json().get("data", [])
                        project_ids = [p["gid"] for p in projects]

            for project_id in project_ids:
                if "tasks" in objects:
                    logger.info(f"Extracting tasks from project {project_id}")
                    response = await client.get(
                        f"{base_url}/projects/{project_id}/tasks",
                        params={"opt_fields": "name,completed,created_at,due_on"},
                    )
                    if response.status_code == 200:
                        tasks = response.json().get("data", [])
                        rows_extracted += len(tasks)
                        logger.info(f"Extracted {len(tasks)} tasks")

        return {"status": "completed", "rows_extracted": rows_extracted}


registry.register(AsanaSourceConnector)
