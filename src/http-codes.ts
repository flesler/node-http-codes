import { STATUS_CODES } from 'node:http'

export type HttpCodes = Record<string, number>

function buildHttpCodes(): HttpCodes {
  const result: HttpCodes = {}
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
export default httpCodes
