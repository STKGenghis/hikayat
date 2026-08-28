# Content model

## Source preservation

`data/scenarios_source.md` is the canonical record of the original 18 authored
scenarios. It should remain unchanged during adaptation. Playable simulations
will be stored separately so editorial development never overwrites or silently
rewrites the source corpus.

The generated `data/scenarios.json` is an analysis format, not a game format.
It retains narrative, decision points, consequences, and assessment counts, but
not the actual MCQs, open questions, answers, or reflection prompts.

## Stable identifiers

Scenario numbers restart within each theme. The simulation layer must therefore
introduce stable descriptive IDs, for example:

- `emotional-dependence/ai-companion-social-anxiety`
- `systemic-bias/resume-screening`
- `misinformation/fabricated-crisis`

Original section and scenario numbers remain as provenance metadata, not keys.

Every adaptation should record:

- its original source identifier;
- adaptation version;
- author and reviewers;
- date of last substantive review; and
- external sources used for new factual claims.

## Proposed simulation structure

The exact implementation format will be selected during the vertical slice,
but the conceptual schema is:

```text
Simulation
├── identity and provenance
├── content notes and accessibility metadata
├── player role, remit, and constraints
├── learning question and concepts
├── initial state
├── stakeholders
├── evidence items
├── decision rounds
│   ├── available evidence
│   ├── interventions
│   └── transition rules
├── consequence events
├── outcome summaries
└── debrief
    ├── route explanation
    ├── consequence interpretation
    ├── counterfactuals
    ├── concepts
    └── reflection prompts
```

## Entities

### Evidence item

An evidence item has a source, sequence position, format, content, reliability
cues, accessibility label, and conditions under which it becomes available.
Evidence must never rely on visual styling alone to communicate credibility.

### Stakeholder

A stakeholder has a role, interests, exposure to harm, power over the system,
and a voice represented through evidence or consequence. Stakeholders should
not be reduced to a single moral position.

### Intervention

An intervention includes:

- player-facing action and rationale;
- prerequisites and operational cost;
- immediate state changes;
- delayed or conditional effects;
- stakeholder responses; and
- debrief explanation.

Actions should span several layers where appropriate: model behaviour, product
design, human support, organisational process, governance, communication, and
remedy.

### State

State consists of small, named variables with bounded values. It should model
only distinctions required by the authored experience, not a general-purpose
moral simulation.

State variables may influence evidence availability, stakeholder response,
available interventions, consequence events, and the final profile.

### Consequence

A consequence is a narrative event with an explicit authored cause. It may
affect welfare, agency, fairness, trust, resilience, or power, but any numeric
representation remains an implementation detail used to select and explain
events rather than score the player.

## Vertical-slice constraints

To control scope, the first simulation should contain:

- one player role;
- three to five stakeholders;
- six to nine evidence items;
- two decision rounds;
- three or four interventions per round;
- no more than six state variables;
- four to six consequence events; and
- three outcome summaries assembled from state rather than a large branching
  tree.

This “state with authored events” model avoids exponential branching while
preserving meaningful feedback and replay.

## Validation requirements

Before content is playable, automated validation should confirm:

- unique stable IDs;
- valid references between decisions, evidence, events, and state variables;
- at least one reachable outcome;
- no unreachable required evidence;
- complete provenance and content-note metadata;
- complete accessibility labels for non-text evidence; and
- debrief coverage for every intervention and consequence rule.

The engine should reject invalid scenario data clearly during development
rather than fail silently during play.
