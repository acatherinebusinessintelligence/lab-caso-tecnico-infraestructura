/**
 * Smoke tests (Node) — persistencia, puntuación, números, feedback.
 * Ejecutar: node --experimental-vm-modules _smoke_test.mjs
 * o con import maps vía python simulado abajo.
 */
import { createRequire } from "module";
import { pathToFileURL } from "url";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Minimal localStorage polyfill
const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
  clear: () => mem.clear(),
};

const root = pathToFileURL(path.join(__dirname, "src")).href;

const { parseLocaleNumber, validateNumericInput } = await import(
  `${root}/utils/numbers.js`
);
const { resolveAttemptFeedback } = await import(`${root}/utils/feedback.js`);
const { computeLabScore } = await import(`${root}/services/scoringService.js`);
const { track, getTrackBuffer, TRACK_EVENTS, clearTrackBuffer } = await import(
  `${root}/services/trackingService.js`
);
const { createStore } = await import(`${root}/state/progress.js`);
const { LAB_CONFIG, getStageStatus, STAGE_STATUS } = await import(
  `${root}/config/labConfig.js`
);

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    failed += 1;
    console.error("FAIL:", msg);
  } else {
    console.log("OK:", msg);
  }
}

// Numbers
assert(parseLocaleNumber("97,81") === 97.81, "parse coma decimal");
assert(parseLocaleNumber("97.81") === 97.81, "parse punto decimal");
assert(!validateNumericInput("abc").ok, "rechaza texto");
assert(!validateNumericInput("").ok, "rechaza vacío");
assert(validateNumericInput("50", { min: 0, max: 100 }).ok, "rango válido");

// Feedback progression
const q = {
  feedback: {
    correct: "Bien razonado.",
    incorrect: "Revisa evidencia.",
    hint2: "Pista 2.",
    full: "Explicación completa.",
  },
};
assert(
  resolveAttemptFeedback(q, "incorrect", 1) === "Revisa evidencia.",
  "intento 1 conceptual"
);
assert(
  resolveAttemptFeedback(q, "incorrect", 2).includes("Pista 2."),
  "intento 2 pista"
);
assert(
  resolveAttemptFeedback(q, "incorrect", 3).includes("Explicación completa."),
  "intento 3+ full"
);

// Tracking
clearTrackBuffer();
track(TRACK_EVENTS.LAB_STARTED, {});
assert(getTrackBuffer().length === 1, "tracking buffer");

// Store unlock chain + corrupt recovery
mem.clear();
let renders = 0;
const store = createStore(() => {
  renders += 1;
});
assert(store.getState().view === "welcome", "estado inicial welcome");
store.startPath();
assert(store.getState().view === "path", "ruta");
store.startStage1();
assert(getStageStatus(store.getState(), 1) === STAGE_STATUS.IN_PROGRESS, "etapa 1 in progress");
assert(getStageStatus(store.getState(), 2) === STAGE_STATUS.LOCKED, "etapa 2 locked");
store.completeStage1();
assert(store.getState().highestUnlocked === 2, "desbloquea etapa 2");
assert(store.getState().progressPercent === Math.round(100 / 6), "progreso parcial");

store.setActivity("s1.q1", { selectedId: "a", checked: true, status: "correct", attempt: 2 });
assert(store.getActivity("s1.q1").attempt === 2, "persist activity");

// Corrupt state
mem.set(LAB_CONFIG.storageKey, "{not-json");
const store2 = createStore(() => {});
assert(store2.getState().view === "welcome", "recupera estado corrupto");

mem.set(LAB_CONFIG.storageKey, JSON.stringify({ foo: 1 }));
const store3 = createStore(() => {});
assert(store3.getState().completedStages.length === 0, "estado inválido → default");

// Score vs progress
const scored = computeLabScore({
  stage6: { knowledge: { k1: true, k2: true, k3: true, k4: true, k5: true, k6: true, k7: true, k8: true } },
  finalScoreHistory: [],
});
assert(scored.finalAssessment.percent === 100, "eval 8/8 = 100");
assert(scored.weights.practiceWeight === 0, "práctica no penaliza");

const { isLabCompleted, isPassed, resolveReportedFinalScore } = await import(
  `${root}/services/scoringService.js`
);

const bestState = {
  labComplete: true,
  completedStages: [1, 2, 3, 4, 5, 6],
  stage6: { knowledge: { k1: true, k2: true, k3: true, k4: true, k5: false, k6: false, k7: false, k8: false } },
  finalScoreHistory: [
    { correct: 5, expected: 8, percent: 63, at: 1 },
    { correct: 7, expected: 8, percent: 88, at: 2 },
  ],
};
assert(resolveReportedFinalScore(bestState).correct === 7, "política best = 7/8");
assert(isLabCompleted(bestState), "completed con historial");
assert(isPassed(bestState), "passed con 7/8 y umbral 70");

const failState = {
  ...bestState,
  finalScoreHistory: [{ correct: 4, expected: 8, percent: 50, at: 1 }],
  stage6: { knowledge: { k1: true, k2: true, k3: true, k4: true, k5: false, k6: false, k7: false, k8: false } },
};
assert(isLabCompleted(failState), "completed aunque failed");
assert(!isPassed(failState), "4/8 no passed");

const incomplete = {
  labComplete: false,
  completedStages: [1, 2, 3, 4, 5, 6],
  stage6: { knowledge: {} },
  finalScoreHistory: [],
};
assert(!isLabCompleted(incomplete), "sin evaluación final no completed");

// Lab complete → 100%
const store4 = createStore(() => {});
store4.startPath();
for (let i = 1; i <= 6; i++) {
  // unlock sequentially
  if (i === 1) store4.startStage1();
  if (i === 2) store4.startStage2();
  if (i === 3) store4.startStage3();
  if (i === 4) store4.startStage4();
  if (i === 5) store4.startStage5();
  if (i === 6) store4.startStage6();
  if (i === 1) store4.completeStage1();
  if (i === 2) store4.completeStage2();
  if (i === 3) store4.completeStage3();
  if (i === 4) store4.completeStage4();
  if (i === 5) store4.completeStage5();
  if (i === 6) store4.completeStage6();
}
store4.completeLab();
assert(store4.getState().labComplete === true, "lab complete flag");
assert(store4.getState().progressPercent === 100, "progreso 100%");

// Reset
store4.resetAll();
assert(store4.getState().completedStages.length === 0, "reset limpia progreso");

console.log(failed === 0 ? "\nALL SMOKE TESTS PASSED" : `\n${failed} FAILURES`);
process.exit(failed === 0 ? 0 : 1);
