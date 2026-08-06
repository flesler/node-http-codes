# Changelog

## 2.1.0

### Added

- Literal TypeScript types generated from Node `STATUS_CODES` at build time (`bin/generate-types.ts`), with `Record<string, number>` for forward-compatible keys

### Tooling

- `bin/tsconfig.json` and split `test:types:bin` for script typechecking

## 2.0.0

### Breaking changes (packaging only)

- TypeScript source, published from `dist/` (ESM + CJS + types)
- Minimum Node.js 14
- `exports` field — deep imports like `http-codes/index.js` no longer resolve

**Runtime API unchanged for CommonJS.** `require('http-codes').OK` and `const { OK } = require('http-codes')` work exactly as in 1.0.0. See [docs/backwards-compatibility.md](docs/backwards-compatibility.md) for the full matrix, CJS flatten patch, dependent audit, and smoke-test snippets.

### Changed

- Tracks Node's built-in `STATUS_CODES` map (keys and messages update with your Node version)

### Tooling

- Vitest, ESLint 9, tsup, GitHub Actions CI

## 1.0.0

- Initial release
