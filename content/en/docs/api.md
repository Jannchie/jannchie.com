---
title: Jannchie API Reference
description: OpenAPI documentation for Jannchie developer and agent integrations. Interactive API reference for all available endpoints.
tags: [api, openapi, docs]
createdAt: 2026-05-10T00:00:00Z
updatedAt: 2026-05-10T00:00:00Z
---

# Jannchie API Reference

> Interactive API documentation powered by OpenAPI 3.1.0 and Scalar.

## Available Endpoints

### Health Check
`GET /api/health` — Returns the health status of the API.

### Sitemap URLs
`GET /api/_sitemap-urls` — Returns all content URLs for the sitemap.

### LLMs.txt
`GET /llms.txt` — Machine-readable site summary for AI agents.

### LLMs Full Documentation
`GET /llms-full.txt` — Complete documentation for AI agents.

### OpenAPI Specification
`GET /openapi.json` — The OpenAPI 3.1.0 specification for Jannchie API.

## Interactive Docs

Visit [jannchie.com/docs/api](/en/docs/api) (via Scalar UI) for interactive API documentation with request/response examples.

## Authentication

Currently, all public endpoints are unauthenticated. For future authenticated endpoints, see the [Auth Guide](/en/docs/auth).
