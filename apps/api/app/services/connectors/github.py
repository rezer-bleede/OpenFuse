"""GitHub connector for repository data extraction."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class GitHubSourceConnector(Connector):
    """GitHub source connector for repository data."""

    name = "github"
    title = "GitHub"
    description = "Extract data from GitHub (Issues, PRs, Commits, Releases, Contributors)"
    tags = ["developer", "source", "github", "saas", "version control"]

    config_schema = {
        "type": "object",
        "properties": {
            "token": {"type": "string", "title": "Personal Access Token", "format": "password"},
            "owner": {"type": "string", "title": "Repository Owner", "description": "GitHub username or organization"},
            "repo": {"type": "string", "title": "Repository Name"},
            "objects": {
                "type": "array",
                "title": "Objects",
                "items": {"type": "string"},
                "description": "GitHub objects to replicate",
                "default": ["issues", "pull_requests", "commits", "releases"],
            },
        },
        "required": ["token", "owner", "repo"],
    }

    def validate(self) -> None:
        if not self.config.get("token"):
            raise ValueError("Personal Access Token is required")
        if not self.config.get("owner"):
            raise ValueError("Repository owner is required")
        if not self.config.get("repo"):
            raise ValueError("Repository name is required")

    async def run(self) -> dict[str, Any]:
        import httpx

        token = self.config["token"]
        owner = self.config["owner"]
        repo = self.config["repo"]

        headers = {"Authorization": f"token {token}", "Accept": "application/vnd.github.v3+json"}
        base_url = f"https://api.github.com/repos/{owner}/{repo}"

        objects = self.config.get("objects", ["issues", "pull_requests", "commits"])

        rows_extracted = 0
        async with httpx.AsyncClient(headers=headers, timeout=60.0) as client:
            for obj in objects:
                logger.info(f"Extracting {obj}")

                endpoint_map = {
                    "issues": f"{base_url}/issues?state=all&per_page=100",
                    "pull_requests": f"{base_url}/pulls?state=all&per_page=100",
                    "commits": f"{base_url}/commits?per_page=100",
                    "releases": f"{base_url}/releases?per_page=100",
                    "contributors": f"{base_url}/contributors?per_page=100",
                }

                endpoint = endpoint_map.get(obj)
                if not endpoint:
                    continue

                while endpoint:
                    response = await client.get(endpoint)
                    response.raise_for_status()

                    if "link" in response.headers:
                        links = response.headers["link"]
                        next_link = None
                        for link in links.split(","):
                            if 'rel="next"' in link:
                                next_link = link.split(";")[0].strip("<> ")
                                break
                        endpoint = next_link
                    else:
                        endpoint = None

                    data = response.json()
                    rows_extracted += len(data)
                    logger.info(f"Extracted {len(data)} {obj}")

        return {"status": "completed", "rows_extracted": rows_extracted}


registry.register(GitHubSourceConnector)
