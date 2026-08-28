# Product vision

## Purpose

AI harms are often taught as definitions, principles, or dramatic endpoints.
That can explain what a harm is without showing how people arrive there.
Hikayat exposes the quieter path: weak signals, divided responsibility,
institutional pressure, and choices that appear locally reasonable.

Hikayat's purpose is to help people practise recognising and responding to AI
harm before the outcome becomes obvious.

## Product proposition

> Hikayat places you inside an unfolding AI incident. You must decide what the
> evidence means, who is at risk, and when to intervene—before the consequences
> are fully visible.

Each short, authored simulation gives the player a role with limited authority,
incomplete evidence, and competing responsibilities. The player investigates
and intervenes; the simulation reveals direct and second-order consequences
before a structured debrief.

## Primary audiences

The first release is designed for:

- university students studying AI, data, policy, ethics, or responsible
  innovation;
- early-career technology practitioners who influence product or deployment
  decisions; and
- educators or facilitators seeking a compact discussion exercise.

The experience should remain intelligible to an interested general audience.
It must not require programming knowledge or prior familiarity with formal AI
safety terminology.

## Intended outcomes

After a simulation, a player should be better able to:

1. notice weak or ambiguous evidence of emerging harm;
2. identify affected stakeholders, including those absent from the immediate
   decision;
3. distinguish a system's stated objective from its incentives and effects;
4. compare preventive, corrective, and compensatory interventions;
5. recognise when a safeguard transfers risk rather than eliminating it; and
6. explain a decision without relying on hindsight.

Hikayat does not aim to certify ethical competence or produce a universal
measure of a player's values.

## Experience boundaries

Hikayat is:

- an authored, replayable AI-harm simulation;
- a bridge between narrative understanding and systems thinking;
- suitable for individual play and facilitated discussion; and
- explicit about uncertainty and value conflict.

Hikayat is not:

- a catalogue of scenario pages followed by quizzes;
- a morality test with one hidden correct path;
- an open-ended generative chatbot;
- a prediction of real-world outcomes; or
- a replacement for domain-specific professional training.

## Independent direction

The Dubai hackathon prototype presented the original scenarios through a React
interface. The independent rebuild changes the product model, not merely its
appearance. It centres evidence inspection, constrained intervention, evolving
system state, delayed consequences, and post-incident reasoning.

The historical implementation remains separately credited and preserved. The
rebuild will not copy its code, assets, component structure, or visual design.

## Initial scope

The first playable release will contain one simulation: **AI Companion for
Social Anxiety**. It has immediate human stakes, legible trade-offs between
comfort and autonomy, and evidence that can be represented through a compact
product-safety incident workspace.

The experience should take approximately 8–12 minutes and require no account,
server, or external AI service. It should prove the interaction and learning
model before more scenarios are adapted.

## Vertical-slice success criteria

The first simulation succeeds when a small test group can:

- describe the emerging harm before the debrief names it;
- articulate at least two stakeholder perspectives;
- explain a trade-off in their chosen intervention;
- discover a materially different consequence on replay;
- complete the experience without guidance from the author; and
- distinguish Hikayat from a quiz, scenario reader, or conventional visual
  novel.
