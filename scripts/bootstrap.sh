#!/usr/bin/env bash
set -euo pipefail

python -m venv .venv
source .venv/bin/activate
pip install poetry
( cd apps/api && poetry install )
corepack enable
corepack prepare pnpm@latest --activate
( cd apps/web && pnpm install )
