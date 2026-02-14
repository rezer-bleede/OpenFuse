---
title: Introduction
description: Learn what OpenFuse is and how it can help you build data pipelines.
slug: /getting-started/introduction
---

# Introduction

OpenFuse is an open-source data integration platform designed for modern data teams. It enables you to create **reliable, scalable data pipelines** that move data from various sources into your analytics warehouse or data lake.

## What is OpenFuse?

OpenFuse provides a unified platform for:

- **Extracting** data from 30+ sources (SaaS APIs, databases, files)
- **Transforming** data with built-in mapping and custom transformations
- **Loading** data into warehouses like Snowflake, BigQuery, Redshift, and more

## Key Concepts

### Connectors

Connectors are pre-built integrations that handle the complexity of communicating with specific data sources or destinations. OpenFuse provides two types:

- **Sources**: Pull data from external systems
- **Destinations**: Write data to target systems

### Pipelines

A pipeline defines the flow of data from a source to a destination. Each pipeline consists of:

- **Source configuration**: What data to extract
- **Transformations**: How to modify the data
- **Destination configuration**: Where to load the data

### Jobs

A job is an execution of a pipeline. Jobs can be run on-demand or scheduled at specific intervals.

## Use Cases

### Analytics Warehousing

Build a unified view of your business by consolidating data from all sources into a single warehouse.

### Reverse ETL

Sync data from your warehouse back to operational tools like Salesforce, HubSpot, or Slack.

### Data Migration

Move data between systems with zero downtime using incremental sync capabilities.

## Next Steps

- [Quick Start](/docs/getting-started/quick-start) - Get up and running in 5 minutes
- [Installation](/docs/getting-started/installation) - Detailed installation guide
- [Connectors](/docs/connectors/overview) - Browse available integrations
