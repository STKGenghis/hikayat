# Hikayat: Scenario Analysis

A small, honest evaluation of two off-the-shelf NLP methods against 18
hand-authored AI-safety scenarios — asking a real question rather than
running a demo: **given six categories that overlap on purpose, how well
does a general-purpose method recover the author's own categorisation from
narrative text alone, and where exactly does it fail, and why?**

**Headline finding:** the word-vector similarity classifier didn't fail
scenario-by-scenario — it collapsed onto a single predicted category for
17 of 18 scenarios, a known failure mode of mean-pooled static embeddings
("hubness"). See [`results/error_analysis.md`](results/error_analysis.md)
for the full diagnosis, not just the number.

## Origin

**Hikayat** — the name and the underlying idea, using storytelling to make
AI-safety risks concrete and discussable rather than abstract — is mine. I
first built it out as a set of narrative scenarios for a Dubai hackathon,
where a teammate (Chaitanya Mittal) built the React interface that
presented them (see [`hikayat-dunetech`](https://github.com/STKGenghis/hikayat-dunetech),
GPL v3, his implementation credited there). This repository is a new,
independent piece of work: my own scenario content, analysed with my own
code, written from scratch. It doesn't reuse any of that implementation,
so there's no license inheritance question — but the intellectual lineage
is worth stating plainly rather than pretending this idea started here.

## What's actually being tested

1. **Topic classification** via spaCy word-vector similarity
   (`en_core_web_md`) — cosine similarity between each scenario narrative's
   averaged vector and each of the 6 section-title labels'.
2. **Tone-shift check** via VADER sentiment — does the sentiment score
   reliably drop between a scenario's narrative and its written negative
   consequence, the way a human reader would expect?

**Why not HuggingFace transformers, given that's current practice for
both tasks?** huggingface.co was unreachable from the environment this was
built in (confirmed by testing the main endpoint and known mirrors — all
blocked, while PyPI and GitHub release assets were reachable). Rather than
stall on that, I used two methods that don't need it and are still
legitimate "off-the-shelf, not fine-tuned" baselines — and documented
exactly what to swap in for the stronger transformer version once this
runs somewhere with open access. See the module docstring and inline
comments in `src/analyze.py` (`classify_zero_shot_like` and
`score_emotion_shift`) for the literal replacement code.

## Repo structure

```
data/
  scenarios_source.md   the original scenario markdown (my authored content)
  scenarios.json         parsed structured output (generated)
src/
  parse_scenarios.py     markdown -> structured JSON
  analyze.py              runs both evaluations, writes results/
tests/
  test_parser.py          7 tests against the parser
results/
  topic_predictions.csv
  tone_predictions.csv
  confusion_matrix.png
  error_analysis.md       the actual critical-evaluation writeup — read this
```

## Running it

```bash
pip install -r requirements.txt
python -m spacy download en_core_web_md
python src/parse_scenarios.py   # data/scenarios_source.md -> data/scenarios.json
python -m pytest tests/ -v      # or: python tests/test_parser.py
python src/analyze.py           # writes results/
```

## Limitations — read this before trusting any number in results/

- **n=18 across 6 classes is not enough to estimate a real error rate.**
  Three examples per class; any accuracy figure here describes this small,
  specific set, not general performance.
- **The candidate labels ARE the categories the scenarios were written to
  illustrate.** Even so, the classifier still collapsed onto one label —
  which says more about the weakness of averaged word vectors on
  topically-overlapping text than it does about the categories themselves.
- **Single author, single register, English only.** All 18 scenarios were
  written by me, in a consistent style, over a short period, for a
  specific hackathon brief.
- **Static word vectors, not contextual embeddings.** This is the whole
  point of the exercise — mean-pooling GloVe-style vectors is a genuinely
  weak method, chosen because it was reachable, not because it's the right
  tool for the job. The results/error_analysis.md diagnosis (the hubness
  problem) is the actual finding; the raw accuracy number is not.
- **VADER is a general-purpose, social-media-tuned lexicon scorer.** It has
  no domain knowledge of AI-safety vocabulary and visibly misses shifts a
  human reader would feel — see the tone-shift section of the error
  analysis for specific cases.
- **Neither method was fine-tuned on anything.** This evaluates
  off-the-shelf behaviour on a narrow, small, idiosyncratic text domain —
  the point is showing how I evaluate a method's fit for a task and
  diagnose why it fails, not to produce a strong result.

## Why this shape of project

The differentiator this portfolio is built around isn't "I can run an NLP
pipeline" — plenty of people can. It's the instinct from my 2009 MSc
dissertation, where I was the one who pushed back on my own 100%
classification result and went looking for why it was too good to be true.
The same instinct applies here: when this pipeline first ran, it looked
like a below-chance-adjacent failure. Looking closer showed it wasn't 18
independent mistakes — it was one systematic collapse, with a specific,
checkable explanation. That's the differentiator, not the headline number.
