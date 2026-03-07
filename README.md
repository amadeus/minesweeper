# Windows 3.1 Minesweeper

Still a few more things to do, but the main game cycle is in place.

You can check out a recent version of it [here](https://minesweeper.amadeus.wtf/).

## Development

If you want to play around with this, feel free. The only major system
requirement is [bun](https://bun.sh/). Run:

```
bun install
```

Then start the local dev server with:

```
bun run dev
```

## Scripts

- TypeScript check:

```
bun run tsc
```

- Lint:

```
bun run lint
```

- Auto-fix lint issues where possible:

```
bun run lint-fix
```

- Format:

```
bun run format
```

- Check formatting without writing changes:

```
bun run format:check
```

- Production build:

```
bun run build
```

- Preview the production build locally:

```
bun run preview
```

## Tooling Notes

- Build tooling uses Vite 7 with React 19
- Linting uses `oxlint`
- Formatting uses `oxfmt`
- Source imports use the `@/` alias for files in `src/`
