# Phased implementation plan

The roadmap is organised around decisions and evidence, not speculative dates.
Each phase ends with a concrete review point before more scope is added.

## Phase 0 — foundation

**Status:** current

### Deliverables

- repository and provenance audit;
- product vision and audience;
- independent positioning relative to the hackathon prototype;
- experience and visual principles;
- learning and debrief model;
- proposed content schema and architecture; and
- small vertical-slice definition.

### Exit criteria

- The product can be explained without calling it a quiz or generic branching
  story.
- Its difference from the hackathon interface is structural and documented.
- Original source material and attribution have not been overwritten.
- The first scenario and scope limits are agreed.

## Phase 1 — paper simulation

**Status:** paper specification drafted; manual play-test pending

Adapt **AI Companion for Social Anxiety** without application code.

### Deliverables

- player role, objective, authority, and constraints;
- stakeholder map;
- evidence inventory and chronology;
- two decision rounds with plausible interventions;
- minimal state and consequence rules;
- three outcome summaries;
- complete debrief; and
- a text walkthrough of every reachable route.

### Exit criteria

- Every intervention is defensible from at least one stakeholder perspective.
- No option reveals itself as the preferred answer through wording.
- Delayed or transferred harm appears in at least one route.
- The state model has no dead ends or unexplained consequences.
- The experience can be play-tested manually in 8–12 minutes.

## Phase 2 — engine and content contract

**Status:** complete for the vertical slice

Implement only the non-visual foundation required by the approved paper
simulation.

### Deliverables

- structured simulation schema;
- validation with clear authoring errors;
- deterministic state-transition engine;
- route and debrief reconstruction;
- exhaustive reachability tests for the vertical slice; and
- a migration path that leaves the original corpus untouched.

### Exit criteria

- Every paper route is reproduced deterministically.
- Invalid content fails with actionable errors.
- Engine tests run without a browser or network.
- A second scenario can use the contract without changing core engine logic.

### Implemented evidence

- Typed, runtime-validated simulation content and provenance metadata
- Structural and semantic validation with actionable errors
- Framework-independent immutable state transitions
- Deterministic route and debrief reconstruction
- Exhaustive coverage of all nine vertical-slice routes
- TypeScript compiler check and 18 passing automated tests

## Phase 3 — playable vertical slice

**Status:** complete and privately deployed for review

Build the smallest professional interface around the proven simulation.

### Deliverables

- incident brief;
- evidence workspace;
- stakeholder and event presentation;
- intervention flow;
- consequence timeline;
- debrief and replay comparison;
- local save and restart;
- responsive, keyboard-accessible experience; and
- static deployment preview.

### Exit criteria

- A player can complete the experience without author assistance.
- Core flow works on mobile, desktop, and by keyboard.
- The interface follows the visual direction rather than resembling the
  hackathon prototype or a generic dashboard.
- Automated tests cover the main journey and state transitions.
- No backend, login, tracking, or external AI service is required.

### Implemented evidence

- Complete two-round evidence and intervention experience
- Engine-backed route consequences and transparent post-incident debrief
- Qualitative consequence profile rather than an ethics score
- Local resume, restart, and replay with versioned save data
- Keyboard focus handoff, skip navigation, semantic status, reduced-motion
  support, responsive layouts, and content notes
- Branded social-preview card and project attribution
- Successful production build, lint, engine type-check, and all 18 engine tests
- Private production deployment for owner review

## Phase 4 — small evaluation and revision

### Deliverables

- a short, prewritten play-test protocol;
- several moderated sessions with consent and minimal data collection;
- findings grouped by comprehension, agency, pacing, emotional engagement,
  accessibility, and debrief value; and
- a documented decision for each material finding.

### Exit criteria

- Players recognise the central harm before the debrief names it.
- Choices feel meaningfully different rather than correct/incorrect.
- The debrief adds understanding instead of repeating the outcome.
- Remaining usability or learning failures are understood well enough to fix.

## Phase 5 — representative collection

Only after evaluating the vertical slice, adapt two contrasting scenarios:

- **Resume Screening Bias in a Tech Company** for institutional harm; and
- **Fabricated Crisis Announcement** for societal harm.

Three simulations demonstrate personal, institutional, and societal scales
while testing whether the content model genuinely generalises.

### Exit criteria

- New simulations require content and presentation work but no fundamental
  engine redesign.
- Shared components remain accessible across different evidence formats.
- Each scenario feels distinct while retaining Hikayat's interaction grammar.

## Later decisions—not commitments

After three evaluated simulations, decide whether the strongest next step is:

- a six-scenario public collection, one per original theme;
- a facilitated classroom mode;
- a formal educational study;
- adaptation of the remaining corpus; or
- a focused portfolio release with the three strongest simulations.

Do not commit to all 18 playable adaptations until there is evidence that
breadth adds more value than deeper research, writing, and evaluation.
