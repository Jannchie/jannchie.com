# Repository Guidelines

## Project Structure & Module Organization

- `app/` hosts the Nuxt 4 app: `pages/` for typed routes, `layouts/`, `components/`, `composables/`, `plugins/`, `middleware/`, plus `data/` and `i18n/`.
- `content/` stores Markdown for @nuxt/content; front matter includes `tags`, `createdAt`, `updatedAt`, and optional `description` per `content.config.ts`.
- `public/` carries static assets and PWA icons, `server/` keeps Nitro plugins, and root configs (`nuxt.config.ts`, `unocss.config.ts`, `mdc.config.ts`) govern rendering and markdown.

## Build, Test, and Development Commands

- `pnpm install` to sync dependencies (pnpm only; avoid npm/yarn).
- `pnpm dev` starts the local server at `http://localhost:3000`.
- `pnpm build` compiles for production; `pnpm preview` serves the built output.
- `pnpm generate` produces a static build; `pnpm lint` runs ESLint with the shared `@jannchie` preset and applies safe fixes.

## Coding Style & Naming Conventions

- Use TypeScript with `<script setup lang="ts">`, Composition API, and typed `defineProps`/`defineEmits`; composables live in `app/composables` and follow `useX` naming.
- Components are PascalCase and file names match the exported component; route views belong in `pages/` to leverage Nuxt typed-pages.
- Keep 2-space indentation, avoid unused exports/imports, and rely on the configured auto-imports before adding manual globals.
- Prefer UnoCSS utilities and theme tokens (`text-primary`, `bg-bg-base`, `border-default`) over ad-hoc inline styles; align with the green `primary` palette defined in `unocss.config.ts`.

## Content Localization

- When editing content pages with locale variants (e.g. `content/en`, `content/zh-CN`, `content/ja`), update all relevant languages in the same change.
- Keep `updatedAt` synchronized across locales when the content change is the same.

## Testing Guidelines

- No automated test suite yet; add Vitest specs for new composables, content rendering, or critical UI flows.
- Co-locate `*.spec.ts` near source or under a future `tests/` folder, and wire a `pnpm test` script when introducing coverage.
- For content edits, run `pnpm dev` or `pnpm generate` to catch schema errors and markdown rendering regressions.

## Commit & Pull Request Guidelines

- Use Conventional Commit prefixes seen in history (`feat:`, `fix:`, `style:`); keep messages imperative and scoped.
- Before opening a PR, ensure `pnpm lint` and `pnpm build` pass; summarize scope, link issues, and attach UI screenshots when visuals change.
- Call out impacts to PWA assets, content schema, or new environment variables so reviewers can verify deployment implications.

## Security & Configuration Tips

- Keep secrets in local `.env` files and out of version control; never embed keys or tokens in client code.
- Validate PWA icons in `public/imgs/` when updating assets, and maintain accurate `createdAt`/`updatedAt` fields for published content.
- Avoid importing server-only modules into client bundles; prefer composables for browser logic and Nitro plugins/server utilities for backend concerns.
