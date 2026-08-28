import { describe, expect, it } from "vitest";
import {
  ContentValidationError,
  InvalidPlayerActionError,
  aiCompanionSimulation,
  buildDebrief,
  reconstructRoute,
  startSimulation,
  takeAction,
  validateSimulation,
} from "../src/index.js";

const firstEvidence = ["E01", "E02"];

function play(first: string, second: string) {
  const start = startSimulation(aiCompanionSimulation);
  const afterFirst = takeAction(aiCompanionSimulation, start, {
    actionId: first,
    influentialEvidenceIds: firstEvidence,
  });
  return takeAction(aiCompanionSimulation, afterFirst, { actionId: second });
}

describe("content validation", () => {
  it("accepts the authored simulation", () => {
    expect(validateSimulation(aiCompanionSimulation).id).toBe(aiCompanionSimulation.id);
  });

  it("rejects a missing cross-reference with an actionable error", () => {
    const invalid = structuredClone(aiCompanionSimulation) as unknown as Record<string, unknown>;
    const rounds = invalid.rounds as Array<{ actionIds: string[] }>;
    rounds[0]!.actionIds[0] = "R1-MISSING";
    expect(() => validateSimulation(invalid)).toThrow(ContentValidationError);
    expect(() => validateSimulation(invalid)).toThrow(/missing action R1-MISSING/);
  });

  it("rejects an uncovered reachable route", () => {
    const invalid = structuredClone(aiCompanionSimulation);
    const firstOutcome = invalid.outcomes[0];
    if (!firstOutcome) throw new Error("Test fixture has no first outcome");
    firstOutcome.routeIds = firstOutcome.routeIds.filter(
      (route) => route !== "R1-B->R2-A",
    );
    expect(() => validateSimulation(invalid)).toThrow(/no outcome: R1-B->R2-A/);
  });
});

describe("engine", () => {
  it("starts with only first-round evidence visible", () => {
    const state = startSimulation(aiCompanionSimulation);
    expect(state.phase).toBe("round1");
    expect(state.visibleEvidenceIds).toEqual(["E01", "E02", "E03", "E04"]);
    expect(state.decisions).toHaveLength(0);
  });

  it("requires two unique, available evidence selections in round one", () => {
    const state = startSimulation(aiCompanionSimulation);
    expect(() => takeAction(aiCompanionSimulation, state, { actionId: "R1-A" })).toThrow(
      InvalidPlayerActionError,
    );
    expect(() => takeAction(aiCompanionSimulation, state, {
      actionId: "R1-A",
      influentialEvidenceIds: ["E01", "E01"],
    })).toThrow(/unique/);
    expect(() => takeAction(aiCompanionSimulation, state, {
      actionId: "R1-A",
      influentialEvidenceIds: ["E01", "E08"],
    })).toThrow(/not available/);
  });

  it("releases second-round evidence after the first action", () => {
    const state = takeAction(aiCompanionSimulation, startSimulation(aiCompanionSimulation), {
      actionId: "R1-B",
      influentialEvidenceIds: firstEvidence,
    });
    expect(state.phase).toBe("round2");
    expect(state.visibleEvidenceIds).toEqual(["E01", "E02", "E03", "E04", "E05", "E06", "E07", "E08"]);
    expect(state.eventIds).toEqual(["EV-R1-B"]);
  });

  it.each([
    ["R1-A", "R2-A", "O2"], ["R1-A", "R2-B", "O2"], ["R1-A", "R2-C", "O3"],
    ["R1-B", "R2-A", "O1"], ["R1-B", "R2-B", "O1"], ["R1-B", "R2-C", "O3"],
    ["R1-C", "R2-A", "O1"], ["R1-C", "R2-B", "O1"], ["R1-C", "R2-C", "O3"],
  ])("maps %s → %s to %s", (first, second, outcome) => {
    const state = play(first, second);
    expect(state.phase).toBe("complete");
    expect(state.outcomeId).toBe(outcome);
    expect(reconstructRoute(state)).toBe(`${first}->${second}`);
    expect(Object.values(state.dimensions).every((value) => value >= 0 && value <= 4)).toBe(true);
  });

  it("is deterministic and does not mutate earlier state", () => {
    const start = startSimulation(aiCompanionSimulation);
    const before = structuredClone(start);
    const one = takeAction(aiCompanionSimulation, start, { actionId: "R1-C", influentialEvidenceIds: firstEvidence });
    const two = takeAction(aiCompanionSimulation, start, { actionId: "R1-C", influentialEvidenceIds: firstEvidence });
    expect(one).toEqual(two);
    expect(start).toEqual(before);
  });

  it("builds a traceable debrief for a completed route", () => {
    const state = play("R1-A", "R2-B");
    const debrief = buildDebrief(aiCompanionSimulation, state);
    expect(debrief.routeId).toBe("R1-A->R2-B");
    expect(debrief.outcomeTitle).toBe("Late but repairable");
    expect(debrief.actionExplanations).toHaveLength(2);
    expect(debrief.eventExplanations).toHaveLength(2);
    expect(debrief.influentialEvidenceIds).toEqual(firstEvidence);
    expect(debrief.reflectionPrompts).toHaveLength(2);
  });

  it("rejects further actions and premature debriefs", () => {
    const start = startSimulation(aiCompanionSimulation);
    expect(() => buildDebrief(aiCompanionSimulation, start)).toThrow(InvalidPlayerActionError);
    const complete = play("R1-A", "R2-A");
    expect(() => takeAction(aiCompanionSimulation, complete, { actionId: "R2-A" })).toThrow(
      /already complete/,
    );
  });
});
