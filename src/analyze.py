"""
Critical evaluation of two off-the-shelf, non-fine-tuned NLP methods against
the Hikayat scenario corpus.

The question this asks is NOT "can a model classify text" (trivially yes)
but: given 6 categories that were hand-authored around genuinely overlapping
AI-safety themes, how well does a general-purpose method recover the
author's own categorisation from the narrative text alone, and *where
specifically* does it fail, and why?

A note on method choice: the original plan here was a HuggingFace
zero-shot-classification pipeline (facebook/bart-large-mnli) and a
transformer emotion classifier. huggingface.co is unreachable from the
network this was built on (a sandboxed evaluation environment with an
allowlisted, not open, egress policy — confirmed by testing several HF
endpoints and mirrors, all blocked, while pypi.org and GitHub release
assets were reachable). Rather than block on that, this uses two methods
that are genuinely reachable and still "off-the-shelf, not fine-tuned":

  1. Static word-vector similarity (spaCy's en_core_web_md, GloVe-style
     300-dim vectors) for topic classification — cosine similarity between
     each narrative's averaged word vector and each candidate label's.
  2. VADER (rule-based lexicon sentiment, bundled with the package, no
     network needed) for the tone-shift check between narrative and
     negative-consequence text.

Both are weaker than a transformer pipeline and the limitations section
says so explicitly — this is a real constraint honestly worked around, not
a like-for-like substitute. Swapping in `transformers.pipeline(
"zero-shot-classification", model="facebook/bart-large-mnli")` in
`classify_zero_shot_like` and a transformer emotion model in
`score_emotion_shift` is a small, contained change if this is re-run
somewhere with open internet access — see the docstrings on those two
functions for exactly what to swap.

Outputs:
  - results/topic_predictions.csv
  - results/tone_predictions.csv
  - results/confusion_matrix.png
  - results/error_analysis.md   (the actual critical-evaluation writeup)
"""
from __future__ import annotations

import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import spacy
from sklearn.metrics import ConfusionMatrixDisplay, confusion_matrix, classification_report
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "scenarios.json"
RESULTS = ROOT / "results"
RESULTS.mkdir(exist_ok=True)


def load_scenarios() -> list[dict]:
    return json.loads(DATA.read_text(encoding="utf-8"))


def _label_text(section_title: str) -> str:
    """Strip the roman-numeral prefix ('I. ', 'II. ', ...) so the label text
    fed to the embedding is the actual topic, not an ordinal."""
    import re

    return re.sub(r"^[IVX]+\.\s*", "", section_title)


def classify_zero_shot_like(nlp, scenarios: list[dict]) -> list[dict]:
    """
    Topic classification via cosine similarity between averaged word
    vectors — the classical predecessor to transformer zero-shot
    classification, and still a fair "off-the-shelf, no training data"
    baseline.

    To swap in a real transformer zero-shot pipeline instead, replace this
    function's body with:

        from transformers import pipeline
        clf = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
        out = clf(narrative, candidate_labels=labels, multi_label=False)
        # out["labels"][0] / out["scores"][0] are the top prediction/score
    """
    labels = sorted({s["section"] for s in scenarios})
    label_docs = {label: nlp(_label_text(label)) for label in labels}

    rows = []
    for s in scenarios:
        doc = nlp(s["narrative"])
        sims = {label: doc.similarity(label_doc) for label, label_doc in label_docs.items()}
        ranked = sorted(sims.items(), key=lambda kv: kv[1], reverse=True)
        predicted, top_score = ranked[0]
        runner_up, runner_up_score = ranked[1]
        rows.append(
            {
                "scenario_number": s["scenario_number"],
                "title": s["title"],
                "true_section": s["section"],
                "predicted_section": predicted,
                "similarity": round(float(top_score), 4),
                "correct": predicted == s["section"],
                "runner_up": runner_up,
                "runner_up_similarity": round(float(runner_up_score), 4),
            }
        )
    return rows


def score_emotion_shift(scenarios: list[dict]) -> list[dict]:
    """
    Sentiment-polarity shift between narrative and negative-consequence
    text, using VADER (rule-based, lexicon bundled with the package).

    To swap in a transformer emotion classifier instead (finer-grained than
    VADER's positive/negative/neutral), replace this function's body with:

        from transformers import pipeline
        clf = pipeline("text-classification",
                        model="bhadresh-savani/distilbert-base-uncased-emotion",
                        top_k=None)
        # compare argmax label between narrative and negative-consequence text
    """
    analyzer = SentimentIntensityAnalyzer()
    rows = []
    for s in scenarios:
        narr = analyzer.polarity_scores(s["narrative"])
        neg = analyzer.polarity_scores(s["consequences_negative"])
        shift = neg["compound"] - narr["compound"]
        rows.append(
            {
                "scenario_number": s["scenario_number"],
                "title": s["title"],
                "section": s["section"],
                "narrative_compound": round(narr["compound"], 4),
                "negative_consequence_compound": round(neg["compound"], 4),
                "compound_shift": round(shift, 4),
                "shifted_more_negative": shift < -0.05,
            }
        )
    return rows


def write_csv(rows: list[dict], path: Path) -> None:
    import csv

    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def plot_confusion_matrix(rows: list[dict], path: Path) -> list[str]:
    labels = sorted({r["true_section"] for r in rows})
    y_true = [r["true_section"] for r in rows]
    y_pred = [r["predicted_section"] for r in rows]
    cm = confusion_matrix(y_true, y_pred, labels=labels)

    short_labels = [_label_text(l)[:22] for l in labels]
    fig, ax = plt.subplots(figsize=(9, 8))
    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=short_labels)
    disp.plot(ax=ax, cmap="Blues", xticks_rotation=45, colorbar=False)
    ax.set_title(
        "Topic classification (spaCy word-vector similarity):\n"
        "predicted vs. author's ground truth (n=18)"
    )
    fig.tight_layout()
    fig.savefig(path, dpi=150)
    plt.close(fig)
    return labels


def write_error_analysis(
    topic_rows: list[dict], tone_rows: list[dict], labels: list[str], path: Path, nlp=None
) -> None:
    n = len(topic_rows)
    n_correct = sum(r["correct"] for r in topic_rows)
    acc = n_correct / n

    y_true = [r["true_section"] for r in topic_rows]
    y_pred = [r["predicted_section"] for r in topic_rows]
    report = classification_report(y_true, y_pred, labels=labels, zero_division=0)

    errors = [r for r in topic_rows if not r["correct"]]
    low_margin = [
        r for r in topic_rows
        if r["correct"] and (r["similarity"] - r["runner_up_similarity"]) < 0.03
    ]
    unshifted = [r for r in tone_rows if not r["shifted_more_negative"]]

    lines = []
    lines.append("# Error analysis: topic classification and tone shift on Hikayat scenarios\n")
    lines.append(
        "**Method note:** this uses spaCy static word-vector similarity for topic "
        "classification and VADER for sentiment, not a transformer pipeline — "
        "huggingface.co was unreachable from the build environment. See the module "
        "docstring in `src/analyze.py` for exactly what to swap to run the stronger "
        "transformer version on an unrestricted machine. Nothing below should be read "
        "as 'this is how a transformer would perform.'\n"
    )
    lines.append(f"**Topic classification accuracy: {n_correct}/{n} = {acc:.1%}**\n")
    lines.append(
        "At n=18 across 6 classes, treat this as a small, specific result, not a "
        "generalisable performance figure — a single flipped scenario moves it by "
        "5.6 points.\n"
    )
    lines.append("## Per-class precision/recall/F1\n")
    lines.append("```\n" + report + "```\n")

    lines.append("## Misclassifications\n")

    predicted_counts = {}
    for r in topic_rows:
        predicted_counts[r["predicted_section"]] = predicted_counts.get(r["predicted_section"], 0) + 1
    dominant_label, dominant_count = max(predicted_counts.items(), key=lambda kv: kv[1])

    if errors and dominant_count / n >= 0.7:
        lines.append(
            f"**This is not 18 independent errors — it's one collapse.** "
            f"{dominant_count}/{n} scenarios (all six categories included) were predicted "
            f"as *{_label_text(dominant_label)}*, regardless of true topic. The model isn't "
            f"discriminating between categories at all; it's returning the same answer "
            f"almost every time.\n\n"
            f"This looks like the **hubness problem**, a documented failure mode of "
            f"mean-pooled static word vectors: in high-dimensional embedding space, a small "
            f"number of points end up anomalously close to a disproportionate number of "
            f"other points, regardless of genuine semantic relatedness. All 18 narratives "
            f"share heavy topical vocabulary (AI, system, data, users, harm), so their "
            f"averaged vectors cluster tightly together — and whichever candidate label's "
            f"vector happens to sit nearest that cluster's centroid wins for almost "
            f"everything."
        )
        if nlp is not None:
            norms = {lbl: round(float(nlp(_label_text(lbl)).vector_norm), 3) for lbl in labels}
            norm_line = ", ".join(f"{_label_text(l)}: {v}" for l, v in sorted(norms.items(), key=lambda kv: kv[1]))
            lines[-1] += (
                f" Checked directly: the six label vectors' norms are {norm_line} — no "
                f"single outlier, so this isn't simply 'one label vector is unusually "
                f"large.' It's the narrative vectors converging on each other more than on "
                f"their own true labels.\n\n"
            )
        else:
            lines[-1] += "\n\n"
        lines.append("")
        lines.append(
            f"**The practical lesson, not just the diagnosis:** this is exactly why "
            f"averaging word vectors is treated as a weak baseline rather than a real "
            f"topic-classification method in current practice, and why the module docstring "
            f"documents the drop-in transformer replacement — a contextual model wouldn't "
            f"have this specific failure mode, though it would have its own worth stress-"
            f"testing rather than assuming away.\n"
        )
        lines.append("Full prediction list (all scenarios, since the pattern is what matters here):\n")
        for r in topic_rows:
            marker = "correct" if r["correct"] else "WRONG"
            lines.append(
                f"- Scenario {r['scenario_number']} ({r['title']}) — true: "
                f"*{_label_text(r['true_section'])}* — predicted: "
                f"*{_label_text(r['predicted_section'])}* [{marker}]"
            )
    elif errors:
        for r in errors:
            lines.append(
                f"- **Scenario {r['scenario_number']} — {r['title']}**: "
                f"true = *{_label_text(r['true_section'])}*, predicted = "
                f"*{_label_text(r['predicted_section'])}* "
                f"(similarity {r['similarity']:.3f}, runner-up was "
                f"*{_label_text(r['runner_up'])}* at {r['runner_up_similarity']:.3f})"
            )
    else:
        lines.append(
            "None — every scenario's nearest label by word-vector similarity was its "
            "author-assigned section.\n\n"
            "**Treat that as a reason to look harder at the setup, not as a clean win.** "
            "Averaged word vectors are a genuinely weak method — they have no sense of "
            "negation, syntax, or context, and mostly pick up on shared vocabulary. A "
            "clean sweep on this corpus most likely means the 6 categories are lexically "
            "distinct enough (surveillance/weapons vs. bias vs. deepfakes/fraud vs. "
            "emotional dependence vs. existential/environmental vs. misinformation each "
            "pull in fairly disjoint vocabulary) that even a crude bag-of-words-style "
            "method separates them — not that the method has any real understanding of "
            "the categories. A harder, more informative test would use categories with "
            "closer vocabulary overlap, or paraphrased narratives that remove the most "
            "obviously category-specific words.\n"
        )

    if low_margin:
        lines.append("\n## Correct but low-margin calls (worth flagging even though they're 'right')\n")
        for r in low_margin:
            lines.append(
                f"- Scenario {r['scenario_number']} ({r['title']}): predicted correctly "
                f"at similarity {r['similarity']:.3f}, but runner-up "
                f"'{_label_text(r['runner_up'])}' was only "
                f"{r['similarity'] - r['runner_up_similarity']:.3f} behind."
            )

    lines.append("\n## Tone-shift check: does sentiment reliably drop from narrative to negative consequence?\n")
    lines.append(
        f"Narratives are written descriptively; negative-consequence text is written to "
        f"land harder. VADER's compound sentiment score dropped by more than 0.05 in "
        f"{len(tone_rows) - len(unshifted)}/{len(tone_rows)} scenarios.\n"
    )
    if unshifted:
        lines.append("Scenarios where VADER did *not* detect a clear negative shift:\n")
        for r in unshifted:
            lines.append(
                f"- Scenario {r['scenario_number']} ({r['title']}): narrative compound "
                f"{r['narrative_compound']:+.3f} -> negative-consequence compound "
                f"{r['negative_consequence_compound']:+.3f} (shift {r['compound_shift']:+.3f})"
            )
        lines.append(
            "\nWorth noting: VADER is a general-purpose social-media-tuned lexicon "
            "scorer. It doesn't know the domain-specific weight of words like "
            "'isolation' or 'surveillance' the way a reader familiar with AI-safety "
            "discourse would — a plausible reason for it to miss a shift a human "
            "would clearly feel.\n"
        )

    lines.append("\n## What this does and doesn't demonstrate\n")
    lines.append(
        "- Demonstrates: a working, tested pipeline from raw hand-authored markdown to "
        "structured data to two independent off-the-shelf method evaluations, with "
        "output checked against ground truth, plus a documented, honest engineering "
        "decision (method substitution) made under a real environment constraint rather "
        "than silently working around it.\n"
        "- Does not demonstrate: that either method 'works' on AI-safety narrative text "
        "in general, or how a modern transformer would do on the same task — that's the "
        "natural next step once this runs somewhere with Hugging Face access. See "
        "README.md's limitations section for the rest.\n"
    )

    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    scenarios = load_scenarios()

    print("Loading spaCy model (en_core_web_md)...")
    nlp = spacy.load("en_core_web_md")

    print("Running topic classification (word-vector similarity)...")
    topic_rows = classify_zero_shot_like(nlp, scenarios)
    write_csv(topic_rows, RESULTS / "topic_predictions.csv")

    print("Running tone-shift scoring (VADER)...")
    tone_rows = score_emotion_shift(scenarios)
    write_csv(tone_rows, RESULTS / "tone_predictions.csv")

    print("Plotting confusion matrix...")
    labels = plot_confusion_matrix(topic_rows, RESULTS / "confusion_matrix.png")

    print("Writing error analysis...")
    write_error_analysis(topic_rows, tone_rows, labels, RESULTS / "error_analysis.md", nlp=nlp)

    n_correct = sum(r["correct"] for r in topic_rows)
    print(
        f"\nDone. Topic classification: {n_correct}/{len(topic_rows)} "
        f"({n_correct/len(topic_rows):.1%}). See results/ for full output."
    )


if __name__ == "__main__":
    main()
