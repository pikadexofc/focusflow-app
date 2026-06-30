# Contributing to FocusFlow

Thank you for contributing to FocusFlow! Follow these guidelines to ensure smooth reviews.

## Engineering Workflow
1. **Local-First Core**: Never introduce changes that transmit user data to external servers or tracking pipelines. All data must reside securely in local storage.
2. **GPU Performance Compliance**: All animations must rely exclusively on `transform` and `opacity` to maintain 60 FPS. Never introduce layout-triggering styles (e.g. animating `width` or `height`) or performance-heavy paint effects like glows.
3. **Accessibility**: All buttons and interactive regions must adhere to high-density click/tap target boundaries (minimum 44x44px or 48x48px).

## Code Style & Formatting
- Code formatting follows the established ESLint/TypeScript configurations.
- Commit messages should follow conventional formatting (e.g. `feat: ...`, `fix: ...`, `perf: ...`, `chore: ...`).

## Submitting Pull Requests
- Fill out the provided pull request template in full.
- Verify that both `npx tsc --noEmit` and `npm run build` pass cleanly.
