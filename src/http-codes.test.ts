import { existsSync } from 'node:fs'
import { STATUS_CODES } from 'node:http'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'
import httpCodes from './http-codes.js'

const distDir = join(dirname(fileURLToPath(import.meta.url)), '../dist')
const distCjs = join(distDir, 'http-codes.cjs')
const distEsm = join(distDir, 'http-codes.js')
const distEsmUrl = pathToFileURL(distEsm).href
const hasDist = existsSync(distCjs) && existsSync(distEsm)

function expectedKey(message: string): string {
  return message.replace("'", '').replace(/[- ]/g, '_').toUpperCase()
}

describe('http-codes', () => {
  it('should mirror every Node STATUS_CODES entry', () => {
    for (const code in STATUS_CODES) {
      const message = STATUS_CODES[code]
      if (!message) {
        continue
      }
      const key = expectedKey(message)
      expect(httpCodes[key]).toBe(Number.parseInt(code, 10))
    }
  })

  it('should expose well-known constants', () => {
    expect(httpCodes.OK).toBe(200)
    expect(httpCodes.NOT_FOUND).toBe(404)
    expect(httpCodes.IM_A_TEAPOT).toBe(418)
    expect(httpCodes.INTERNAL_SERVER_ERROR).toBe(500)
  })

  it('should normalize apostrophes, hyphens, and spaces in keys', () => {
    expect(httpCodes.REQUEST_TIMEOUT).toBe(408)
    expect(httpCodes.GATEWAY_TIMEOUT).toBe(504)
    expect(httpCodes.URI_TOO_LONG).toBe(414)
  })

  describe.skipIf(!hasDist)('package import interop', () => {
    it('should expose codes on require()', () => {
      const require = createRequire(import.meta.url)
      const codes = require(distCjs)
      expect(codes.OK).toBe(200)
      expect(codes.NOT_FOUND).toBe(404)
      expect(codes).not.toHaveProperty('default')
    })

    it('should expose codes via default ESM import from dist', async () => {
      const mod = await import(distEsmUrl)
      const codes = mod.default
      expect(codes.OK).toBe(200)
      expect(codes.NOT_FOUND).toBe(404)
    })
  })
})
