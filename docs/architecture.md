# Proposed architecture

## Goals

The first implementation should be small, deterministic, inspectable, and easy
to publish. It must keep authored content separate from presentation and make
route-to-consequence logic testable without a browser.

It should support one excellent simulation first and additional scenarios later
without introducing a backend prematurely.

## System boundaries

```text
Original scenario corpus (preserved)
               │
               ▼
Authored simulation data ──► schema validation
               │                    │
               ▼                    ▼
       deterministic engine ◄── automated tests
               │
               ▼
        accessible web interface
               │
               ▼
     local progress and route record
```

### Content layer

Playable simulations live as version-controlled structured data. Content
contains narrative and declarative state transitions, never executable code.
The original Markdown remains a separate provenance source.

### Domain engine

A framework-independent engine accepts current simulation state and a player
action, validates the action, applies declared effects, releases new evidence or
consequence events, and returns the next state.

The engine owns:

- progression through phases and decision rounds;
- evidence visibility;
- action availability and prerequisites;
- state transitions;
- deterministic event selection; and
- route records used by the debrief.

It does not own rendering, network access, analytics, or prose generation.

### Interface layer

The web interface renders the incident brief, evidence workspace, stakeholder
communications, action panel, event timeline, and debrief. Components consume
engine state and dispatch declared player actions.

### Persistence

The vertical slice needs only local browser persistence for progress,
accessibility preferences, and completed routes. Reflection text should remain
in memory unless the player explicitly chooses to export it.

Save data must include a simulation content version so incompatible progress
can be detected and explained.

## Recommended implementation approach

The Phase 2 engine uses:

- TypeScript 7.0.2 for shared content and engine contracts;
- Zod 4.4.3 for structural runtime validation;
- explicit semantic validation for references, route reachability, and debrief
  coverage; and
- Vitest 4.1.11 for content, transition, and exhaustive route tests.

The Phase 3 interface should use a lightweight component-based web application,
browser tests for the complete player journey, and static hosting with no server
requirement.

The implemented interface is a self-contained Vinext/React Sites application in
`web/`. It embeds a deployment copy of the validated engine contract so the Site
can build independently while the repository-level `game-engine/` remains the
canonical tested engine during development. Changes to engine behaviour must be
made canonically first, tested, and then synchronised into the deployment copy.

The precise framework should be chosen after checking the current stable
ecosystem and deployment target. Framework choice is less important than the
content/engine/interface separation.

## Deliberate exclusions from the first release

- authentication and user accounts;
- database or cloud save;
- generative AI or free-form generated narrative;
- multiplayer or facilitator dashboards;
- learning-management-system integration;
- behavioural analytics or third-party tracking;
- procedural authoring tools;
- elaborate animation, audio, or 3D environments; and
- adaptation of all 18 scenarios.

These are not requirements until observed use justifies them.

## Determinism and explainability

Given the subject matter, the experience should model the transparency it asks
of AI systems. A saved route must be reproducible from the simulation version
and ordered player actions, plus an explicit seed if randomness is ever added.

The vertical slice should contain no randomness. Every debrief claim should be
traceable to an authored rule or event.

## Privacy and security posture

- Collect no personal data in the vertical slice.
- Make no external requests during play except static asset delivery.
- Avoid third-party analytics by default.
- Treat future imported or community-authored data as untrusted.
- Never execute script or markup embedded in content.
- Use a restrictive content security policy when deployed.

## Testing strategy

### Content tests

Validate schema, references, identifiers, provenance, required debriefs, and
accessibility metadata.

### Engine tests

Test action eligibility, transition effects, released evidence, consequences,
save/restore, and route reconstruction. Enumerate the small vertical-slice state
space to detect dead ends and unreachable outcomes.

### Interface tests

Test keyboard-only completion, focus management, semantic announcements,
responsive layout, save/restore, restart, and one complete route.

### Human evaluation

Use short moderated sessions to test comprehension, perceived agency,
trade-off quality, and whether the debrief changes interpretation. This is
product evaluation, not evidence of educational efficacy.
