# TDA Localization

TDA uses Puerto Rico Spanish (`es-PR`) as its default interface locale.

Reusable translation resources are stored in this package. Application-specific
localization configuration belongs inside the application consuming these
resources.

## Adding Interface Text

1. Do not hard-code user-facing text in application components.
2. Add new translations to `src/locales/es-PR.ts`.
3. Use descriptive semantic keys, such as `actions.save`.
4. Reuse an existing key when its meaning is identical.
5. Use `{{variable}}` for interpolation.
6. Use `_one` and `_other` suffixes for plural forms.
7. Add essential interface keys to `requiredTranslationKeys`.
8. Compare terminology with
   `documentation/product/spanish_terminology.md` from the documentation branch.
9. Preserve the approved capitalization and spelling.
10. Add or update tests for important terminology.

## Validation

Run:

```bash
pnpm --filter @tda/localization build
pnpm --filter @tda/mobile typecheck
pnpm --filter @tda/mobile lint
pnpm --filter @tda/mobile test
```
