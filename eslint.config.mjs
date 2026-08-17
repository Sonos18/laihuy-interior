// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: ['.claude/**', '.worktrees/**', 'app/media/catalog.generated.ts', 'app/media/fallback.generated.ts']
  }
)
