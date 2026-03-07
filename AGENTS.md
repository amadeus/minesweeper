# AGENTS

## Project Overview

- Stack: Bun, Vite 7, React 19, TypeScript 5
- Linting: `oxlint`
- Formatting: `oxfmt`
- Import style: use absolute imports from `src/` via `@/`

## Common Commands

- Install: `bun install`
- Dev server: `bun run dev`
- Typecheck: `bun run tsc`
- Lint: `bun run lint`
- Lint autofix: `bun run lint-fix`
- Format: `bun run format`
- Format check: `bun run format:check`
- Build: `bun run build`
- Preview build: `bun run preview`

## Code Conventions

- Prefer absolute imports like `@/Minesweeper` over relative imports inside `src/`
- Keep formatting aligned with `.oxfmtrc.json`
- Keep lint behavior aligned with `.oxlintrc.json`
- Preserve the current Windows 3.1 visual style unless a task explicitly changes the design direction

## State Management Notes

- The game logic currently uses mutable board updates in reducer helpers
- React Compiler was removed because it exposed stale-render issues with the current mutation pattern
- If you revisit compiler-style optimizations, first make board updates immutable in the reveal/flag paths

## Practical Guidance

- After changing gameplay logic, run `bun run tsc`, `bun run lint`, and `bun run build`
- After changing UI interactions, also do a quick manual smoke test in `bun run dev`
