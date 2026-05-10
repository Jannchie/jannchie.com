---
title: Jannchie Authentication Guide
description: Authentication methods and token management for Jannchie API integrations.
tags: [auth, security, docs]
createdAt: 2026-05-10T00:00:00Z
updatedAt: 2026-05-10T00:00:00Z
---

# Jannchie Authentication Guide

> Authentication methods for Jannchie API integrations.

## Public Endpoints

Currently, all public-facing endpoints are unauthenticated and accessible without tokens.

## Future Authentication

Planned authentication methods include:

- **API Keys** — Server-side integrations
- **OAuth 2.0** — Third-party app authorization
- **Personal Access Tokens** — Developer workflows

## Security Best Practices

- Store API keys in environment variables, never in client-side code
- Rotate tokens regularly
- Use HTTPS for all API requests
- Validate webhook signatures

## Related

- [Agent Integration Guide](/en/docs/agents)
- [API Reference](/en/docs/api)
- [Webhooks Guide](/en/docs/webhooks)
