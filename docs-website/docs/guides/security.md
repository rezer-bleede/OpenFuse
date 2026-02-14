---
title: Security Guide
description: Secure your OpenFuse deployment.
slug: /guides/security
---

# Security Guide

Best practices for securing your OpenFuse installation.

## API Keys

- Never commit API keys to version control
- Use environment variables
- Rotate keys regularly

## Encryption

| Data at Rest | Data in Transit |
|--------------|-----------------|
| Database encryption | TLS 1.2+ |
| S3 bucket encryption | HTTPS only |

## Network Security

- Use VPC for database access
- Implement firewall rules
- Enable SSL for all connections

## Access Control

- Implement RBAC for team access
- Use least-privilege原则
- Audit access logs

## Compliance

OpenFuse supports:

- GDPR data handling
- SOC 2 compliance
- HIPAA (Enterprise)

## Related

- [Configuration](/docs/getting-started/configuration)
- [Best Practices](/docs/guides/best-practices)
