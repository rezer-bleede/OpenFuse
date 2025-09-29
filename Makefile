.PHONY: install install-backend install-frontend format lint test

install: install-backend install-frontend

install-backend:
	cd apps/api && poetry install

install-frontend:
	cd apps/web && pnpm install

format:
	cd apps/api && poetry run ruff format .
	cd apps/web && pnpm lint -- --fix

lint:
	cd apps/api && poetry run ruff check .
	cd apps/web && pnpm lint

test:
	cd apps/api && poetry run pytest
	cd packages/python/openfuse_common && pytest
