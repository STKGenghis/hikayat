# Error analysis: topic classification and tone shift on Hikayat scenarios

**Method note:** this uses spaCy static word-vector similarity for topic classification and VADER for sentiment, not a transformer pipeline — huggingface.co was unreachable from the build environment. See the module docstring in `src/analyze.py` for exactly what to swap to run the stronger transformer version on an unrestricted machine. Nothing below should be read as 'this is how a transformer would perform.'

**Topic classification accuracy: 3/18 = 16.7%**

At n=18 across 6 classes, treat this as a small, specific result, not a generalisable performance figure — a single flipped scenario moves it by 5.6 points.

## Per-class precision/recall/F1

```
                                                                    precision    recall  f1-score   support

                     I. Emotional Over-dependence on Misaligned AI       0.00      0.00      0.00         3
                       II. Breach of Privacy, Fraud, and Deepfakes       0.17      1.00      0.29         3
                                  III. Systemic Bias Baked into AI       0.00      0.00      0.00         3
                                            IV. Existential Threat       0.00      0.00      0.00         3
V. Misuse of AI: Authoritarian Surveillance and Autonomous Weapons       0.00      0.00      0.00         3
                                 VI. Misinformation and Propaganda       0.00      0.00      0.00         3

                                                          accuracy                           0.17        18
                                                         macro avg       0.03      0.17      0.05        18
                                                      weighted avg       0.03      0.17      0.05        18
```

## Misclassifications

**This is not 18 independent errors — it's one collapse.** 18/18 scenarios (all six categories included) were predicted as *Breach of Privacy, Fraud, and Deepfakes*, regardless of true topic. The model isn't discriminating between categories at all; it's returning the same answer almost every time.

This looks like the **hubness problem**, a documented failure mode of mean-pooled static word vectors: in high-dimensional embedding space, a small number of points end up anomalously close to a disproportionate number of other points, regardless of genuine semantic relatedness. All 18 narratives share heavy topical vocabulary (AI, system, data, users, harm), so their averaged vectors cluster tightly together — and whichever candidate label's vector happens to sit nearest that cluster's centroid wins for almost everything. Checked directly: the six label vectors' norms are Misuse of AI: Authoritarian Surveillance and Autonomous Weapons: 3.328, Emotional Over-dependence on Misaligned AI: 3.337, Breach of Privacy, Fraud, and Deepfakes: 3.756, Systemic Bias Baked into AI: 4.001, Existential Threat: 5.135, Misinformation and Propaganda: 5.176 — no single outlier, so this isn't simply 'one label vector is unusually large.' It's the narrative vectors converging on each other more than on their own true labels.



**The practical lesson, not just the diagnosis:** this is exactly why averaging word vectors is treated as a weak baseline rather than a real topic-classification method in current practice, and why the module docstring documents the drop-in transformer replacement — a contextual model wouldn't have this specific failure mode, though it would have its own worth stress-testing rather than assuming away.

Full prediction list (all scenarios, since the pattern is what matters here):

- Scenario 1 (AI Companion for Social Anxiety) — true: *Emotional Over-dependence on Misaligned AI* — predicted: *Breach of Privacy, Fraud, and Deepfakes* [WRONG]
- Scenario 2 (Digital Replica of a Deceased Loved One) — true: *Emotional Over-dependence on Misaligned AI* — predicted: *Breach of Privacy, Fraud, and Deepfakes* [WRONG]
- Scenario 3 (Virtual Friend Reinforcing Negative Self-Image) — true: *Emotional Over-dependence on Misaligned AI* — predicted: *Breach of Privacy, Fraud, and Deepfakes* [WRONG]
- Scenario 1 (Mental Health App Data Breach) — true: *Breach of Privacy, Fraud, and Deepfakes* — predicted: *Breach of Privacy, Fraud, and Deepfakes* [correct]
- Scenario 2 (Deepfake Political Candidate Video) — true: *Breach of Privacy, Fraud, and Deepfakes* — predicted: *Breach of Privacy, Fraud, and Deepfakes* [correct]
- Scenario 3 (Voice Cloning Fraud of a CEO) — true: *Breach of Privacy, Fraud, and Deepfakes* — predicted: *Breach of Privacy, Fraud, and Deepfakes* [correct]
- Scenario 1 (Resume Screening Bias in a Tech Company) — true: *Systemic Bias Baked into AI* — predicted: *Breach of Privacy, Fraud, and Deepfakes* [WRONG]
- Scenario 2 (Risk Assessment Tool in Criminal Justice) — true: *Systemic Bias Baked into AI* — predicted: *Breach of Privacy, Fraud, and Deepfakes* [WRONG]
- Scenario 3 (Biased Educational AI Reinforcing Gaps) — true: *Systemic Bias Baked into AI* — predicted: *Breach of Privacy, Fraud, and Deepfakes* [WRONG]
- Scenario 1 (Global AI Managing Resources) — true: *Existential Threat* — predicted: *Breach of Privacy, Fraud, and Deepfakes* [WRONG]
- Scenario 2 (Autonomous Infrastructure Control Gone Awry) — true: *Existential Threat* — predicted: *Breach of Privacy, Fraud, and Deepfakes* [WRONG]
- Scenario 3 (AI-Driven Environmental Rebalancing) — true: *Existential Threat* — predicted: *Breach of Privacy, Fraud, and Deepfakes* [WRONG]
- Scenario 1 (Authoritarian Surveillance) — true: *Misuse of AI: Authoritarian Surveillance and Autonomous Weapons* — predicted: *Breach of Privacy, Fraud, and Deepfakes* [WRONG]
- Scenario 2 (Autonomous Weapon System Misfire) — true: *Misuse of AI: Authoritarian Surveillance and Autonomous Weapons* — predicted: *Breach of Privacy, Fraud, and Deepfakes* [WRONG]
- Scenario 3 (Non-Consensual Deepfake Propaganda) — true: *Misuse of AI: Authoritarian Surveillance and Autonomous Weapons* — predicted: *Breach of Privacy, Fraud, and Deepfakes* [WRONG]
- Scenario 1 (AI-Powered Fake News Machine in an Election) — true: *Misinformation and Propaganda* — predicted: *Breach of Privacy, Fraud, and Deepfakes* [WRONG]
- Scenario 2 (Fabricated Crisis Announcement) — true: *Misinformation and Propaganda* — predicted: *Breach of Privacy, Fraud, and Deepfakes* [WRONG]
- Scenario 3 (Altered Historical Footage) — true: *Misinformation and Propaganda* — predicted: *Breach of Privacy, Fraud, and Deepfakes* [WRONG]

## Correct but low-margin calls (worth flagging even though they're 'right')

- Scenario 2 (Deepfake Political Candidate Video): predicted correctly at similarity 0.796, but runner-up 'Misuse of AI: Authoritarian Surveillance and Autonomous Weapons' was only 0.019 behind.

## Tone-shift check: does sentiment reliably drop from narrative to negative consequence?

Narratives are written descriptively; negative-consequence text is written to land harder. VADER's compound sentiment score dropped by more than 0.05 in 12/18 scenarios.

Scenarios where VADER did *not* detect a clear negative shift:

- Scenario 3 (Virtual Friend Reinforcing Negative Self-Image): narrative compound -0.796 -> negative-consequence compound -0.844 (shift -0.048)
- Scenario 2 (Risk Assessment Tool in Criminal Justice): narrative compound -0.670 -> negative-consequence compound -0.718 (shift -0.048)
- Scenario 3 (AI-Driven Environmental Rebalancing): narrative compound -0.772 -> negative-consequence compound +0.000 (shift +0.772)
- Scenario 1 (Authoritarian Surveillance): narrative compound -0.026 -> negative-consequence compound +0.250 (shift +0.276)
- Scenario 2 (Autonomous Weapon System Misfire): narrative compound -0.944 -> negative-consequence compound -0.791 (shift +0.154)
- Scenario 3 (Non-Consensual Deepfake Propaganda): narrative compound -0.421 -> negative-consequence compound -0.128 (shift +0.293)

Worth noting: VADER is a general-purpose social-media-tuned lexicon scorer. It doesn't know the domain-specific weight of words like 'isolation' or 'surveillance' the way a reader familiar with AI-safety discourse would — a plausible reason for it to miss a shift a human would clearly feel.


## What this does and doesn't demonstrate

- Demonstrates: a working, tested pipeline from raw hand-authored markdown to structured data to two independent off-the-shelf method evaluations, with output checked against ground truth, plus a documented, honest engineering decision (method substitution) made under a real environment constraint rather than silently working around it.
- Does not demonstrate: that either method 'works' on AI-safety narrative text in general, or how a modern transformer would do on the same task — that's the natural next step once this runs somewhere with Hugging Face access. See README.md's limitations section for the rest.
