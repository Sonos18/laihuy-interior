# Phase 5 — Roadmap (CMS & media database)

**Status:** Architectural decisions only — no implementation. Recorded so future work follows the intended direction.
**Date:** 2026-07-05

This document captures forward-looking decisions for when the media database / admin CMS arrives. Nothing here is built yet; the current filesystem-driven architecture (Phases 1–3) stands unchanged.

---

## D1 — `ProjectMediaId` must become independent of the folder name

### Current state (filesystem-driven — acceptable for now)

The stable identifier a business `Project` uses to reference media **is** the filesystem folder name:

```
Filesystem folder  ──►  ProjectMediaId
  projects/khach-san-eo-gio/…        'khach-san-eo-gio'
```

`app/data/projects.ts` sets `mediaId: 'khach-san-eo-gio'`; `app/media/catalog.generated.ts` keys `projectMedia` by that same folder name. This is correct and sufficient while the filesystem is the single source of truth: the folder name is stable enough, and coupling id≡folder keeps the generated catalog trivially derivable.

### The problem this creates long-term

Because `ProjectMediaId == folder name`, **renaming or reorganizing a folder changes the identifier**, which would ripple into every business record and any external reference (URLs already handle this via storage paths, but the *logical* id would move). An identifier that can change is not a good primary key for a CMS or database.

### Target state (Phase 5)

Introduce a media/`project` table where the identity is an explicit, immutable key, decoupled from the folder:

```
media/project table
  id           uuid   ← stable, immutable primary key (never changes)
  slug         text   ← URL/display slug (may change, unique)
  folder       text   ← current filesystem folder (may change, or disappear post-CMS)
  displayName  text   ← business copy
  …
```

Direction:

```
Current:                          Future (Phase 5):
  Filesystem folder                 Media table row
        │                             id (stable, immutable)
        ▼                             slug
  ProjectMediaId  ≡ folder            folder      (provenance / migration aid)
                                      displayName
                                        │
                                        ▼
                               ProjectMediaId ──► references `id`, not `folder`
```

`ProjectMediaId` should ultimately resolve to the **stable `id`**, not the folder name. The folder becomes mere provenance (how the asset entered the system), free to change without breaking references.

### Migration path (when Phase 5 lands)

1. Seed the `media`/`project` table from the current manifest + catalog (folder → row; mint a stable `id`; `slug`/`folder` from the folder name to start).
2. Change the business layer's `mediaId` to reference the stable `id`; keep a `folder` column for lookup/backfill.
3. Regenerate (or replace) the catalog so it keys by `id`, with `folder` retained for the scanner's benefit only.
4. From then on, folder renames touch only the `folder` column, never identifiers.

This is deliberately deferred: doing it now would add a database and an indirection with no present benefit, since there is no CMS and the filesystem is authoritative. The decision is recorded so the eventual CMS work moves in this direction rather than cementing the folder-as-id coupling.

---

## Related conventions already in place (support this direction)

- **Manifest `schemaVersion`** (Phase 1, added 2026-07-05) makes the manifest→table migration an explicit, versioned step: the seed script asserts the version it understands, so a format change forces a deliberate migration rather than a silent misread.
- **Generated-file convention** (Phase 2): `app/media/catalog.generated.ts` is build output, not source. In Phase 5 the catalog's *source* changes from the manifest to the database, but its consumers (the `projectMedia`/`workshopMedia` shape) need not — the generator is swapped, the contract holds.
- **Separation of business content and media** (Phase 2): `projects.ts` already references media only by identifier and holds no paths, so moving the identifier from folder-name to stable-id is a change to *what the id is*, not to *how the business layer references media*.

---

*This is a roadmap note only. No code, scanner, manifest structure, or business logic changes accompany it.*
