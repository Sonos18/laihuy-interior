// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: ['.claude/**', '.worktrees/**', 'app/media/catalog.generated.ts', 'app/media/fallback.generated.ts']
  },
  {
    // `app.pageTransition` wraps <NuxtPage> in <Transition mode="out-in">, which needs one root
    // element. Development builds keep template comments, so a comment beside the root turns a
    // page into a fragment: leaving it never completes, the next page never mounts and <main>
    // collapses to the footer. Production strips comments, so only `pnpm dev` shows it.
    // LegalPage is the whole template of both legal routes, so it is a page root too.
    files: ['app/pages/**/*.vue', 'app/components/LegalPage.vue'],
    rules: {
      'vue/no-multiple-template-root': ['error', { disallowComments: true }]
    }
  }
)
