# Prototype Instructions

## User design decisions
- The app name is **MiYard**, with this exact capitalisation (user correction). Preserve the existing database identity and accept previous backup formats so the rename does not lose data.
- Build the third selected mock, Architectural Ledger: full-width charcoal top navigation, horizontal document categories, grouped register on the left and selected-record inspector on the right.
- Replace its cream/gold palette and fonts with white surfaces, charcoal navigation, a restrained teal accent, and Inter. Avoid both cutesy journal styling and a generic grey enterprise database.
- Include tradespeople, house projects and plans, insurance, important documents, rooms and maintenance.
- Keep sample data clearly identified. Current implementation is a local browser app; never imply cloud backup or multi-user synchronization.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
