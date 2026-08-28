import type { Dimension, Simulation } from "./schema.js";
import { routeId, validateSimulation } from "./schema.js";

export type Phase = "round1" | "round2" | "complete";

export interface DecisionRecord {
  roundId: "round1" | "round2";
  actionId: string;
  influentialEvidenceIds: string[];
  eventId: string;
}

export interface GameState {
  simulationId: string;
  simulationVersion: string;
  phase: Phase;
  dimensions: Record<Dimension, number>;
  visibleEvidenceIds: string[];
  decisions: DecisionRecord[];
  eventIds: string[];
  outcomeId?: string;
}

export interface PlayerAction {
  actionId: string;
  influentialEvidenceIds?: string[];
}

export class InvalidPlayerActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPlayerActionError";
  }
}

function clamp(value: number): number {
  return Math.max(0, Math.min(4, value));
}

function applyEffects(
  dimensions: Record<Dimension, number>,
  effects: Record<string, number>,
): Record<Dimension, number> {
  const next = { ...dimensions };
  for (const [dimension, change] of Object.entries(effects)) {
    const key = dimension as Dimension;
    next[key] = clamp(next[key] + change);
  }
  return next;
}

export function startSimulation(input: unknown): GameState {
  const simulation = validateSimulation(input);
  const firstRound = simulation.rounds.find(({ id }) => id === "round1");
  if (!firstRound) throw new Error("Validated simulation has no first round");
  return {
    simulationId: simulation.id,
    simulationVersion: simulation.version,
    phase: "round1",
    dimensions: { ...simulation.dimensions },
    visibleEvidenceIds: [...firstRound.evidenceIds],
    decisions: [],
    eventIds: [],
  };
}

export function takeAction(
  input: unknown,
  state: Readonly<GameState>,
  playerAction: PlayerAction,
): GameState {
  const simulation = validateSimulation(input);
  if (state.simulationId !== simulation.id || state.simulationVersion !== simulation.version) {
    throw new InvalidPlayerActionError("Saved state does not match this simulation version");
  }
  if (state.phase === "complete") throw new InvalidPlayerActionError("The simulation is already complete");

  const round = simulation.rounds.find(({ id }) => id === state.phase);
  if (!round) throw new Error(`Validated simulation has no ${state.phase}`);
  if (!round.actionIds.includes(playerAction.actionId)) {
    throw new InvalidPlayerActionError(`${playerAction.actionId} is not available during ${state.phase}`);
  }

  const influential = playerAction.influentialEvidenceIds ?? [];
  const uniqueInfluential = new Set(influential);
  if (uniqueInfluential.size !== influential.length) {
    throw new InvalidPlayerActionError("Influential evidence selections must be unique");
  }
  if (influential.length !== round.influentialEvidenceRequired) {
    throw new InvalidPlayerActionError(
      `${state.phase} requires ${round.influentialEvidenceRequired} influential evidence selection(s)`,
    );
  }
  for (const evidenceId of influential) {
    if (!round.evidenceIds.includes(evidenceId)) {
      throw new InvalidPlayerActionError(`${evidenceId} is not available during ${state.phase}`);
    }
  }

  const action = simulation.actions.find(({ id }) => id === playerAction.actionId);
  if (!action) throw new Error(`Validated simulation has no action ${playerAction.actionId}`);
  const event = simulation.events.find(({ id }) => id === action.eventId);
  if (!event) throw new Error(`Validated simulation has no event ${action.eventId}`);

  const afterAction = applyEffects({ ...state.dimensions }, action.effects);
  const dimensions = applyEffects(afterAction, event.effects);
  const decision: DecisionRecord = {
    roundId: round.id,
    actionId: action.id,
    influentialEvidenceIds: [...influential],
    eventId: event.id,
  };

  if (state.phase === "round1") {
    const secondRound = simulation.rounds.find(({ id }) => id === "round2");
    if (!secondRound) throw new Error("Validated simulation has no second round");
    return {
      ...state,
      phase: "round2",
      dimensions,
      visibleEvidenceIds: [...new Set([...state.visibleEvidenceIds, ...secondRound.evidenceIds])],
      decisions: [...state.decisions, decision],
      eventIds: [...state.eventIds, event.id],
    };
  }

  const firstDecision = state.decisions[0];
  if (!firstDecision) throw new Error("Second-round state has no first decision");
  const completedRoute = routeId(firstDecision.actionId, action.id);
  const outcome = simulation.outcomes.find(({ routeIds }) => routeIds.includes(completedRoute));
  if (!outcome) throw new Error(`Validated simulation has no outcome for ${completedRoute}`);
  return {
    ...state,
    phase: "complete",
    dimensions,
    decisions: [...state.decisions, decision],
    eventIds: [...state.eventIds, event.id],
    outcomeId: outcome.id,
  };
}

export function reconstructRoute(state: Readonly<GameState>): string | undefined {
  if (state.decisions.length !== 2) return undefined;
  const first = state.decisions[0];
  const second = state.decisions[1];
  if (!first || !second) return undefined;
  return routeId(first.actionId, second.actionId);
}

export interface Debrief {
  routeId: string;
  outcomeTitle: string;
  outcomeSummary: string;
  actionExplanations: string[];
  eventExplanations: string[];
  dimensions: Record<Dimension, number>;
  influentialEvidenceIds: string[];
  reflectionPrompts: string[];
}

export function buildDebrief(input: unknown, state: Readonly<GameState>): Debrief {
  const simulation: Simulation = validateSimulation(input);
  if (state.phase !== "complete" || !state.outcomeId) {
    throw new InvalidPlayerActionError("A debrief is available only after completion");
  }
  const completedRoute = reconstructRoute(state);
  if (!completedRoute) throw new Error("Complete state has no reconstructable route");
  const outcome = simulation.outcomes.find(({ id }) => id === state.outcomeId);
  if (!outcome) throw new Error(`Simulation has no outcome ${state.outcomeId}`);
  return {
    routeId: completedRoute,
    outcomeTitle: outcome.title,
    outcomeSummary: outcome.summary,
    actionExplanations: state.decisions.map(({ actionId }) => simulation.debrief.actionExplanations[actionId] ?? ""),
    eventExplanations: state.eventIds.map((eventId) => simulation.debrief.eventExplanations[eventId] ?? ""),
    dimensions: { ...state.dimensions },
    influentialEvidenceIds: state.decisions.flatMap(({ influentialEvidenceIds }) => influentialEvidenceIds),
    reflectionPrompts: [...simulation.debrief.reflectionPrompts],
  };
}
