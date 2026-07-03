# @netlium/config

The `@netlium/config` package is the shared engineering configuration foundation for Netlium Systems.
It centralizes reusable TypeScript, ESLint, Prettier, and Tailwind settings so every app and package in the monorepo can inherit the same production-ready standards.

## Purpose

- Provide a single source of truth for workspace configuration.
- Reduce duplication across packages and applications.
- Enforce strict compiler rules, modern linting, formatting, and design system tokens.
- Make package and app config consistent and easy to consume.

## Exported configs

- `@netlium/config/tsconfig.base.json`
- `@netlium/config/eslint.config.mjs`
- `@netlium/config/prettier.config.mjs`
- `@netlium/config/tailwind.config.ts`

## How to consume

### TypeScript

In a package or application `tsconfig.json`:

```json
{
  "extends": "@netlium/config/tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "./",
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

### ESLint

In an application or package root `eslint.config.mjs`:

```js
import config from "@netlium/config/eslint.config.mjs";
export default config;
```

### Prettier

In an application or package root `prettier.config.mjs`:

```js
import config from "@netlium/config/prettier.config.mjs";
export default config;
```

### Tailwind

In a Tailwind config file:

```ts
import netliumTheme from "@netlium/config/tailwind.config.ts";

export default {
  ...netliumTheme,
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
};
```

## Notes

- This package is designed for reuse across the monorepo.
- `tsconfig.base.json` sets strict compiler flags, bundler module resolution, and workspace path aliases.
- ESLint uses modern flat config and supports React, Next.js, hooks, accessibility, import ordering, and unused imports.
- Tailwind exports the Netlium institutional design language tokens for colors, typography, spacing, radii, shadows, container layout, animations, and dark mode.
