"use client";

import {
  aiCompanionSimulation,
  buildDebrief,
  reconstructRoute,
  startSimulation,
  takeAction,
  type GameState,
} from "@/packages/game-engine/src/index";
import { useEffect, useMemo, useRef, useState } from "react";

const SAVE_KEY = "hikayat:quiet-invitation:v1";

function qualitativeState(value: number) {
  if (value <= 1) return "Fragile";
  if (value === 2) return "Mixed";
  return "Stronger";
}

export default function Home() {
  const [state, setState] = useState<GameState>(() => startSimulation(aiCompanionSimulation));
  const [influential, setInfluential] = useState<string[]>([]);
  const [reflection, setReflection] = useState("");
  const [restored, setRestored] = useState(false);
  const activeHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const hydration = window.setTimeout(() => {
      const saved = window.localStorage.getItem(SAVE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as GameState;
          if (parsed.simulationId === aiCompanionSimulation.id && parsed.simulationVersion === aiCompanionSimulation.version) {
            setState(parsed);
            setInfluential(parsed.decisions[0]?.influentialEvidenceIds ?? []);
          }
        } catch {
          window.localStorage.removeItem(SAVE_KEY);
        }
      }
      setRestored(true);
    }, 0);
    return () => window.clearTimeout(hydration);
  }, []);

  useEffect(() => {
    if (restored) window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [restored, state]);

  const round = state.phase === "complete"
    ? undefined
    : aiCompanionSimulation.rounds.find((item) => item.id === state.phase);
  const evidence = round
    ? aiCompanionSimulation.evidence.filter((item) => round.evidenceIds.includes(item.id))
    : [];
  const actions = round
    ? aiCompanionSimulation.actions.filter((item) => round.actionIds.includes(item.id))
    : [];
  const latestEvent = state.eventIds.length
    ? aiCompanionSimulation.events.find((item) => item.id === state.eventIds.at(-1))
    : undefined;
  const debrief = useMemo(
    () => state.phase === "complete" ? buildDebrief(aiCompanionSimulation, state) : undefined,
    [state],
  );

  function toggleEvidence(id: string) {
    if (state.phase !== "round1") return;
    setInfluential((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length < 2
          ? [...current, id]
          : current,
    );
  }

  function decide(actionId: string) {
    const next = takeAction(aiCompanionSimulation, state, {
      actionId,
      influentialEvidenceIds: state.phase === "round1" ? influential : [],
    });
    setState(next);
    window.setTimeout(() => {
      activeHeading.current?.focus();
      activeHeading.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  function restart() {
    window.localStorage.removeItem(SAVE_KEY);
    setState(startSimulation(aiCompanionSimulation));
    setInfluential([]);
    setReflection("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const progress = state.phase === "round1" ? "1 of 3" : state.phase === "round2" ? "2 of 3" : "3 of 3";
  const canDecide = state.phase !== "round1" || influential.length === 2;

  return (
    <main>
      <a className="skip-link" href="#workspace">Skip to incident workspace</a>
      <header className="masthead">
        <a className="wordmark" href="#top" aria-label="Hikayat home">Hikayat</a>
        <div className="case-mark"><span>Case 01</span><span>{progress}</span><span>08–12 min</span></div>
      </header>

      <section className={`case-hero${state.phase !== "round1" ? " compact" : ""}`} id="top">
        <div className="eyebrow"><span className="live-dot" /> Incident simulation · Monday, 09:10</div>
        <h1>The Quiet<br /><em>Invitation</em></h1>
        <p className="dek">A companion that offers real comfort may also be making it easier for one user to withdraw. Tomorrow, the feature expands.</p>
        <div className="role-line"><span>Your role</span><strong>{aiCompanionSimulation.role.title}</strong></div>
      </section>

      <div className="workspace" id="workspace">
        {state.phase !== "complete" && (
          <aside className="briefing" aria-labelledby="briefing-title">
            <p className="section-index">01 / Brief</p>
            <h2 id="briefing-title">What you know</h2>
            <p>Saha plans to expand “continuous reassurance” after a retention increase. Support has linked one unusual usage pattern to a concern from the user’s friend.</p>
            <div className="constraint">
              <span>Decision window</span>
              <strong>Two interventions before rollout</strong>
            </div>
            <details>
              <summary>Authority & limits</summary>
              <p>You may pause experiments, change defaults, or offer support. You may not diagnose Noor or contact anyone without consent.</p>
            </details>
            <details>
              <summary>Content note</summary>
              <p>{aiCompanionSimulation.contentNote}</p>
            </details>
            {state.phase === "round2" && latestEvent && (
              <div className="prior-action">
                <span>What followed</span>
                <strong>{latestEvent.title}</strong>
                <p>{latestEvent.narrative}</p>
              </div>
            )}
          </aside>
        )}

        {state.phase !== "complete" && round && (
          <>
            <section className="evidence" aria-labelledby="evidence-title">
              <div className="section-heading">
                <div>
                  <p className="section-index">02 / Evidence · {round.id === "round1" ? "Initial signals" : "New findings"}</p>
                  <h2 id="evidence-title" ref={activeHeading} tabIndex={-1}>Read the signals</h2>
                </div>
                {state.phase === "round1" ? (
                  <p className="selection-count" aria-live="polite">Mark two that shape your decision · <strong>{influential.length}/2</strong></p>
                ) : (
                  <p className="selection-count">All four findings inform the final intervention.</p>
                )}
              </div>
              <div className="evidence-grid">
                {evidence.map((item) => {
                  const selected = influential.includes(item.id);
                  return (
                    <article className={`evidence-card${selected ? " selected" : ""}`} key={item.id}>
                      <div className="card-meta"><span>{item.id}</span><span>{item.source}</span></div>
                      <h3>{item.title}</h3>
                      <p>{item.content}</p>
                      <div className="signal"><span>What it may signal</span>{item.signal}</div>
                      <div className="reliability"><span>Reliability</span>{item.reliability}</div>
                      {state.phase === "round1" && (
                        <button className="mark-button" type="button" aria-pressed={selected} onClick={() => toggleEvidence(item.id)}>
                          {selected ? "Marked as influential" : "Mark as influential"}
                        </button>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="decision" aria-labelledby="decision-title">
              <div className="decision-intro">
                <p className="section-index">03 / Decision</p>
                <h2 id="decision-title">{round.title}</h2>
                <p>Three defensible actions. None removes every risk.</p>
              </div>
              <div className="action-grid">
                {actions.map((action, index) => (
                  <article className="action-card" key={action.id}>
                    <span className="action-number">0{index + 1}</span>
                    <h3>{action.title}</h3>
                    <p>{action.description}</p>
                    <dl>
                      <div><dt>Why act</dt><dd>{action.rationale}</dd></div>
                      <div><dt>What it risks</dt><dd>{action.tradeoff}</dd></div>
                    </dl>
                    <button type="button" disabled={!canDecide} onClick={() => decide(action.id)}>Choose this intervention</button>
                  </article>
                ))}
              </div>
              {!canDecide && <p className="decision-status" role="status">Select two influential evidence items before intervening.</p>}
            </section>
          </>
        )}

        {state.phase === "complete" && debrief && (
          <section className="debrief" aria-labelledby="debrief-title">
            <div className="debrief-lead">
              <p className="section-index">Post-incident review · Route {reconstructRoute(state)}</p>
              <h2 id="debrief-title" ref={activeHeading} tabIndex={-1}>{debrief.outcomeTitle}</h2>
              <p>{debrief.outcomeSummary}</p>
              <button className="restart-button" type="button" onClick={restart}>Replay the incident</button>
            </div>

            <div className="debrief-body">
              <section aria-labelledby="route-title">
                <p className="section-index">01 / Your route</p>
                <h3 id="route-title">What your decisions changed</h3>
                <ol className="route-list">
                  {state.decisions.map((decision, index) => {
                    const action = aiCompanionSimulation.actions.find((item) => item.id === decision.actionId);
                    const event = aiCompanionSimulation.events.find((item) => item.id === decision.eventId);
                    return (
                      <li key={decision.actionId}>
                        <span>Decision {index + 1}</span>
                        <strong>{action?.title}</strong>
                        <p>{debrief.actionExplanations[index]}</p>
                        <blockquote>{event?.narrative}</blockquote>
                      </li>
                    );
                  })}
                </ol>
              </section>

              <section aria-labelledby="profile-title">
                <p className="section-index">02 / Consequence profile</p>
                <h3 id="profile-title">Not a score—a pattern</h3>
                <div className="profile-grid">
                  {Object.entries(debrief.dimensions).map(([dimension, value]) => (
                    <div className="profile-item" key={dimension}>
                      <span>{dimension.replace(/([A-Z])/g, " $1")}</span>
                      <strong>{qualitativeState(value)}</strong>
                      <i className={`state-${qualitativeState(value).toLowerCase()}`} aria-hidden="true" />
                    </div>
                  ))}
                </div>
                <p className="profile-note">These descriptions expose the authored consequence model. They are not a measure of your ethics or competence.</p>
              </section>

              <section aria-labelledby="system-title">
                <p className="section-index">03 / The system</p>
                <h3 id="system-title">The reinforcing loop</h3>
                <p>{aiCompanionSimulation.debrief.systemExplanation}</p>
                <div className="loop" aria-label="Social discomfort leads to reassurance, easier avoidance, more engagement, stronger personalisation, and fewer opportunities for human connection.">
                  {[
                    "Anticipated discomfort",
                    "Immediate reassurance",
                    "Easier avoidance",
                    "More engagement data",
                    "Stronger personalisation",
                    "Less human connection",
                  ].map((item, index) => <span key={item}>{item}{index < 5 && <b aria-hidden="true">→</b>}</span>)}
                </div>
              </section>

              <section aria-labelledby="uncertainty-title">
                <p className="section-index">04 / Uncertainty</p>
                <h3 id="uncertainty-title">What the evidence could not prove</h3>
                <ul className="signal-list">
                  {aiCompanionSimulation.debrief.ambiguousSignals.map((signal) => <li key={signal}>{signal}</li>)}
                </ul>
              </section>

              <section className="reflection" aria-labelledby="reflection-title">
                <p className="section-index">05 / Reflection</p>
                <h3 id="reflection-title">Hold onto the uncertainty</h3>
                <label htmlFor="reflection">{debrief.reflectionPrompts[0]}</label>
                <textarea id="reflection" value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="Write for yourself. This response stays in this browser session and is not saved." />
                <p>{debrief.reflectionPrompts[1]}</p>
              </section>
            </div>
          </section>
        )}
      </div>

      <footer>
        <strong>Hikayat</strong>
        <p>Concept, original scenario corpus, product design, and independent implementation by Saima Tariq Khan.</p>
        <a href="https://github.com/STKGenghis/hikayat">Project and provenance</a>
      </footer>
    </main>
  );
}
