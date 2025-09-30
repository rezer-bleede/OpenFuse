# OpenFuse Web Dashboard

The web dashboard provides observability and configuration tooling for OpenFuse operators. It is built with Next.js (App Router) and Tailwind-inspired utility classes for rapid iteration. The landing page hydrates itself with live data from the API by calling the connector registry endpoint exposed at `${NEXT_PUBLIC_API_URL}/api/v1/connectors`.

## Commands

```bash
pnpm install
pnpm dev
```

You can also use `npm` or `yarn`, but `pnpm` is recommended for workspace compatibility.

## Architecture

- Routes live under the `app/` directory and can be grouped into community and enterprise segments.
- Shared UI primitives belong in `components/` and are exposed via the `@/components/*` alias.
- Feature flags and license checks should call the API via the shared SDK located in `packages/`.

## Environment variables

Create an `.env.local` file with the following defaults:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```
