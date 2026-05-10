---
title: Jannchie MCP Server Guide
description: Model Context Protocol (MCP) server support for Jannchie, enabling AI agents to interact with Jannchie resources.
tags: [mcp, ai, agents, docs]
createdAt: 2026-05-10T00:00:00Z
updatedAt: 2026-05-10T00:00:00Z
---

# Jannchie MCP Server Guide

> Model Context Protocol (MCP) integration for AI agents.

## What is MCP?

The Model Context Protocol (MCP) is an open protocol that standardizes how AI agents connect with external tools and data sources. Jannchie supports MCP to enable agents to query content, access documentation, and interact with developer resources.

## Available Resources

### Content Resources
- **Documentation** — Access developer docs and guides
- **API Reference** — Query API endpoints and schemas

## Getting Started

Configure your MCP client to connect to Jannchie:

```json
{
  "mcpServers": {
    "jannchie": {
      "url": "https://jannchie.com"
    }
  }
}
```

## Related

- [Agent Integration Guide](/en/docs/agents)
- [API Reference](/en/docs/api)
- [MCP Specification](https://spec.modelcontextprotocol.io/)
