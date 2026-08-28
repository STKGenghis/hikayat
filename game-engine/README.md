# Hikayat game engine

This package contains Hikayat's framework-independent simulation contract and
deterministic state-transition engine. It intentionally has no interface,
network access, analytics, or generated narrative.

## Responsibilities

- validate simulation structure and cross-references;
- reject missing debrief coverage and unreachable route assignments;
- release evidence and actions by decision round;
- apply bounded, deterministic state changes;
- record influential evidence, actions, and consequence events;
- reconstruct completed routes; and
- produce the data required for a transparent debrief.

The first encoded simulation is **The Quiet Invitation**, adapted from the
original “AI Companion for Social Anxiety” scenario. Its paper specification is
in `../docs/simulations/ai-companion-paper-simulation.md`.

## Commands

Run from this directory with pnpm:

```bash
pnpm install
pnpm run check
pnpm run test
```

The test suite validates content errors, immutability, determinism, evidence
release, action constraints, debrief traceability, and all nine reachable
routes.

## Structure

```text
src/
  schema.ts                         structural and semantic content validation
  engine.ts                         deterministic state transitions
  simulations/ai-companion.ts       declarative vertical-slice content
tests/
  engine.test.ts                    content, engine, and exhaustive route tests
```

## Boundary with the original corpus

This package does not parse or modify the original scenario source. The source
remains preserved at `../data/scenarios_source.md`; the encoded simulation
records its source and original author as provenance metadata.
