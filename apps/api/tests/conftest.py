"""Pytest configuration for the API service."""

from __future__ import annotations

import sys
from pathlib import Path

# Ensure the application package is importable when tests are executed via Poetry without installation.
ROOT = Path(__file__).resolve().parents[1]
APP_PATH = ROOT / "app"

if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
if str(APP_PATH) not in sys.path:
    sys.path.insert(0, str(APP_PATH))
