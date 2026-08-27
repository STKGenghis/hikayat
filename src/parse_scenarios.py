"""
Parse the Hikayat AI-safety scenario corpus (data/scenarios_source.md) into
structured records for analysis.

The source markdown follows a fixed structure per scenario:
    ## **<Section Title>**
    ### **Scenario N: <Scenario Title>**
    **Narrative:** ...
    **Decision Points:** * ...
    **Consequences:** * **Positive:** ... * **Negative:** ...
    #### **Assessment for Scenario N**
    **Multiple Choice Questions (MCQs):** ...
    **Scenario-Based Questions:** ...
    **Self-Reflection Prompts:** ...

This parser is intentionally strict rather than lenient: if the structure it
expects isn't found, it raises rather than silently returning partial data.
That's a deliberate choice for a corpus this small (18 scenarios) where a
silent parsing gap would quietly bias any downstream analysis.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, asdict
from pathlib import Path

SECTION_RE = re.compile(r"^##\s+\*\*(?P<title>(?:(?!Final Remarks).)+)\*\*\s*$", re.MULTILINE)
SCENARIO_RE = re.compile(
    r"^###\s+\*\*Scenario\s+(?P<num>\d+):\s*(?P<title>.+?)\*\*\s*$", re.MULTILINE
)


@dataclass
class Scenario:
    section: str
    scenario_number: int
    title: str
    narrative: str
    decision_points: list[str]
    consequences_positive: str
    consequences_negative: str
    mcq_count: int
    scenario_question_count: int
    reflection_prompt_count: int


def _clean(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def _bullets(block: str) -> list[str]:
    return [
        _clean(line.lstrip("* ").strip())
        for line in block.splitlines()
        if line.strip().startswith("*")
    ]


def _extract_field(block: str, label: str, stop_labels: list[str]) -> str:
    """Grab the text following **<label>:** up to the next known label or end of block."""
    start_pat = re.compile(rf"\*\*{re.escape(label)}:?\*\*\s*", re.IGNORECASE)
    m = start_pat.search(block)
    if not m:
        return ""
    rest = block[m.end():]
    stop_positions = []
    for stop in stop_labels:
        sm = re.search(rf"\*\*{re.escape(stop)}", rest, re.IGNORECASE)
        if sm:
            stop_positions.append(sm.start())
        hm = re.search(r"^####\s", rest, re.MULTILINE)
        if hm:
            stop_positions.append(hm.start())
    end = min(stop_positions) if stop_positions else len(rest)
    value = _clean(rest[:end])
    # Strip a trailing bullet marker for the *next* item that bleeds in
    # before the stop-label match (e.g. "...anxiety. *" before "**Negative:**").
    return re.sub(r"\s*\*+\s*$", "", value)


def parse(md_path: Path) -> list[Scenario]:
    text = md_path.read_text(encoding="utf-8")

    # Cut off "Final Remarks" — not scenario content.
    final_idx = text.find("## **Final Remarks**")
    if final_idx != -1:
        text = text[:final_idx]

    sections = list(SECTION_RE.finditer(text))
    if not sections:
        raise ValueError("No sections found — source format may have changed.")

    scenarios: list[Scenario] = []
    for i, sec_match in enumerate(sections):
        section_title = _clean(sec_match.group("title"))
        sec_start = sec_match.end()
        sec_end = sections[i + 1].start() if i + 1 < len(sections) else len(text)
        sec_text = text[sec_start:sec_end]

        scenario_matches = list(SCENARIO_RE.finditer(sec_text))
        for j, scen_match in enumerate(scenario_matches):
            scen_start = scen_match.end()
            scen_end = (
                scenario_matches[j + 1].start()
                if j + 1 < len(scenario_matches)
                else len(sec_text)
            )
            block = sec_text[scen_start:scen_end]

            narrative = _extract_field(
                block, "Narrative", ["Decision Points", "Consequences"]
            )
            decision_block_match = re.search(
                r"\*\*Decision Points:?\*\*(.*?)(\*\*Consequences|\Z)", block, re.DOTALL
            )
            decision_points = _bullets(decision_block_match.group(1)) if decision_block_match else []

            cons_pos = _extract_field(block, "Positive", ["Negative"])
            cons_neg = _extract_field(block, "Negative", ["Assessment", "####"])

            mcq_count = len(re.findall(r"\*\*Correct Answer:?\*\*", block))
            sbq_match = re.search(
                r"\*\*Scenario-Based Questions:?\*\*(.*?)(\*\*Self-Reflection|\Z)", block, re.DOTALL
            )
            sbq_count = len(re.findall(r"^\d+\.", sbq_match.group(1), re.MULTILINE)) if sbq_match else 0
            refl_match = re.search(r"\*\*Self-Reflection Prompts:?\*\*(.*?)\Z", block, re.DOTALL)
            refl_count = len(re.findall(r"^\d+\.", refl_match.group(1), re.MULTILINE)) if refl_match else 0

            scenarios.append(
                Scenario(
                    section=section_title,
                    scenario_number=int(scen_match.group("num")),
                    title=_clean(scen_match.group("title")),
                    narrative=narrative,
                    decision_points=decision_points,
                    consequences_positive=cons_pos,
                    consequences_negative=cons_neg,
                    mcq_count=mcq_count,
                    scenario_question_count=sbq_count,
                    reflection_prompt_count=refl_count,
                )
            )

    return scenarios


def main() -> None:
    root = Path(__file__).resolve().parent.parent
    src = root / "data" / "scenarios_source.md"
    out = root / "data" / "scenarios.json"

    scenarios = parse(src)
    out.write_text(
        json.dumps([asdict(s) for s in scenarios], indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    print(f"Parsed {len(scenarios)} scenarios across "
          f"{len({s.section for s in scenarios})} sections -> {out}")


if __name__ == "__main__":
    main()
