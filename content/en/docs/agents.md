---
title: Jannchie Agent Integration Guide
description: Learn how AI agents can discover, authenticate with, and integrate with Jannchie.
tags: [agents, ai, integration, docs]
createdAt: 2026-05-10T00:00:00Z
updatedAt: 2026-05-10T00:00:00Z
---

# Jannchie Agent Integration Guide

> How AI agents discover and integrate with Jannchie.

## Discovery

AI agents can discover Jannchie through the following channels:

### llms.txt
Access [https://jannchie.com/llms.txt](/llms.txt) for a structured summary of the site, including available endpoints, documentation links, and capabilities.

### llms-full.txt
Access [https://jannchie.com/llms-full.txt](/llms-full.txt) for complete machine-readable documentation.

### OpenAPI Specification
Access [https://jannchie.com/openapi.json](/openapi.json) for the full OpenAPI 3.1.0 specification.

### Structured Data
The homepage includes JSON-LD structured data (`Organization`, `WebSite`, `SoftwareApplication` schemas) for programmatic identity parsing.

## Authentication

See the [Authentication Guide](/en/docs/auth) for available auth methods.

## API Integration

See the [API Reference](/en/docs/api) for endpoint documentation and the interactive Scalar UI.

## Webhooks

See the [Webhooks Guide](/en/docs/webhooks) for event-driven integration support.

## MCP Server

See the [MCP Server Guide](/en/docs/mcp) for Model Context Protocol integration.
