import { LAB_CONFIG } from "../config/labConfig.js";
import { track, TRACK_EVENTS } from "../services/trackingService.js";
import {
  computeLabScore,
  computeFinalAssessmentScore,
  getH5PScoreContract,
} from "../services/scoringService.js";
import { storageAdapter } from "../services/storageAdapter.js";
import {
  createLocalStorageAdapter,
  resolvePersistence,
} from "../services/persistence/index.js";

const STORAGE_KEY = LAB_CONFIG.storageKey;

const defaultState = () => ({
  view: "welcome", // welcome | path | stage | stage2 | stage3 | stage4 | stage5 | stage6 | complete
  currentStage: 1,
  highestUnlocked: 1,
  completedStages: [],
  labComplete: false,
  storageVersion: LAB_CONFIG.storageVersion,
  activities: {},
  /** Historial de intentos de evaluación final (política best/latest/first). */
  finalScoreHistory: [],
  stage1Step: 0,
  stage2Step: 0,
  stage3Step: 0,
  stage4Step: 0,
  stage5Step: 0,
  stage6Step: 0,
  stage1: {
    q1: false,
    classify: false,
    q2: false,
    q3: false,
    checklist: {},
  },
  stage2: {
    qAsis: false,
    order: false,
    qInclude: false,
    qSpof1: false,
    qSpof2: false,
    qExternal: false,
    spofPicker: false,
    checklist: {},
  },
  stage3: {
    classify: false,
    qAvail: false,
    calcAvail: false,
    qMissing: false,
    qMttr: false,
    calcMttr: false,
    qMttrBetter: false,
    qMtbf: false,
    qCap: false,
    qPeak: false,
    calcGrowth: false,
    qWait: false,
    qJoint: false,
    qSlaDef: false,
    qSlaSame: false,
    dashboard: false,
    checklist: {},
    checkpoint: {},
  },
  stage4: {
    classify: false,
    evidence: false,
    findingComplete: false,
    qStrong: false,
    qImpact: false,
    critOrder: false,
    catClassify: false,
    qInsufficient: false,
    builder: false,
    qGap: false,
    mini: false,
    chain: false,
    checklist: {},
  },
  stage5: {
    classifyFw: false,
    incProb: false,
    qChange: false,
    itilBuilder: false,
    qAlerts: false,
    govMgmt: false,
    qCobit: false,
    cobitBuilder: false,
    threatVuln: false,
    isoBuilder: false,
    qVuln: false,
    qThreat: false,
    chooseFw: false,
    multiSeen: false,
    miniItil: false,
    miniCobit: false,
    miniIso: false,
    checklist: {},
    checkpoint: {},
  },
  stage6: {
    qCpu: false,
    qWeak: false,
    qOnprem: false,
    qCloud: false,
    qHybrid: false,
    qEdge: false,
    compareSeen: false,
    qBest: false,
    qRisk: false,
    capex: false,
    qCapexPeak: false,
    qMetric: false,
    qPriority: false,
    decisionBuilder: false,
    chain: false,
    miniCap: false,
    miniAvail: false,
    miniMon: false,
    qBefore: false,
    checklist: {},
    finalChecklist: {},
    knowledge: {},
  },
});

function migrateView(view) {
  if (view === "stage2-soon") return "stage2";
  if (view === "stage3-soon") return "stage3";
  if (view === "stage4-soon") return "stage4";
  if (view === "stage5-soon") return "stage5";
  if (view === "stage6-soon") return "stage6";
  return view || "welcome";
}

function migrateFrom(rawKey) {
  const legacy = storageAdapter.get(rawKey);
  if (!legacy) return null;
  try {
    const old = JSON.parse(legacy);
    const base = defaultState();
    return {
      ...base,
      ...old,
      stage1: { ...base.stage1, ...(old.stage1 || {}) },
      stage2: { ...base.stage2, ...(old.stage2 || {}) },
      stage3: {
        ...base.stage3,
        ...(old.stage3 || {}),
        checklist: { ...base.stage3.checklist, ...(old.stage3?.checklist || {}) },
        checkpoint: { ...base.stage3.checkpoint, ...(old.stage3?.checkpoint || {}) },
      },
      stage4: {
        ...base.stage4,
        ...(old.stage4 || {}),
        checklist: { ...base.stage4.checklist, ...(old.stage4?.checklist || {}) },
      },
      stage5: {
        ...base.stage5,
        ...(old.stage5 || {}),
        checklist: { ...base.stage5.checklist, ...(old.stage5?.checklist || {}) },
        checkpoint: { ...base.stage5.checkpoint, ...(old.stage5?.checkpoint || {}) },
      },
      stage6: { ...base.stage6 },
      view: migrateView(old.view),
    };
  } catch {
    return null;
  }
}

function isValidState(parsed) {
  return (
    parsed &&
    typeof parsed === "object" &&
    Array.isArray(parsed.completedStages) &&
    typeof parsed.highestUnlocked === "number"
  );
}

function mergeParsed(parsed) {
  const base = defaultState();
  return {
    ...base,
    ...parsed,
    storageVersion: LAB_CONFIG.storageVersion,
    stage1: { ...base.stage1, ...(parsed.stage1 || {}) },
    stage2: { ...base.stage2, ...(parsed.stage2 || {}) },
    stage3: {
      ...base.stage3,
      ...(parsed.stage3 || {}),
      checklist: { ...base.stage3.checklist, ...(parsed.stage3?.checklist || {}) },
      checkpoint: { ...base.stage3.checkpoint, ...(parsed.stage3?.checkpoint || {}) },
    },
    stage4: {
      ...base.stage4,
      ...(parsed.stage4 || {}),
      checklist: { ...base.stage4.checklist, ...(parsed.stage4?.checklist || {}) },
    },
    stage5: {
      ...base.stage5,
      ...(parsed.stage5 || {}),
      checklist: { ...base.stage5.checklist, ...(parsed.stage5?.checklist || {}) },
      checkpoint: { ...base.stage5.checkpoint, ...(parsed.stage5?.checkpoint || {}) },
    },
    stage6: {
      ...base.stage6,
      ...(parsed.stage6 || {}),
      checklist: { ...base.stage6.checklist, ...(parsed.stage6?.checklist || {}) },
      finalChecklist: {
        ...base.stage6.finalChecklist,
        ...(parsed.stage6?.finalChecklist || {}),
      },
      knowledge: { ...base.stage6.knowledge, ...(parsed.stage6?.knowledge || {}) },
    },
    completedStages: (parsed.completedStages || []).filter(
      (n) => Number.isInteger(n) && n >= 1 && n <= LAB_CONFIG.totalStages
    ),
    activities:
      parsed.activities && typeof parsed.activities === "object" ? parsed.activities : {},
    finalScoreHistory: Array.isArray(parsed.finalScoreHistory)
      ? parsed.finalScoreHistory
      : [],
  };
}

function readWith(persistence) {
  try {
    const raw = persistence.get();
    if (!raw) {
      if (persistence.kind === "localStorage") {
        return (
          migrateFrom("lab-infra-caso-tecnico-v6") ||
          migrateFrom("lab-infra-caso-tecnico-v5") ||
          migrateFrom("lab-infra-caso-tecnico-v4") ||
          migrateFrom("lab-infra-caso-tecnico-v3") ||
          migrateFrom("lab-infra-caso-tecnico-v2") ||
          defaultState()
        );
      }
      return defaultState();
    }
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!isValidState(parsed)) return defaultState();
    return mergeParsed(parsed);
  } catch {
    return defaultState();
  }
}

/**
 * @param {() => void} onChange
 * @param {{ persistence?: object, previousState?: object, preferH5P?: boolean }} [options]
 */
export function createStore(onChange, options = {}) {
  const persistence =
    options.persistence ||
    resolvePersistence({
      preferH5P: Boolean(options.preferH5P),
      previousState: options.previousState ?? null,
      storageKey: STORAGE_KEY,
    }) ||
    createLocalStorageAdapter(STORAGE_KEY);

  let state = readWith(persistence);
  if (options.previousState && isValidState(options.previousState)) {
    state = mergeParsed(options.previousState);
    if (typeof persistence.seed === "function") persistence.seed(state);
  }

  const write = (s) => {
    try {
      persistence.set(JSON.stringify(s));
    } catch {
      /* ignore */
    }
  };

  const notify = () => {
    write(state);
    onChange(getState());
  };

  const getState = () => ({
    ...state,
    progressPercent: state.labComplete
      ? 100
      : Math.round((state.completedStages.length / LAB_CONFIG.totalStages) * 100),
    stage1Complete: state.completedStages.includes(1),
    stage2Complete: state.completedStages.includes(2),
    stage3Complete: state.completedStages.includes(3),
    stage4Complete: state.completedStages.includes(4),
    stage5Complete: state.completedStages.includes(5),
    stage6Complete: state.completedStages.includes(6),
    labScore: computeLabScore(state),
    h5pScore: getH5PScoreContract(state),
  });

  return {
    getState,
    getPersistence: () => persistence,
    getSerializableState: () => ({ ...state }),
    setView(view) {
      state = { ...state, view };
      notify();
    },
    startPath() {
      state = { ...state, view: "path" };
      track(TRACK_EVENTS.LAB_STARTED, {});
      notify();
    },
    startStage1() {
      state = { ...state, view: "stage", currentStage: 1 };
      track(TRACK_EVENTS.STAGE_STARTED, { stageId: 1 });
      notify();
    },
    startStage2() {
      state = { ...state, view: "stage2", currentStage: 2 };
      track(TRACK_EVENTS.STAGE_STARTED, { stageId: 2 });
      notify();
    },
    startStage3() {
      state = { ...state, view: "stage3", currentStage: 3 };
      track(TRACK_EVENTS.STAGE_STARTED, { stageId: 3 });
      notify();
    },
    startStage4() {
      state = { ...state, view: "stage4", currentStage: 4 };
      track(TRACK_EVENTS.STAGE_STARTED, { stageId: 4 });
      notify();
    },
    startStage5() {
      state = { ...state, view: "stage5", currentStage: 5 };
      track(TRACK_EVENTS.STAGE_STARTED, { stageId: 5 });
      notify();
    },
    startStage6() {
      state = { ...state, view: "stage6", currentStage: 6 };
      track(TRACK_EVENTS.STAGE_STARTED, { stageId: 6 });
      notify();
    },
    goToStage(stageId) {
      if (stageId > state.highestUnlocked) return;
      if (stageId === 1) state = { ...state, view: "stage", currentStage: 1 };
      else if (stageId === 2) state = { ...state, view: "stage2", currentStage: 2 };
      else if (stageId === 3) state = { ...state, view: "stage3", currentStage: 3 };
      else if (stageId === 4) state = { ...state, view: "stage4", currentStage: 4 };
      else if (stageId === 5) state = { ...state, view: "stage5", currentStage: 5 };
      else if (stageId === 6) state = { ...state, view: "stage6", currentStage: 6 };
      notify();
    },
    setStage1Step(step) {
      state = { ...state, stage1Step: step, currentStage: 1, view: "stage" };
      notify();
    },
    setStage2Step(step) {
      state = { ...state, stage2Step: step, currentStage: 2, view: "stage2" };
      notify();
    },
    setStage3Step(step) {
      state = { ...state, stage3Step: step, currentStage: 3, view: "stage3" };
      notify();
    },
    setStage4Step(step) {
      state = { ...state, stage4Step: step, currentStage: 4, view: "stage4" };
      notify();
    },
    setStage5Step(step) {
      state = { ...state, stage5Step: step, currentStage: 5, view: "stage5" };
      notify();
    },
    setStage6Step(step) {
      state = { ...state, stage6Step: step, currentStage: 6, view: "stage6" };
      notify();
    },
    markStage1Gate(gate, value = true) {
      state = { ...state, stage1: { ...state.stage1, [gate]: value } };
      notify();
    },
    markStage2Gate(gate, value = true) {
      state = { ...state, stage2: { ...state.stage2, [gate]: value } };
      notify();
    },
    markStage3Gate(gate, value = true) {
      state = { ...state, stage3: { ...state.stage3, [gate]: value } };
      notify();
    },
    markStage3Checkpoint(id, value = true) {
      state = {
        ...state,
        stage3: {
          ...state.stage3,
          checkpoint: { ...state.stage3.checkpoint, [id]: value },
        },
      };
      notify();
    },
    markStage4Gate(gate, value = true) {
      state = { ...state, stage4: { ...state.stage4, [gate]: value } };
      notify();
    },
    markStage5Gate(gate, value = true) {
      state = { ...state, stage5: { ...state.stage5, [gate]: value } };
      notify();
    },
    markStage5Checkpoint(id, value = true) {
      state = {
        ...state,
        stage5: {
          ...state.stage5,
          checkpoint: { ...state.stage5.checkpoint, [id]: value },
        },
      };
      notify();
    },
    setChecklistItem(id, checked) {
      state = {
        ...state,
        stage1: {
          ...state.stage1,
          checklist: { ...state.stage1.checklist, [id]: checked },
        },
      };
      notify();
    },
    setStage2ChecklistItem(id, checked) {
      state = {
        ...state,
        stage2: {
          ...state.stage2,
          checklist: { ...state.stage2.checklist, [id]: checked },
        },
      };
      notify();
    },
    setStage3ChecklistItem(id, checked) {
      state = {
        ...state,
        stage3: {
          ...state.stage3,
          checklist: { ...state.stage3.checklist, [id]: checked },
        },
      };
      notify();
    },
    setStage4ChecklistItem(id, checked) {
      state = {
        ...state,
        stage4: {
          ...state.stage4,
          checklist: { ...state.stage4.checklist, [id]: checked },
        },
      };
      notify();
    },
    setStage5ChecklistItem(id, checked) {
      state = {
        ...state,
        stage5: {
          ...state.stage5,
          checklist: { ...state.stage5.checklist, [id]: checked },
        },
      };
      notify();
    },
    markStage6Gate(gate, value = true) {
      state = { ...state, stage6: { ...state.stage6, [gate]: value } };
      notify();
    },
    markStage6Knowledge(id, value = true) {
      state = {
        ...state,
        stage6: {
          ...state.stage6,
          knowledge: { ...state.stage6.knowledge, [id]: value },
        },
      };
      notify();
    },
    setStage6ChecklistItem(id, checked) {
      state = {
        ...state,
        stage6: {
          ...state.stage6,
          checklist: { ...state.stage6.checklist, [id]: checked },
        },
      };
      notify();
    },
    setStage6FinalChecklistItem(id, checked) {
      state = {
        ...state,
        stage6: {
          ...state.stage6,
          finalChecklist: { ...state.stage6.finalChecklist, [id]: checked },
        },
      };
      notify();
    },
    setActivity(activityId, data) {
      state = {
        ...state,
        activities: {
          ...(state.activities || {}),
          [activityId]: { ...(data || {}), updatedAt: Date.now() },
        },
      };
      write(state);
    },
    getActivity(activityId) {
      return (state.activities || {})[activityId] || null;
    },
    completeStage1() {
      const completed = new Set(state.completedStages);
      completed.add(1);
      state = {
        ...state,
        completedStages: [...completed].sort((a, b) => a - b),
        highestUnlocked: Math.max(state.highestUnlocked, 2),
        currentStage: 1,
      };
      track(TRACK_EVENTS.STAGE_COMPLETED, { stageId: 1 });
      notify();
    },
    completeStage2() {
      const completed = new Set(state.completedStages);
      completed.add(2);
      state = {
        ...state,
        completedStages: [...completed].sort((a, b) => a - b),
        highestUnlocked: Math.max(state.highestUnlocked, 3),
        currentStage: 2,
      };
      track(TRACK_EVENTS.STAGE_COMPLETED, { stageId: 2 });
      notify();
    },
    completeStage3() {
      const completed = new Set(state.completedStages);
      completed.add(3);
      state = {
        ...state,
        completedStages: [...completed].sort((a, b) => a - b),
        highestUnlocked: Math.max(state.highestUnlocked, 4),
        currentStage: 3,
      };
      track(TRACK_EVENTS.STAGE_COMPLETED, { stageId: 3 });
      notify();
    },
    completeStage4() {
      const completed = new Set(state.completedStages);
      completed.add(4);
      state = {
        ...state,
        completedStages: [...completed].sort((a, b) => a - b),
        highestUnlocked: Math.max(state.highestUnlocked, 5),
        currentStage: 4,
      };
      track(TRACK_EVENTS.STAGE_COMPLETED, { stageId: 4 });
      notify();
    },
    completeStage5() {
      const completed = new Set(state.completedStages);
      completed.add(5);
      state = {
        ...state,
        completedStages: [...completed].sort((a, b) => a - b),
        highestUnlocked: Math.max(state.highestUnlocked, 6),
        currentStage: 5,
      };
      track(TRACK_EVENTS.STAGE_COMPLETED, { stageId: 5 });
      notify();
    },
    completeStage6() {
      const completed = new Set(state.completedStages);
      completed.add(6);
      state = {
        ...state,
        completedStages: [...completed].sort((a, b) => a - b),
        highestUnlocked: Math.max(state.highestUnlocked, 6),
        currentStage: 6,
      };
      track(TRACK_EVENTS.STAGE_COMPLETED, { stageId: 6 });
      track(TRACK_EVENTS.FINAL_ASSESSMENT_COMPLETED, {
        stageId: 6,
        score: computeLabScore(state).finalAssessment.percent,
      });
      notify();
    },
    completeLab() {
      const completed = new Set(state.completedStages);
      completed.add(6);
      const snap = computeFinalAssessmentScore(state.stage6);
      const entry = {
        correct: snap.correct,
        expected: snap.expected,
        percent: snap.percent,
        at: Date.now(),
      };
      const history = [...(state.finalScoreHistory || []), entry];
      state = {
        ...state,
        completedStages: [...completed].sort((a, b) => a - b),
        highestUnlocked: 6,
        labComplete: true,
        currentStage: 6,
        view: "stage6",
        finalScoreHistory: history,
      };
      track(TRACK_EVENTS.LAB_COMPLETED, {
        score: computeLabScore(state).overallPercent,
      });
      notify();
    },
    /** Registra un intento de evaluación final (reintento) sin forzar completed. */
    recordFinalAttempt() {
      const snap = computeFinalAssessmentScore(state.stage6);
      if (!snap.complete) return;
      const entry = {
        correct: snap.correct,
        expected: snap.expected,
        percent: snap.percent,
        at: Date.now(),
      };
      state = {
        ...state,
        finalScoreHistory: [...(state.finalScoreHistory || []), entry],
      };
      notify();
    },
    resetAll() {
      state = defaultState();
      track(TRACK_EVENTS.LAB_RESET, {});
      notify();
    },
  };
}
