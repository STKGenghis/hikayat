"""
Tests for src/analyze.py — checks that the evaluation pipeline produces
well-formed, internally consistent output, not that any particular accuracy
number is achieved (that number is the finding, not a target).

Requires the same dependencies as analyze.py (spacy + en_core_web_md,
vaderSentiment, scikit-learn, matplotlib) plus the parsed data/scenarios.json
to already exist (run src/parse_scenarios.py first).
"""
import csv
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "scenarios.json"


def _load_scenarios():
    import json

    return json.loads(DATA.read_text(encoding="utf-8"))


def test_topic_classification_covers_every_scenario():
    import spacy
    from analyze import classify_zero_shot_like

    scenarios = _load_scenarios()
    nlp = spacy.load("en_core_web_md")
    rows = classify_zero_shot_like(nlp, scenarios)
    assert len(rows) == len(scenarios)
    for r in rows:
        assert r["predicted_section"], "empty prediction"
        assert 0.0 <= r["similarity"] <= 1.0 + 1e-6
        assert r["runner_up"] != r["predicted_section"]


def test_tone_shift_covers_every_scenario():
    from analyze import score_emotion_shift

    scenarios = _load_scenarios()
    rows = score_emotion_shift(scenarios)
    assert len(rows) == len(scenarios)
    for r in rows:
        assert -1.0 <= r["narrative_compound"] <= 1.0
        assert -1.0 <= r["negative_consequence_compound"] <= 1.0


def test_results_files_are_generated_and_well_formed():
    """Run the full pipeline end-to-end and sanity-check every output file.
    This is the closest thing to an integration test for this repo."""
    import subprocess

    subprocess.run(
        [sys.executable, str(ROOT / "src" / "analyze.py")],
        check=True,
        cwd=ROOT,
        capture_output=True,
        text=True,
    )

    results = ROOT / "results"
    for name in ["topic_predictions.csv", "tone_predictions.csv", "confusion_matrix.png", "error_analysis.md"]:
        path = results / name
        assert path.exists(), f"missing {name}"
        assert path.stat().st_size > 0, f"{name} is empty"

    with (results / "topic_predictions.csv").open() as f:
        rows = list(csv.DictReader(f))
    assert len(rows) == 18

    error_md = (results / "error_analysis.md").read_text(encoding="utf-8")
    assert "accuracy" in error_md.lower()


if __name__ == "__main__":
    tests = [v for k, v in list(globals().items()) if k.startswith("test_")]
    failures = 0
    for t in tests:
        try:
            t()
            print(f"PASS  {t.__name__}")
        except Exception as e:  # noqa: BLE001
            failures += 1
            print(f"FAIL  {t.__name__}: {e}")
    print(f"\n{len(tests) - failures}/{len(tests)} passed")
    sys.exit(1 if failures else 0)
