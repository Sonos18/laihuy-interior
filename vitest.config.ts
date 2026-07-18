import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Playwright owns tests/e2e (*.spec.ts). Without this, vitest's default glob
    // (**/*.{test,spec}.ts) would try to run the browser suite as unit tests.
    include: ['tests/**/*.test.ts'],
    exclude: ['tests/e2e/**', 'node_modules/**', '.nuxt/**', '.output/**']
  }
})
