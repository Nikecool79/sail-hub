# Contributing to Sail Hub

Thanks for your interest in contributing. This is a practical open-source project built for real sailing clubs — contributions that make it more useful, more robust, or easier to deploy are very welcome.

## Getting Started

```sh
git clone https://github.com/Nikecool79/optisail-hub.git
cd optisail-hub
npm install
cp .env.example .env
npm run dev
```

The app runs on `http://localhost:8080` using built-in sample data. You don't need a real Google Sheet to work on most features.

## What We're Looking For

- Bug fixes
- New languages (add a translation file in `src/i18n/`)
- Improved mobile layout
- New pages that fit the sailing club use case
- Performance improvements
- Accessibility improvements
- Better sample data

## What to Avoid

- Breaking changes to the Google Sheet column structure without a migration path
- Large refactors that don't fix a specific problem
- Adding dependencies without a clear reason
- UI changes that break the nautical theme

## Code Conventions

- **No renames** of existing functions/variables without a clear reason
- **Settings-driven** — if a value could vary per club, read it from `getSetting()` in `clubConfig.ts`
- **Bilingual** — all content fields need `SV` and `EN` variants; use `useLocalizedField()` to render them
- **Team filtering** — pages should respect `useThemeStore(s => s.team)` where relevant
- **TypeScript** — strict mode is off; keep it that way
- **Translations** — add keys to both `src/i18n/sv.json` and `src/i18n/en.json`

## Project Structure

```
src/
  config/       Club config and settings helpers
  hooks/        Custom React hooks (useWeather, useRibBooking, useCoachTime…)
  i18n/         Translation files (sv.json, en.json)
  pages/        One file per route
  components/   Shared components (layout/, ui/, map/)
  services/     External API clients (googleSheets.ts)
  store/        Zustand stores (dataStore, useThemeStore)
  types/        TypeScript interfaces (index.ts)
  utils/        Parsers and utilities (parseSheet.ts, sponsorUtils.ts…)
```

## Pull Requests

1. Fork the repo and create a branch from `main`
2. Keep changes focused — one feature or fix per PR
3. Test with both sample data and (if possible) a real Google Sheet
4. Check both Swedish and English translations work
5. Run `npm run build` before submitting — it must build cleanly

## Reporting Bugs

Use the [GitHub issue tracker](https://github.com/Nikecool79/optisail-hub/issues). Include:
- What you expected vs. what happened
- Steps to reproduce
- Browser and OS
- Whether you're using sample data or a real Sheet

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
