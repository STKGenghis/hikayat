"""
Tests for src/parse_scenarios.py.

Run with: python -m pytest tests/ -v   (or plain: python tests/test_parser.py)
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

from parse_scenarios import parse  # noqa: E402

DATA = Path(__file__).resolve().parent.parent / "data" / "scenarios_source.md"


def test_finds_all_scenarios():
    scenarios = parse(DATA)
    assert len(scenarios) == 18, f"expected 18 scenarios, got {len(scenarios)}"


def test_finds_all_sections():
    scenarios = parse(DATA)
    sections = {s.section for s in scenarios}
    assert len(sections) == 6, f"expected 6 sections, got {len(sections)}: {sections}"


def test_every_scenario_has_narrative():
    scenarios = parse(DATA)
    empty = [s.title for s in scenarios if not s.narrative]
    assert not empty, f"scenarios with empty narrative: {empty}"


def test_every_scenario_has_both_consequences():
    scenarios = parse(DATA)
    for s in scenarios:
        assert s.consequences_positive, f"{s.title}: missing positive consequence"
        assert s.consequences_negative, f"{s.title}: missing negative consequence"


def test_no_stray_markdown_artifacts_in_text_fields():
    """Regression test: an earlier version of the parser left a trailing
    bullet marker ('*') on consequence text because the stop-pattern match
    didn't consume the markdown list marker preceding the next label."""
    scenarios = parse(DATA)
    for s in scenarios:
        for field_name, value in [
            ("narrative", s.narrative),
            ("consequences_positive", s.consequences_positive),
            ("consequences_negative", s.consequences_negative),
        ]:
            assert not value.rstrip().endswith("*"), (
                f"{s.title}.{field_name} ends with a stray '*': {value!r}"
            )


def test_decision_points_are_nonempty_list_of_questions():
    scenarios = parse(DATA)
    for s in scenarios:
        assert len(s.decision_points) >= 2, f"{s.title}: too few decision points"
        for dp in s.decision_points:
            assert dp.strip(), f"{s.title}: blank decision point"


def test_assessment_counts_are_plausible():
    scenarios = parse(DATA)
    for s in scenarios:
        assert s.mcq_count == 2, f"{s.title}: expected 2 MCQs, got {s.mcq_count}"
        assert s.scenario_question_count == 2, f"{s.title}: expected 2 scenario Qs"
        assert s.reflection_prompt_count == 2, f"{s.title}: expected 2 reflection prompts"


if __name__ == "__main__":
    tests = [v for k, v in list(globals().items()) if k.startswith("test_")]
    failures = 0
    for t in tests:
        try:
            t()
            print(f"PASS  {t.__name__}")
        except AssertionError as e:
            failures += 1
            print(f"FAIL  {t.__name__}: {e}")
    print(f"\n{len(tests) - failures}/{len(tests)} passed")
    sys.exit(1 if failures else 0)
