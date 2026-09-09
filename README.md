# D&D 2024 Player Companion

A mobile-first web app that helps a D&D player — especially a newer one — understand what their character can actually do, right now on their turn and when they level up. It's a player companion, not a character-sheet replacement: the value is in **deriving** answers from rules + character state, not in data entry.

## What it does

- **Play Mode** — the default screen. Shows your currently-legal Action / Bonus Action / Reaction / Movement options during a real combat turn, combining general D&D actions with your specific class features and spells.
- **Level Up** — a guided workflow that separates automatic gains from choices you must make, and won't let you finish leveling with an unresolved mandatory choice.
- **"Why can I do this?"** — every option can show its source feature in one sentence, so the app teaches rules as you play rather than just gating access to them.

## Content coverage (PHB 2024 only)

- All 12 core classes and their 48 subclasses
- All 16 backgrounds and all 10 species (including sub-choice lineages: Draconic Ancestry, Elven Lineage, Gnomish Lineage, Giant Ancestry, Fiendish Legacy)
- All 10 Origin feats and all 42 General feats
- A "How this class plays" guidance panel (flavor/pedagogy, kept strictly separate from mechanics)
- Exhaustion tracking

Ravenloft and Heroes of Faerûn are modeled in the architecture (source registry, `SourceRef`, per-source filtering) but have zero content — both source PDFs are scanned images with no extractable text layer. They'll be added once a text-readable version of each is available.

## Tech stack

React + TypeScript + Vite, React Router, Tailwind CSS, Vitest. No backend — characters are stored in `localStorage` via a swappable storage interface.

## Architecture

```
Rules Data (src/data/)       — pure content, per source, no logic
        ↓
Rule Engine (src/engine/)    — pure functions: (CharacterState, RulesData) → derived options
        ↓
Domain Hooks (src/app/)      — React context wrapping engine calls + storage
        ↓
Screens/Components           — render derived state, contain no rules logic
        ↓
Storage (src/storage/)       — localStorage today, swappable interface for a future DB
```

Every rules record carries a `SourceRef` (source id, page, `needsVerification`), and the rule engine is fully generic across classes — no class-name branching. See the code comments in `src/domain/types/` and `src/engine/` for the reasoning behind specific design choices.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run test      # run the engine/data test suite
npm run lint      # oxlint
npm run build     # typecheck + production build
```

## Status

All originally-scoped phases (foundation, rule engine, all 12 classes, backgrounds/species/feats, class guidance, QA & mobile pass) are complete. See `npm run test` for the current test count.
