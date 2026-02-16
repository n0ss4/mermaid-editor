Use Bun exclusively. No Node.js, no npm/yarn/pnpm, no dotenv.

## Commands

- `bun install` -- install deps
- `bun --hot src/index.ts` -- dev server with HMR
- `bun test` -- run tests

## Stack

- **Runtime:** Bun
- **Frontend:** React 19 via Bun HTML imports (no Vite)
- **Diagrams:** Mermaid 11
- **Server:** `Bun.serve()` (no Express)

## Conventions

- Prefer `Bun.file` over `node:fs`
- Use `bun:test` with `import { test, expect } from "bun:test"`
- HTML files import `.tsx` directly -- Bun bundles automatically
- Bun auto-loads `.env` -- no dotenv needed
- Use `Bun.$\`cmd\`` instead of execa
