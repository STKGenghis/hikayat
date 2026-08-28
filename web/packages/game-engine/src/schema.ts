import { z } from "zod";

export const DIMENSIONS = [
  "welfare",
  "agency",
  "fairness",
  "trust",
  "resilience",
  "distributedPower",
] as const;

export const dimensionSchema = z.enum(DIMENSIONS);
export type Dimension = z.infer<typeof dimensionSchema>;

const idSchema = z.string().min(1).regex(/^[a-zA-Z0-9][a-zA-Z0-9/_-]*$/);
const effectsSchema = z.record(z.string(), z.number().int().min(-4).max(4));

export const simulationSchema = z.object({
  id: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  title: z.string().min(1),
  provenance: z.object({
    source: z.string().min(1),
    originalAuthor: z.string().min(1),
    adaptationStatus: z.string().min(1),
  }),
  contentNote: z.string().min(1),
  role: z.object({
    title: z.string().min(1),
    objective: z.string().min(1),
    authority: z.array(z.string().min(1)).min(1),
    limits: z.array(z.string().min(1)).min(1),
  }),
  stakeholders: z.array(z.object({
    id: idSchema,
    name: z.string().min(1),
    role: z.string().min(1),
    interests: z.array(z.string().min(1)).min(1),
    exposure: z.array(z.string().min(1)).min(1),
    power: z.string().min(1),
  })).min(1),
  dimensions: z.record(dimensionSchema, z.number().int().min(0).max(4)),
  evidence: z.array(z.object({
    id: idSchema,
    title: z.string().min(1),
    source: z.string().min(1),
    reliability: z.string().min(1),
    content: z.string().min(1),
    signal: z.string().min(1),
  })).min(1),
  rounds: z.array(z.object({
    id: z.enum(["round1", "round2"]),
    title: z.string().min(1),
    evidenceIds: z.array(idSchema).min(1),
    actionIds: z.array(idSchema).min(2),
    influentialEvidenceRequired: z.number().int().min(0),
  })).length(2),
  actions: z.array(z.object({
    id: idSchema,
    roundId: z.enum(["round1", "round2"]),
    title: z.string().min(1),
    description: z.string().min(1),
    rationale: z.string().min(1),
    tradeoff: z.string().min(1),
    effects: effectsSchema,
    eventId: idSchema,
  })).min(1),
  events: z.array(z.object({
    id: idSchema,
    title: z.string().min(1),
    narrative: z.string().min(1),
    effects: effectsSchema,
  })).min(1),
  outcomes: z.array(z.object({
    id: idSchema,
    title: z.string().min(1),
    summary: z.string().min(1),
    routeIds: z.array(z.string().regex(/^R1-[A-Z]->R2-[A-Z]$/)).min(1),
  })).min(1),
  debrief: z.object({
    systemExplanation: z.string().min(1),
    ambiguousSignals: z.array(z.string().min(1)).min(1),
    actionExplanations: z.record(z.string(), z.string().min(1)),
    eventExplanations: z.record(z.string(), z.string().min(1)),
    reflectionPrompts: z.array(z.string().min(1)).min(2),
  }),
});

export type Simulation = z.infer<typeof simulationSchema>;

export class ContentValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super(`Invalid simulation content:\n- ${issues.join("\n- ")}`);
    this.name = "ContentValidationError";
  }
}

function duplicates(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated];
}

export function routeId(firstActionId: string, secondActionId: string): string {
  return `${firstActionId}->${secondActionId}`;
}

export function validateSimulation(input: unknown): Simulation {
  const parsed = simulationSchema.safeParse(input);
  if (!parsed.success) {
    throw new ContentValidationError(
      parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
    );
  }

  const simulation = parsed.data;
  const issues: string[] = [];
  const evidenceIds = new Set(simulation.evidence.map(({ id }) => id));
  const actionIds = new Set(simulation.actions.map(({ id }) => id));
  const eventIds = new Set(simulation.events.map(({ id }) => id));
  const roundIds = new Set(simulation.rounds.map(({ id }) => id));

  for (const [kind, ids] of [
    ["stakeholder", simulation.stakeholders.map(({ id }) => id)],
    ["evidence", simulation.evidence.map(({ id }) => id)],
    ["action", simulation.actions.map(({ id }) => id)],
    ["event", simulation.events.map(({ id }) => id)],
    ["outcome", simulation.outcomes.map(({ id }) => id)],
  ] as const) {
    for (const duplicate of duplicates(ids)) issues.push(`Duplicate ${kind} ID: ${duplicate}`);
  }

  for (const round of simulation.rounds) {
    for (const id of round.evidenceIds) {
      if (!evidenceIds.has(id)) issues.push(`${round.id} references missing evidence ${id}`);
    }
    for (const id of round.actionIds) {
      if (!actionIds.has(id)) issues.push(`${round.id} references missing action ${id}`);
    }
    if (round.influentialEvidenceRequired > round.evidenceIds.length) {
      issues.push(`${round.id} requires more influential evidence than it releases`);
    }
  }

  for (const action of simulation.actions) {
    if (!roundIds.has(action.roundId)) issues.push(`${action.id} references missing round ${action.roundId}`);
    if (!eventIds.has(action.eventId)) issues.push(`${action.id} references missing event ${action.eventId}`);
    if (!simulation.rounds.find(({ id }) => id === action.roundId)?.actionIds.includes(action.id)) {
      issues.push(`${action.id} is not listed by ${action.roundId}`);
    }
    for (const dimension of Object.keys(action.effects)) {
      if (!DIMENSIONS.includes(dimension as Dimension)) issues.push(`${action.id} changes unknown dimension ${dimension}`);
    }
    if (!simulation.debrief.actionExplanations[action.id]) {
      issues.push(`${action.id} has no debrief explanation`);
    }
  }

  for (const event of simulation.events) {
    for (const dimension of Object.keys(event.effects)) {
      if (!DIMENSIONS.includes(dimension as Dimension)) issues.push(`${event.id} changes unknown dimension ${dimension}`);
    }
    if (!simulation.debrief.eventExplanations[event.id]) {
      issues.push(`${event.id} has no debrief explanation`);
    }
  }

  const firstRound = simulation.rounds.find(({ id }) => id === "round1");
  const secondRound = simulation.rounds.find(({ id }) => id === "round2");
  if (!firstRound || !secondRound) {
    issues.push("Exactly one round1 and one round2 are required");
  } else {
    const expectedRoutes = new Set(
      firstRound.actionIds.flatMap((first) => secondRound.actionIds.map((second) => routeId(first, second))),
    );
    const assignedRoutes = simulation.outcomes.flatMap(({ routeIds }) => routeIds);
    for (const duplicate of duplicates(assignedRoutes)) issues.push(`Route assigned twice: ${duplicate}`);
    for (const route of expectedRoutes) {
      if (!assignedRoutes.includes(route)) issues.push(`Reachable route has no outcome: ${route}`);
    }
    for (const route of assignedRoutes) {
      if (!expectedRoutes.has(route)) issues.push(`Outcome references unreachable route: ${route}`);
    }
  }

  if (issues.length) throw new ContentValidationError(issues);
  return simulation;
}
