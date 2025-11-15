# Repository Guidelines

## Project Structure & Module Organization

Morphly runs as a pnpm/turbo monorepo. Product code lives in `projects/app` (Next.js 16 surface plus Drizzle/Redis plumbing) and marketing assets in `projects/www`. Shared UI primitives, hooks, and styles sit in `packages/ui` with exports like `@workspace/ui/components/*`, while `packages/eslint-config` and `packages/typescript-config` provide shared tooling. Feature work should stay within `projects/app/src/features/<feature>`; promote reusable pieces into `packages/ui/src` so both apps stay in sync.

## Build, Test, and Development Commands

Install once with `pnpm install` (Node 20+). `pnpm dev` launches turbo’s pipeline, starting both Next apps via Turbopack on ports 3000/3001; scope dev servers with `pnpm --filter app dev` or `pnpm --filter www dev` when needed. Use `pnpm build` for production bundles and `pnpm --filter app db:migrate` to apply Drizzle schema changes. Quality gates are `pnpm lint`, `pnpm format:check`, and `pnpm --filter <pkg> typecheck`. Enable the staged-file formatter via `pnpm lefthook install`.

## Coding Style & Naming Conventions

Everything is TypeScript + React using ES modules. Prettier enforces single quotes and minimal arrow parens, and `prettier-plugin-tailwindcss` sorts utility classes—never hand-tweak the order. Components use PascalCase filenames (`ChatPanel.tsx`), hooks are camelCase (`useThreadStore.ts`), and route folders follow kebab-case. Import via the workspace TS paths instead of deep relative hops to keep ownership boundaries obvious.

## Testing Guidelines

Automated test runners have not shipped yet, so linting, type-checking, and manual smoke passes are the release gates. When adding risky logic, provide a reproducible demo (storybook entry, dedicated page, or API route), record manual steps in the PR, and co-locate provisional specs as `<name>.test.ts(x)` so Vitest/RTL can be introduced without churn. Target smoke coverage for new UI flows and complete coverage on pure utilities.

## Commit & Pull Request Guidelines

History follows lightweight Conventional Commits (`chore:`, `bugfix:`). Write imperative, lowercase subjects (`feat: add image blending pipeline`). Open PRs from topic branches with a short context block, testing notes, screenshots for visual tweaks, and linked issues. Verify `pnpm lint` and `pnpm build` locally before requesting review.

## Environment & Secrets

Create `projects/app/.env.local` (copy from the template in the same folder) and supply Drizzle, Redis, and AI provider keys. Keep secrets out of Git; rely on Vercel project variables or local `.env.local` instead. Document new config flags in PR descriptions and internal runbooks.
