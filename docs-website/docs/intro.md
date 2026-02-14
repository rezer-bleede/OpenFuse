---
sidebar_position: 1
slug: /
title: Welcome to OpenFuse
description: OpenFuse is an open-source data integration platform that lets you extract, transform, and load (ETL) data from 30+ sources into your analytics warehouse.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# OpenFuse Documentation

OpenFuse is an **open-source, modular data integration platform** that lets you extract, transform, and load (ETL) data from dozens of sources into your analytics warehouse or data lake.

## Why OpenFuse?

| Feature | Description |
|---------|-------------|
| **30+ Connectors** | Pre-built integrations for popular APIs and databases |
| **Configuration-Driven** | Set up pipelines without writing boilerplate code |
| **Incremental Loads** | Keep data fresh with smart change data capture |
| **Open Source** | 100% transparent, community-driven development |
| **Extensible** | Build custom connectors with our SDK |

## Quick Links

- **[Quick Start](/docs/getting-started/quick-start)** - Get running in 5 minutes
- **[Connectors](/docs/connectors/overview)** - Browse all available integrations
- **[API Reference](/docs/api-reference/overview)** - Developer documentation
- **[GitHub](https://github.com/your-username/openfuse)** - Star us on GitHub

## Installation

<Tabs>
  <TabItem value="docker" label="Docker" default>

```bash
docker compose -f infra/docker/docker-compose.yml up --build
```

  </TabItem>
  <TabItem value="npm" label="npm">

```bash
npm install @openfuse/api @openfuse/web
```

  </TabItem>
  <TabItem value="pip" label="pip">

```bash
pip install openfuse
```

  </TabItem>
</Tabs>

## Architecture

OpenFuse follows an **open-core** model:

- **Community Edition**: Core ETL functionality, all connectors, self-hosted
- **Enterprise Edition**: Advanced features, premium support, managed hosting

## Community

Join thousands of developers building data pipelines with OpenFuse:

- [GitHub Discussions](https://github.com/your-username/openfuse/discussions)
- [Discord](https://discord.gg/openfuse)
- [Twitter](https://twitter.com/openfuse)

---

**Ready to get started?** Head to the [Quick Start Guide](/docs/getting-started/quick-start).
