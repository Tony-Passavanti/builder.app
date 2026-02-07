# AGENTS

Purpose: Project-specific instructions for Codex when working in this repo.

## Overview
- Stack: React + TypeScript + Vite
- Package manager: npm (use npm, not yarn/pnpm)
- Module type: ESM ("type": "module")

## Key Commands
- Install: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`
- Preview: `npm run preview`

## Project Layout
- `src/`: app source
- `public/`: static assets
- `index.html`: Vite entry

## Workflow Expectations
- Prefer minimal, focused edits.
- Run `npm run lint` after non-trivial changes when time permits.
- There are no tests configured yet; don’t invent a test runner.
- Ask before running long or environment-altering commands.
- When implementing a feature from `Features/`, follow the Feature Implementation checklist below.
- If any of the feature implementation steps cannot be completed, revert any changes made and tell me which step failed and what errors were encountered.

## Feature Implementation
1. Create a new branch named `{featureName}` and make sure all edits are completed in that branch.
2. Create a new folder in `CompletedFeatures` named `{featureName}` (feature name = markdown filename without extension).
3. Create a `ToDo.md` file in `CompletedFeatures/{featureName}` with the steps required to fully implement the feature; keep it updated as steps are completed or modified.
4. Ensure all use cases and acceptance criteria are satisfied.
5. Run npm run build and npm run dev to ensure the application builds and ca run
6. Write unit tests to keep overall code coverage at or above 75%.
7. Run all unit tests and iterate until all pass; tests must validate the feature implementation, not work around bugs or errors.
8. Create `{featureName}-README.md` in `CompletedFeatures/{featureName}` documenting changes and usage.
9. Create `{featureName}-ToDo.md` in `CompletedFeatures/{featureName}` documenting any open items and recommended next steps.
10. Move the implemented `{featureName}.md` file into `CompletedFeatures/{featureName}`.

## Coding Conventions
- TypeScript + React (function components).
- Keep components small and composable.
- Avoid unnecessary dependencies.
