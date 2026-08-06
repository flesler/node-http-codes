# http-codes

Map of HTTP status messages to codes — the inverse of [Node's built-in `STATUS_CODES`](https://nodejs.org/api/http.html#httpstatuscodes).

Stays in sync with Node: when the runtime adds or renames a status, this package picks it up automatically.

[![NPM](https://nodei.co/npm/http-codes.png?compact=true)](https://npmjs.org/package/http-codes)

```bash
npm install http-codes
```

```js
import codes from 'http-codes'
// or
const codes = require('http-codes')

codes.OK          // 200
codes.NOT_FOUND   // 404
codes.IM_A_TEAPOT // 418
```

---

## Why use this

- **Ultra simple** — one small module, zero dependencies
- **Always current** — derived from Node's built-in map at load time
- **TypeScript types** included

---

## API

The module exports a plain object. Each key is the status message in `SCREAMING_SNAKE_CASE`; each value is the numeric code.

```js
import codes from 'http-codes'

if (res.statusCode === codes.NOT_FOUND) {
  // …
}
```

Keys are normalized from Node's messages: apostrophes removed, hyphens and spaces become underscores, then uppercased (`"Request Timeout"` → `REQUEST_TIMEOUT`).

The exact set of keys depends on your Node version. Run `npm test` to print the current map.

---

## Upgrading from 1.x

**No code changes needed** if you used `require('http-codes')` and property access — that is the entire 1.0.0 API and it is preserved in 2.0.0.

2.0.0 is a major release because of packaging (TypeScript, `dist/`, dual ESM/CJS, built-in types, tooling) and the long gap since 1.0.0 — not because the `require()` shape changed.

Full compatibility matrix, dependent-audit commands, and smoke tests: [docs/backwards-compatibility.md](docs/backwards-compatibility.md).

---

## License

MIT — see [LICENSE](LICENSE).
