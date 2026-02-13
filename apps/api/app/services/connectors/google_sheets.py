"""Google Sheets connector for spreadsheet data."""

import logging
from typing import Any

from app.services.connectors import Connector, registry

logger = logging.getLogger(__name__)


class GoogleSheetsSourceConnector(Connector):
    """Google Sheets source connector."""

    name = "google_sheets"
    title = "Google Sheets"
    description = "Extract data from Google Sheets spreadsheets"
    tags = ["spreadsheet", "source", "google", "sheets"]

    config_schema = {
        "type": "object",
        "properties": {
            "spreadsheet_id": {"type": "string", "title": "Spreadsheet ID", "description": "Google Sheets ID from URL"},
            "credentials_json": {
                "type": "string",
                "title": "Credentials JSON",
                "description": "GCP service account JSON credentials",
                "format": "password",
            },
            "sheet_names": {
                "type": "array",
                "title": "Sheet Names",
                "items": {"type": "string"},
                "description": "Specific sheets to extract (empty = all sheets)",
            },
            "header_row": {"type": "integer", "title": "Header Row", "default": 1},
        },
        "required": ["spreadsheet_id"],
    }

    def validate(self) -> None:
        if not self.config.get("spreadsheet_id"):
            raise ValueError("Spreadsheet ID is required")

    async def run(self) -> dict[str, Any]:
        import gspread
        from google.oauth2 import service_account

        credentials = None
        if self.config.get("credentials_json"):
            import json
            credentials = service_account.Credentials.from_service_account_info(
                json.loads(self.config["credentials_json"]),
                scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"],
            )

        gc = gspread.auth(credentials=credentials)
        spreadsheet = gc.open_by_key(self.config["spreadsheet_id"])

        sheet_names = self.config.get("sheet_names")
        if not sheet_names:
            sheet_names = [s.title for s in spreadsheet.worksheets()]

        rows_extracted = 0
        for sheet_name in sheet_names:
            logger.info(f"Extracting sheet: {sheet_name}")
            worksheet = spreadsheet.worksheet(sheet_name)
            data = worksheet.get_all_records(expected_headers=[])
            rows_extracted += len(data)
            logger.info(f"Extracted {len(data)} rows from {sheet_name}")

        return {"status": "completed", "rows_extracted": rows_extracted}


class GoogleSheetsDestinationConnector(Connector):
    """Google Sheets destination connector."""

    name = "google_sheets_destination"
    title = "Google Sheets (Destination)"
    description = "Load data into Google Sheets spreadsheets"
    tags = ["spreadsheet", "destination", "google", "sheets"]

    config_schema = {
        "type": "object",
        "properties": {
            "spreadsheet_id": {"type": "string", "title": "Spreadsheet ID", "description": "Google Sheets ID from URL"},
            "credentials_json": {
                "type": "string",
                "title": "Credentials JSON",
                "description": "GCP service account JSON credentials",
                "format": "password",
            },
            "sheet_name": {"type": "string", "title": "Sheet Name", "default": "Sheet1"},
        },
        "required": ["spreadsheet_id"],
    }

    def validate(self) -> None:
        if not self.config.get("spreadsheet_id"):
            raise ValueError("Spreadsheet ID is required")

    async def run(self) -> dict[str, Any]:
        import gspread
        from google.oauth2 import service_account

        credentials = None
        if self.config.get("credentials_json"):
            import json
            credentials = service_account.Credentials.from_service_account_info(
                json.loads(self.config["credentials_json"]),
                scopes=["https://www.googleapis.com/auth/spreadsheets"],
            )

        gc = gspread.auth(credentials=credentials)
        spreadsheet = gc.open_by_key(self.config["spreadsheet_id"])

        sheet_name = self.config.get("sheet_name", "Sheet1")
        logger.info(f"Google Sheets destination ready - sheet: {sheet_name}")

        return {"status": "completed", "rows_loaded": 0}


registry.register(GoogleSheetsSourceConnector)
registry.register(GoogleSheetsDestinationConnector)
