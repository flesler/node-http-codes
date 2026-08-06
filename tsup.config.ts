import { defineConfig } from 'tsup'

export default defineConfig({
  entry: { 'http-codes': 'src/http-codes.ts' },
  format: ['esm', 'cjs'],
  platform: 'node',
  target: 'es2020',
  outDir: 'dist',
  dts: true,
  clean: true,
  splitting: false,
  treeshake: true,
  minify: true,
  async onSuccess() {
    const { readFileSync, writeFileSync } = await import('node:fs')
    const { join } = await import('node:path')

    // 1.x compat: tsup wraps default export under .default; 1.0.0 exposed codes on module.exports directly
    const cjsFile = join('dist', 'http-codes.cjs')
    const cjsPatch = ';{const c=module.exports.default;if(c){module.exports=c;}}'
    const cjs = readFileSync(cjsFile, 'utf8')
    if (!cjs.endsWith(cjsPatch)) {
      writeFileSync(cjsFile, cjs + cjsPatch)
    }
  },
  outExtension({ format }) {
    if (format === 'cjs') {
      return { js: '.cjs' }
    }
    return { js: '.js' }
  },
})
