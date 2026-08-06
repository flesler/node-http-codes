# Backwards compatibility (1.x → 2.0.0)

2.0.0 is a major release (TypeScript rewrite, `dist/` publishing, tooling overhaul, long gap since 1.0.0). **The runtime CommonJS API is unchanged** — verified against real dependents before release.

## Preserved (1.0.0 → 2.0.0)

| Pattern | Example | Notes |
|---|---|---|
| `require()` + property access | `require('http-codes').OK` → `200` | Primary API; unchanged |
| Destructuring from `require()` | `const { OK, NOT_FOUND } = require('http-codes')` | `module.exports` is the codes object |
| Variable + property access | `const codes = require('http-codes'); codes.NOT_FOUND` | All GitHub dependents use this shape |
| ESM default import | `import codes from 'http-codes'; codes.OK` | New in 2.0.0; additive |
| Key normalization | `"Request Timeout"` → `REQUEST_TIMEOUT` | Same algorithm as 1.0.0 |
| Runtime-derived keys | Keys follow Node `STATUS_CODES` at load time | Same design as 1.0.0 |

## Implementation: CJS flatten patch

tsup wraps `export default` as `module.exports = { default: … }`. Old consumers expect properties **on** `module.exports`, not under `.default`.

`tsup.config.ts` appends a post-build patch:

```ts
const cjsPatch = ';{const c=module.exports.default;if(c){module.exports=c;}}'
```

This restores the 1.0.0 shape: `require('http-codes')` returns `{ OK: 200, NOT_FOUND: 404, … }` with no `.default` property.

Tests in `src/http-codes.test.ts` (`package import interop`) assert this against the built `dist/http-codes.cjs`.

## Not supported (same as 1.0.0)

| Pattern | Why |
|---|---|
| `import { OK } from 'http-codes'` (native Node ESM) | 1.0.0 was CJS-only; Node never synthesized named exports from this shape |
| `import * as c from 'http-codes'; c.OK` | Use `c.default.OK` — same on 1.0.0 when imported as ESM |
| Deep imports (`require('http-codes/index.js')`) | Never documented; blocked by `exports` field in 2.0.0 |

TypeScript users with `@types/http-codes` who write `import { OK } from 'http-codes'` are fine — TypeScript compiles that to `require('http-codes').OK`, not native ESM named imports.

## Known non-breaking changes (inherent to design)

- **Key set varies by Node version** — e.g. `EARLY_HINTS` on newer Node, `MOVED_TEMPORARILY` renamed to `FOUND`. Same behavior on 1.0.0 when Node updates.
- **Built-in types** — 2.0.0 ships `dist/http-codes.d.ts` with literal keys generated from Node at build time (`npm run generate-types`), plus `Record<string, number>` for keys added on newer Node at runtime. `@types/http-codes` can be removed.

## How we verified dependents

Before release, usage was audited with:

```bash
# Package metadata
npm view http-codes version downloads dependents repository

# GitHub code search (requires gh auth)
gh search code "require('http-codes')" --limit 50
gh search code 'require("http-codes")' --limit 50
gh search code "from 'http-codes'" --limit 50

# npm reverse-deps (often empty for small packages; GitHub search is more useful)
npm view http-codes dependents 2>/dev/null
```

**Finding:** every real usage is `require('http-codes')` then property access. No deep imports, no browser script tags, no deprecated methods.

### Local smoke tests (run after `npm run build`)

```bash
# CJS — primary 1.x API
node -e "const c=require('./dist/http-codes.cjs'); console.log(c.OK, c.NOT_FOUND); console.assert(!('default' in c))"

# CJS destructuring
node -e "const {OK,NOT_FOUND}=require('./dist/http-codes.cjs'); console.assert(OK===200&&NOT_FOUND===404)"

# ESM default import
node --input-type=module -e "import c from './dist/http-codes.js'; console.assert(c.OK===200)"
```

## Packaging changes (why 2.0.0, not 1.1.0)

Runtime CJS could justify a minor bump, but 2.0.0 reflects:

- TypeScript source, published only from `dist/`
- Dual ESM + CJS + built-in types
- New minimum Node.js 14 (`engines`)
- Full tooling overhaul after a long release gap

Upgrade path for 1.x users: change nothing in application code if you used `require('http-codes')`.
