# Hikayat

Hikayat is an independent, research-led interactive learning experience that
places people inside unfolding AI incidents. Players interpret incomplete
evidence, weigh competing responsibilities, and intervene before the full
consequences are visible.

The project asks a practical question: **can interactive storytelling help
people recognise how ordinary incentives, incomplete information, and
apparently reasonable decisions produce AI harm?**

**[Play The Quiet Invitation](https://hikayat-ai-safety.saima-tariqkhanphd.chatgpt.site)**
— the first complete, publicly available incident simulation.

## Current status

Hikayat is in vertical-slice development. The repository currently
contains:

- an original corpus of 18 AI-safety scenarios across six harm themes;
- a tested Markdown-to-JSON content pipeline;
- an exploratory NLP evaluation of the corpus; and
- the product, learning, design, and architecture foundation for the
  independent rebuild; and
- a validated, deterministic TypeScript simulation engine with the first paper
  simulation encoded as declarative content.

The first professional playable vertical slice is implemented and publicly
deployed. It demonstrates the complete evidence, intervention, consequence,
debrief, resume, and replay loop before more scenarios are adapted.

## The experience

Hikayat is conceived as a set of compact **AI incident simulations**, rather
than a quiz or branching visual novel. Each simulation follows the same core
loop:

1. **Observe** an evolving incident through messages, reports, model outputs,
   policies, and other evidence.
2. **Interpret** incomplete or conflicting signals from several stakeholders.
3. **Intervene** using a limited set of plausible actions under constraints.
4. **Witness** immediate and delayed consequences across the system.
5. **Reflect** through a transparent post-incident debrief.

There is no single ethics score. Decisions create, reduce, transfer, or leave
risks unresolved across dimensions such as human welfare, agency, fairness,
trust, resilience, and concentration of power.

Read the [product vision](docs/product-vision.md), [experience and design
principles](docs/design-principles.md), and [learning model](docs/learning-model.md).

## Scenario corpus

The 18 scenarios comprise three scenarios in each of six themes:

1. Emotional over-dependence on misaligned AI
2. Breach of privacy, fraud, and deepfakes
3. Systemic bias baked into AI
4. Existential threat
5. Authoritarian surveillance and autonomous weapons
6. Misinformation and propaganda

The source material is preserved in
[`data/scenarios_source.md`](data/scenarios_source.md). It currently provides
the narrative foundation, decision points, positive and negative consequences,
multiple-choice questions, scenario questions, and reflection prompts for each
scenario. The rebuild will adapt this material without overwriting the original
source.

## Independent rebuild and attribution

Hikayat—the name and the concept of using interactive storytelling to make
AI-safety risks concrete—was originated by **Saima Tariq Khan**, who also wrote
the original 18 scenarios.

This repository contains Saima's independent product design and implementation.
It is separate from the React interface created for the Dubai hackathon
prototype. That prototype, its GPLv3-licensed source, and its original
implementation credits remain preserved in
[`STKGenghis/hikayat-dunetech`](https://github.com/STKGenghis/hikayat-dunetech).
No code or visual assets from that implementation will be reused here.

The full provenance statement is preserved in
[`PROJECT_HISTORY.md`](PROJECT_HISTORY.md).

## Documentation

- [`docs/product-vision.md`](docs/product-vision.md) — purpose, audience,
  positioning, and scope
- [`docs/design-principles.md`](docs/design-principles.md) — interaction and
  visual direction
- [`docs/learning-model.md`](docs/learning-model.md) — educational mechanism
  and debrief approach
- [`docs/content-model.md`](docs/content-model.md) — scenario schema and
  authoring rules
- [`docs/architecture.md`](docs/architecture.md) — proposed system boundaries
  and engineering decisions
- [`docs/roadmap.md`](docs/roadmap.md) — phased delivery and success criteria
- [`docs/simulations/ai-companion-paper-simulation.md`](docs/simulations/ai-companion-paper-simulation.md)
  — first complete paper simulation
- [`game-engine/README.md`](game-engine/README.md) — validated content contract,
  deterministic engine, and test commands
- [`web/`](web/) — accessible Sites interface and self-contained deployment
  source

## Existing research baseline

The current Python pipeline parses the original Markdown into structured JSON
and evaluates two weak, off-the-shelf NLP baselines: static word-vector topic
similarity and VADER sentiment shift. Its most useful finding is diagnostic:
the topic classifier collapsed onto one category for all 18 scenarios,
illustrating the limitations of mean-pooled static embeddings on a small,
topically overlapping corpus.

The full analysis is in
[`results/error_analysis.md`](results/error_analysis.md). This work will remain
as research provenance; it is not the architecture of the interactive product.

### Run the existing research pipeline

```bash
pip install -r requirements.txt
python -m spacy download en_core_web_md
python src/parse_scenarios.py
python -m pytest tests/ -v
python src/analyze.py
```

## Project principles

- Preserve authorship and project history explicitly.
- Let the player encounter a harm before naming or explaining it.
- Present defensible trade-offs, not disguised right-answer questions.
- Keep authored scenarios deterministic and reviewable.
- Build one convincing simulation before scaling the corpus.
- Treat accessibility, privacy, and evidence-based evaluation as core quality.

## License

A license has not yet been selected for this independent rebuild. Until one is
added, no permission to copy, modify, or redistribute this repository should be
assumed.
