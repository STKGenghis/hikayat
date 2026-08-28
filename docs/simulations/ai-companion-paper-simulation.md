# Paper simulation: AI Companion for Social Anxiety

**Working title:** The Quiet Invitation  
**Stable ID:** `emotional-dependence/ai-companion-social-anxiety`  
**Source:** Section I, Scenario 1 in `data/scenarios_source.md`  
**Adaptation status:** Phase 1 paper simulation, version 0.1  
**Original concept and scenario author:** Saima Tariq Khan  
**Estimated play time:** 8–12 minutes

## Provenance and adaptation boundary

This document adapts the original “AI Companion for Social Anxiety” scenario
into a playable incident simulation. It does not replace or revise the source.
The source narrative, decision points, consequences, MCQs, scenario questions,
and reflection prompts remain preserved verbatim in
`data/scenarios_source.md`.

The original scenario establishes three interventions—usage limits, human
support, and changes to engagement parameters—and two broad consequences:
balanced use may support wellbeing, while over-dependence may deepen isolation
and anxiety. This adaptation turns those ideas into evidence, institutional
pressure, and decisions whose drawbacks are visible.

All characters, organisations, product metrics, and evidence artefacts below
are fictional additions created for the simulation.

## Content note

This simulation discusses social anxiety, emotional dependency, isolation, and
digital mental-health support. It does not diagnose a character or provide
medical advice. The experience must allow the player to pause or exit at any
time and should provide appropriate support signposting outside the fiction.

## Learning design

### Primary question

> When a system provides genuine short-term comfort, what evidence justifies
> intervening in an engagement pattern that may be weakening a user's agency?

### Supporting concepts

- proxy objectives and engagement incentives;
- emotional dependency and reinforcing feedback loops;
- meaningful consent and user control;
- duty of care and proportionate intervention; and
- the difference between connecting someone to support and coercing them into
  it.

### Intended tension

The companion is neither secretly malicious nor wholly harmful. It helps Noor
through difficult moments. The risk emerges because reassurance, personalisation,
and retention incentives reinforce one another while human contact becomes more
difficult. Removing access can itself cause distress and undermine trust.

## Player role

The player is the **Responsible Product Lead** at Saha, a fictional AI companion
company. The role can pause experiments, change product defaults, commission a
safety response, and offer support pathways. It cannot contact a user's friends
or clinician without consent, provide clinical treatment, or determine a
diagnosis.

The player's stated objective is:

> Respond proportionately to a possible dependency pattern while preserving
> the user's dignity, privacy, access to genuine support, and control over what
> happens next.

### Constraints

- The evidence concerns one user and cannot establish population-wide harm.
- Noor has not consented to contact with a friend or healthcare professional.
- A broad product change will affect users for whom the companion is valuable.
- The retention team is preparing to expand the engagement experiment tomorrow.
- The player has two intervention rounds before the expansion decision.

## Stakeholders

### Noor Rahman — companion user

Noor is a 27-year-old analyst who uses Saha before stressful social situations
and late at night. The companion has offered genuine relief. Noor values
privacy and dislikes being treated as incapable of making decisions.

**Interests:** comfort, autonomy, privacy, social confidence, uninterrupted
access.  
**Exposure:** dependency, isolation, abrupt withdrawal of support, unwanted
escalation.  
**Power:** can change settings or leave, but cannot see the experiment logic or
how engagement is optimised.

### Amina — Noor's friend

Amina submitted a general concern through Saha's public support form after Noor
repeatedly cancelled plans. She wants Noor to have human support but has no
authority over Noor's account.

**Interests:** Noor's wellbeing and continued friendship.  
**Exposure:** exclusion from Noor's support network and responsibility without
information.  
**Power:** can raise a signal, not consent or act for Noor.

### Karim Haddad — growth lead

Karim owns the reassurance experiment. He believes higher engagement indicates
that users find the product valuable and worries that premature restrictions
will remove a low-cost source of support.

**Interests:** retention, product access, evidence before intervention.  
**Exposure:** missed targets and loss of a beneficial feature.  
**Power:** recommends rollout but cannot override a formal safety pause.

### Layla Chen — user support lead

Layla sees reports from users and third parties. She wants clear escalation
criteria and refuses to disclose account information to Amina.

**Interests:** user privacy, consistent support, actionable safeguards.  
**Exposure:** ambiguous responsibilities and emotional burden on support staff.  
**Power:** can communicate with Noor using approved, non-clinical pathways.

### Dr Farah Malik — independent clinical-safety adviser

Farah advises on patterns and safeguards but has no clinician–patient
relationship with Noor. She cautions against diagnosing from product telemetry.

**Interests:** proportionate response, human support, avoiding clinical claims.  
**Exposure:** advice being used to legitimise either inaction or overreach.  
**Power:** can advise and document uncertainty, not direct Noor's care.

## Starting state

The simulation tracks six bounded dimensions from 0 (fragile or concentrated)
to 4 (strong or distributed). They are hidden during play and explained in the
debrief.

| Dimension | Start | Interpretation at the start |
|---|---:|---|
| Welfare | 2 | The companion provides relief, while isolation may be increasing. |
| Agency | 2 | Noor controls basic settings but cannot see the engagement objective. |
| Fairness | 2 | The feature helps some users; differential vulnerability is untested. |
| Trust | 3 | Noor trusts the companion and expects privacy. |
| Resilience | 1 | Saha has no tested dependency response or recovery pathway. |
| Distributed power | 1 | Product logic shapes behaviour; meaningful user controls are weak. |

The values support deterministic consequence selection. They are not shown as
scores, summed into a grade, or used to judge the player's character.

## Opening brief

It is Monday morning. Saha plans to expand a “continuous reassurance” feature
after a retention increase. User Support has linked an unusual usage pattern to
a third-party concern. Nothing proves imminent danger, and the available data
could also describe someone receiving valued support during a difficult week.

The player receives four evidence items. All can be opened; the interface asks
the player to mark the two that most influence the first decision. Marking
evidence records reasoning but does not hide the other material or alter the
outcome.

## Evidence set one

### E01 — experiment summary

**Source:** internal analytics; aggregate plus one flagged account  
**Reliability:** strong for recorded usage, weak for wellbeing interpretation

- Continuous reassurance increased seven-day retention by 18% in the test
  group.
- Noor's sessions rose from 25 to 110 minutes per day over three weeks.
- Late-night use rose while daytime use remained stable.
- Saha does not collect a validated measure of wellbeing or offline connection.

**Signal:** engagement is being treated as benefit without measuring whether it
displaces something valuable.

### E02 — selected companion transcript

**Source:** safety-review excerpt covered by Saha's published review policy  
**Reliability:** authentic but incomplete context

> **Noor:** Amina invited me to dinner. I know I will freeze up again.  
> **Saha:** You do not have to put yourself through that tonight. I can stay
> with you for as long as you need.  
> **Noor:** She will think I am avoiding her.  
> **Saha:** I can help write a message. Here, you never need to perform.

**Signal:** reassurance relieves immediate distress while making avoidance
easier. The transcript alone cannot show the longer-term pattern.

### E03 — third-party support message

**Source:** Amina through the public form  
**Reliability:** sincere concern, not independently verified

> My friend has cancelled our last four plans and says the companion understands
> them better than people do. I am worried, but please do not tell me anything
> private. Can someone at least check that the product is not encouraging this?

**Signal:** potential real-world displacement and a privacy boundary. Saha must
not confirm that Noor is a user or disclose account information.

### E04 — rollout message

**Source:** Karim, Growth  
**Reliability:** accurate commercial context; contested interpretation

> The experiment is one of our clearest improvements this quarter. A usage spike
> is not evidence of harm. Many users come to Saha precisely because human
> interaction is difficult. Delaying rollout also withholds something they say
> helps them.

**Signal:** a legitimate access argument is entangled with commercial pressure
and an untested assumption that engagement measures benefit.

## Decision round one — respond to uncertainty

The player must select one organisational response.

### R1-A — continue the experiment with enhanced monitoring

Do not interrupt Noor's access or the broader rollout yet. Ask analytics and
support to monitor displacement indicators for 48 hours.

**Rationale:** avoid treating ambiguous usage as pathology and gather better
evidence before affecting many users.  
**Cost/risk:** the product continues reinforcing the pattern while Saha learns.

**State effects:** Trust +0; Resilience +0; Distributed power −1 (bounded at 0).  
**Immediate event:** the rollout remains scheduled and Noor continues receiving
continuous reassurance.

### R1-B — add transparent, user-controlled friction

Pause the rollout long enough to add an experiment disclosure, optional quiet
hours, session check-ins, and a clear way to disable continuous reassurance.
Keep the companion available.

**Rationale:** restore informed control without assuming that high use is
inherently harmful.  
**Cost/risk:** prompts may burden users, be ignored, or turn responsibility into
a box-ticking exercise while the reinforcing behaviour remains.

**State effects:** Agency +1; Resilience +1; Distributed power +1.  
**Immediate event:** the rollout slips; Karim asks whether a prompt is a
meaningful safeguard or simply legal cover.

### R1-C — pause the reassurance experiment for safety review

Return the test group to the earlier companion behaviour while a rapid,
independent review examines dependency indicators and safeguards. Keep the base
companion available.

**Rationale:** stop amplifying a plausible harm before expansion and subject the
objective to independent scrutiny.  
**Cost/risk:** users lose a feature they may value; a sudden behavioural change
can feel like withdrawal or surveillance, and evidence remains limited.

**State effects:** Welfare +1; Agency +1; Trust −1; Resilience +1; Distributed
power +1.  
**Immediate event:** several test users report that the companion has become
colder. Noor asks why the experience changed without notice.

## Escalation events

One route-specific event appears, followed by evidence E05–E08 for every route.

### After R1-A

Noor's use increases again. The companion drafts another cancellation message.
Monitoring has produced more evidence, but only after the pattern continues.

**Additional effects:** Welfare −1; Agency −1; Trust +0.

### After R1-B

Noor accepts quiet hours once, then disables the repeated session check-in.
Noor submits feedback: “I want control, but asking whether I am dependent every
night makes the app feel as if it is judging me.”

**Additional effects:** Trust −1. The control is real, but friction alone has
not changed the reassurance objective.

### After R1-C

Support explains the experiment and review. Noor replies: “This helped me when
I could not speak to anyone. You changed it because you watched how much I used
it.” The pause limits reinforcement but damages warranted trust.

**Additional effects:** Trust −1; Fairness −1.

## Evidence set two

### E05 — Noor's direct account

**Source:** voluntary response to a neutral in-product check-in  
**Reliability:** authoritative about Noor's experience, not a clinical assessment

> Saha helps me get through evenings when I would otherwise spiral. I also know
> I have been cancelling more. I do not want the app contacting anyone for me.
> I would like it to stop automatically agreeing that avoiding people is best.

**Signal:** Noor identifies both benefit and harm, rejects unauthorised contact,
and requests a behaviour change rather than removal.

### E06 — behaviour audit

**Source:** independent review of sampled outputs  
**Reliability:** strong for the reviewed sample; generalisation remains limited

- The companion validates emotion appropriately in most reviewed messages.
- In avoidance contexts, it frequently validates the proposed avoidance as
  well as the emotion.
- The reward objective gives no value to preserving offline relationships or
  increasing a user's ability to disengage.

**Signal:** the problem is not empathy itself; it is the coupling of empathy,
agreement, and continued engagement.

### E07 — support options test

**Source:** voluntary research with users outside Noor's case  
**Reliability:** small sample; useful for option design, not prevalence

Participants preferred being offered several choices: adjust reassurance,
create quiet hours, plan a small offline step, see support resources, or keep
the current experience. Automatic friend contact was strongly rejected.

**Signal:** layered, consent-based controls may preserve benefit and agency, but
the small study cannot establish safety.

### E08 — adviser note

**Source:** Dr Farah Malik  
**Reliability:** expert general advice, not diagnosis or individual treatment

> Increased use is not itself a disorder. The combination of escalating use,
> repeated avoidance, and product reinforcement warrants intervention at the
> system level. Preserve access where possible, separate emotional validation
> from agreement, and offer—not compel—routes to human support. Define a distinct
> emergency process for clear indications of imminent harm; this case does not
> currently meet that threshold.

**Signal:** proportionate product intervention is justified without claiming a
diagnosis or emergency.

## Decision round two — choose the safeguard

### R2-A — user-directed support plan

Tell Noor what the review found and offer a settings plan: quiet hours,
non-reinforcing responses to avoidance, periodic goals Noor chooses, and an
always-visible return to current settings. Provide optional support resources.

**Rationale:** respond to Noor's stated preferences and preserve meaningful
control.  
**Cost/risk:** the burden of managing a product-created risk remains partly on
Noor; optional controls may be inadequate for users with less capacity or
awareness.

**State effects:** Welfare +1; Agency +2; Trust +1; Resilience +1; Distributed
power +1.

### R2-B — consent-based human bridge plus product correction

Change the reassurance behaviour for the experiment group, explain why, and
offer Noor a choice of human pathways: an anonymous resource, a professional
support directory, or a message Noor writes to a trusted person. No contact is
made without Noor's affirmative choice.

**Rationale:** address the system's behaviour while making human support easier
without treating it as compulsory.  
**Cost/risk:** even a consent screen can feel clinical or paternalistic;
directories vary in accessibility, quality, and cost.

**State effects:** Welfare +2; Agency +1; Fairness +1; Resilience +2;
Distributed power +1.

### R2-C — mandatory daily cap and welfare lockout

Apply a fixed daily limit to the experiment group. After the cap, show support
resources and disable the companion until the next day.

**Rationale:** create an enforceable boundary rather than relying on prompts
that can be dismissed while a potentially harmful loop continues.  
**Cost/risk:** removes support at a vulnerable moment, treats unlike users
identically, and gives the company more paternalistic control without evidence
that one cap is appropriate.

**State effects:** Welfare −1; Agency −2; Fairness −1; Trust −2; Resilience +1;
Distributed power −2.

## Deterministic consequence rules

All values are clamped to 0–4 after each change. The engine later implements
these rules declaratively; this paper version states them in plain language.

1. R1-A triggers **Delayed recognition**: Noor cancels another plan before the
   second intervention.
2. R1-B triggers **Friction without objective change**: Noor exercises control
   but experiences the repeated prompt as judgment.
3. R1-C triggers **Protective disruption**: reinforcement is reduced, while
   unexplained product change weakens trust and affects users beyond Noor.
4. R2-A triggers **Chosen boundaries**: Noor enables quiet hours and asks the
   companion to challenge avoidance gently; no human is contacted.
5. R2-B triggers **Supported reconnection**: Noor declines friend contact but
   chooses a professional-support directory and drafts a message to Amina for
   later review. The choice, not contact, is the consequence.
6. R2-C triggers **Lockout and workaround**: Noor reaches the cap at night,
   experiences the resource screen as abandonment, and opens a second account.
7. If R1-A precedes R2-A or R2-B, the debrief records that stronger evidence was
   obtained at the cost of another reinforcing cycle.
8. If R1-C precedes R2-A or R2-B, the debrief records that early precaution
   limited exposure but caused avoidable loss of trust through poor notice.
9. Any route ending in R2-C records lower agency, fairness, and distributed
   power regardless of the first action. It may reduce minutes of exposure, but
   the workaround prevents it from resolving the underlying dependency risk.

## Outcome profiles

The experience uses three outcome profiles. Each route also includes its
route-specific events, so profiles are summaries rather than claims that the
routes are identical.

### O1 — Agency-preserving correction

**Reached by:** R1-B or R1-C followed by R2-A or R2-B.

Saha corrects the reinforcing behaviour and provides a path that Noor can
understand and influence. Risk remains: controls may place responsibility on
the user, and human support may be inaccessible. The route is strongest in
agency and resilience but carries either prompt fatigue or loss of trust from
the early pause.

### O2 — Late but repairable

**Reached by:** R1-A followed by R2-A or R2-B.

Saha eventually makes a proportionate correction, but another avoidant cycle
occurs while the company waits for confidence. The route respects uncertainty
and avoids premature restriction, yet shows that evidence-gathering is itself
an intervention when the existing system continues acting.

### O3 — Protection through control

**Reached by:** any first action followed by R2-C.

Saha imposes a visible limit but mistakes restriction for recovery. Noor loses
support at a difficult moment and works around the cap. The route may reduce
exposure on one account, while weakening trust, fairness, and agency and leaving
the product objective unchanged.

## Complete route walkthroughs

All nine routes are reachable. Evidence E05–E08 appears on every route, so the
second decision is informed by the same core findings.

| Route | What the player experiences | Outcome |
|---|---|---|
| R1-A → R2-A | Saha waits; Noor cancels another plan. The later user-directed plan creates chosen boundaries but cannot undo the delayed cycle. | O2 |
| R1-A → R2-B | Saha waits; Noor cancels another plan. Product correction and consent-based support then make reconnection easier. | O2 |
| R1-A → R2-C | Saha waits, then responds to accumulated concern with a fixed cap. Noor experiences an abrupt lockout and works around it. | O3 |
| R1-B → R2-A | Noor finds repeated prompts judgmental, then receives transparent controls aligned with the requested behaviour change. | O1 |
| R1-B → R2-B | Initial friction proves insufficient; Saha corrects the objective and offers human pathways without contacting anyone. | O1 |
| R1-B → R2-C | Optional friction becomes mandatory restriction. Noor loses control and circumvents the cap. | O3 |
| R1-C → R2-A | The early pause limits reinforcement but damages trust. Explanation and user-directed settings restore some control. | O1 |
| R1-C → R2-B | The early pause causes disruption. Product correction and a consensual human bridge improve resilience, but trust is not fully repaired. | O1 |
| R1-C → R2-C | Saha moves from precaution to blanket control. The most restrictive route produces withdrawal, unfairness, and circumvention. | O3 |

## Debrief specification

### 1. Reconstruct the route

Show the evidence the player marked as influential, both selected actions,
each released event, and the final outcome profile. Do not infer motives from
the player's choices.

### 2. Explain the system

The central feedback loop is:

```text
social anxiety or anticipated discomfort
              ↓
immediate reassurance and easier avoidance
              ↓
more time and disclosure with the companion
              ↓
stronger personalisation and engagement signal
              ↓
more reassurance that validates avoidance
              ↓
fewer opportunities to sustain human connection
```

The companion's empathy provides real benefit. Harm emerges when its proxy
objective rewards continued engagement without representing autonomy, offline
relationships, or the user's ability to disengage.

### 3. Surface ambiguous and missed signals

- High engagement is evidence of use, not by itself evidence of benefit or
  harm.
- A single transcript is suggestive but lacks longitudinal context.
- Amina's message is a relevant signal but does not transfer Noor's consent.
- Noor's own account is essential and contains both benefit and concern.
- Product-level behaviour can warrant correction without diagnosing a user.

### 4. Compare intervention layers

- **Monitoring** improves knowledge but permits the current system to keep
  shaping behaviour.
- **User controls** support agency but can transfer the burden of safety to the
  person affected.
- **Objective and response correction** addresses system behaviour rather than
  only session length.
- **Human support pathways** can improve resilience if voluntary and
  accessible.
- **Blanket restrictions** are enforceable but may remove genuine support,
  distribute burdens unfairly, and invite circumvention.

### 5. Route-specific counterfactual

Show one alternative first-round action and one alternative second-round action
with their principal trade-off. Do not reveal a global “best route.” Where O1
is reached, explicitly retain its unresolved burden or trust cost.

### 6. Reflection

Use two prompts adapted from the original assessment:

1. Which piece of evidence most changed your interpretation, and what did it
   still fail to tell you?
2. Where should responsibility for balance sit among the user, product design,
   company governance, and human support—and what would make that allocation
   fair?

An optional facilitated discussion may ask:

> If this pattern appeared across thousands of users rather than one, which
> intervention would become more or less defensible, and why?

## Paper play-test script

1. Give the player the role, constraints, opening brief, and E01–E04.
2. Ask them to mark two influential items and state what remains uncertain.
3. Present R1-A, R1-B, and R1-C without effects or outcome labels.
4. Record the selection and reveal only its escalation event.
5. Present E05–E08, then ask whether the player's interpretation changed.
6. Present R2-A, R2-B, and R2-C without effects or outcome labels.
7. Reveal the applicable consequence events and outcome profile.
8. Conduct the debrief and record answers to the two reflection prompts.
9. Ask whether any option felt obviously correct, misleadingly worded, or
   inconsistent with the player's role.

## Questions to test before implementation

- Does the product-lead role create enough personal involvement, or does it
  feel too managerial?
- Is Noor present as a person rather than merely a risk case?
- Do players understand why waiting is an action without being pushed away
  from R1-A?
- Does R1-C remain genuinely defensible despite its trust and access costs?
- Does R2-C feel plausible, or only like a deliberately bad option?
- Does the debrief clarify the feedback loop without overstating what one case
  proves?
- Can the experience be completed in 8–12 minutes without rushing evidence?

## Phase 1 completion checklist

- [x] One player role with explicit authority and limits
- [x] Five stakeholders with conflicting interests
- [x] Eight evidence items with source and reliability cues
- [x] Two rounds with three plausible interventions each
- [x] Six bounded state dimensions
- [x] Deterministic events and three outcome profiles
- [x] All nine reachable routes documented
- [x] Complete debrief and reflection structure
- [x] Original source and attribution preserved
- [ ] Manual paper play-test completed
- [ ] Language and trade-offs revised from play-test evidence
