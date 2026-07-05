// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: ['.claude/**', 'app/media/catalog.generated.ts']
  }
)
