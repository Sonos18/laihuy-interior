# Contact Form Submit Seam Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the public contact page into a real lead-entry interface whose valid submit currently stops at `console.log("dữ liệu", form)` so a separate internal system API can be connected later.

**Architecture:** Keep the public Nuxt application independent from the future internal application. Preserve the existing client-side validation and accessibility behavior, remove the simulated local-review state machine, and expose one explicit submit seam without adding persistence, authentication, server routes, or delivery claims.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Playwright.

## Global Constraints

- Public visitors do not authenticate.
- A valid submit performs only `console.log("dữ liệu", form)`.
- Invalid submits keep the existing field errors and first-invalid-field focus behavior.
- Do not add an API, database, auth, email transport, admin UI, artificial pending state, or success state.
- Keep all user-facing copy bilingual and do not claim that data was sent, received, stored, or will be answered.

---

### Task 1: Replace the local-review flow with the future API seam

**Files:**
- Modify: `tests/e2e/contact-layout.spec.ts`
- Modify: `tests/e2e/contact-density.spec.ts`
- Modify: `app/pages/lien-he.vue`
- Modify: `app/data/ui.ts`

**Interfaces:**
- Consumes: the existing `ContactDraft`, `validate()`, `focusFirstError()`, and bilingual `uiText.contactForm` data.
- Produces: `submitForm()` that validates and, only for valid data, executes `console.log("dữ liệu", form)` once.

- [ ] **Step 1: Write the failing browser tests**

  Update the contact tests so a valid submission observes the browser console and expects one `dữ liệu` log containing the entered name, phone, email, project type, and message. Assert that the form remains visible and no reviewed/success block appears. Keep the invalid-submit assertions and ensure invalid data creates no `dữ liệu` log.

- [ ] **Step 2: Run the focused tests and verify RED**

  Run:

  ```powershell
  pnpm.cmd exec playwright test tests/e2e/contact-layout.spec.ts tests/e2e/contact-density.spec.ts --project=vr
  ```

  Expected: FAIL because the current implementation waits 700 ms and replaces the form with `contact-reviewed` instead of logging the valid draft.

- [ ] **Step 3: Implement the minimal frontend seam**

  Remove `LOCAL_REVIEW_DELAY_MS`, `reviewLocally`, `SubmitState`, the reviewed/error/reset/edit handlers, and their template branches. Keep `submitForm()` asynchronous only for invalid-focus handling:

  ```ts
  const submitForm = async () => {
    if (!validate()) {
      await focusFirstError()
      return
    }

    console.log("dữ liệu", form)
  }
  ```

  Replace local-review copy with neutral lead-form copy and remove unused reviewed, local-error, submitting, and pending strings.

- [ ] **Step 4: Run the focused tests and verify GREEN**

  Run the same focused Playwright command and require exit code 0.

- [ ] **Step 5: Verify the affected application surface**

  Run:

  ```powershell
  pnpm.cmd lint
  pnpm.cmd typecheck
  pnpm.cmd test
  pnpm.cmd build
  pnpm.cmd test:gates:a11y
  ```

  Inspect `git diff --check`, the final diff, and `git status --short`. Do not update visual snapshots and do not commit without explicit user approval.
