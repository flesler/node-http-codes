import { STATUS_CODES } from 'node:http'
import type { HttpCodes } from './http-codes.generated.js'

function buildHttpCodes(): HttpCodes {
  const result = {} as HttpCodes
  for (const code in STATUS_CODES) {
    const message = STATUS_CODES[code]
    if (!message) {
      continue
    }
    const key = message.replace("'", '').replace(/[- ]/g, '_').toUpperCase()
    result[key] = Number.parseInt(code, 10)
  }
  return result
}

const httpCodes = buildHttpCodes()
export type { HttpCodes } from './http-codes.generated.js'
export default httpCodes
