---
title: Jannchie Webhooks Guide
description: Event-driven integration with Jannchie webhooks for real-time notifications.
tags: [webhooks, events, docs]
createdAt: 2026-05-10T00:00:00Z
updatedAt: 2026-05-10T00:00:00Z
---

# Jannchie Webhooks Guide

> Event-driven integration with Jannchie webhooks.

## Overview

Webhooks allow external services to receive real-time notifications when events occur in Jannchie. Configure your webhook endpoints to receive HTTP POST requests with JSON payloads.

## Configuration

Webhook endpoints can be configured via the API. Each webhook subscribes to one or more event types.

### Event Types

- `content.created` — New content published
- `content.updated` — Existing content modified
- `content.deleted` — Content removed

### Payload Format

```json
{
  "event": "content.created",
  "timestamp": "2026-05-10T00:00:00Z",
  "data": {
    "path": "/en/docs/api",
    "title": "API Reference"
  }
}
```

## Security

- Verify webhook signatures using your secret key
- Use HTTPS endpoints only
- Respond with 2xx status codes within 10 seconds

## Related

- [API Reference](/en/docs/api)
- [Authentication Guide](/en/docs/auth)
