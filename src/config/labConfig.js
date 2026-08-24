/** Configuración central del laboratorio (local + Moodle/H5P). */

export const LAB_CONFIG = {
  storageKey: "lab-infra-caso-tecnico-v7",
  storageVersion: 7,
  labName: "GESTIÓN DE LA INFRAESTRUCTURA",
  labSubtitle: "Laboratorio de análisis del Caso Técnico",
  welcomeTitle: "¿Cómo analizar un caso de infraestructura TI?",
  durationHint: "25 - 35 minutos",
  totalStages: 6,
  /** Modo desarrollo: logs técnicos. */
  debug: false,
  assessment: {
    practiceWeight: 0,
    finalAssessmentWeight: 100,
    finalQuestionCount: 8,
    /** Umbral opcional de aprobación (passed ≠ completed). */
    passingScorePercent: 70,
    allowFinalAssessmentRetry: true,
    /** best | latest | first */
    scorePolicy: "best",
  },
  completion: {
    closingTitle: "ESTÁS LISTO PARA ANALIZAR TU CASO",
    closingMessage:
      "No necesitas encontrar una respuesta única. Necesitas construir una decisión que puedas defender técnicamente.",
  },
  stageViews: {
    1: "stage",
    2: "stage2",
    3: "stage3",
    4: "stage4",
    5: "stage5",
    6: "stage6",
  },
};

export const RESULT_STATUS = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  PASSED: "PASSED",
  FAILED: "FAILED",
};

export const STAGE_STATUS = {
  LOCKED: "LOCKED",
  AVAILABLE: "AVAILABLE",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
};

export function getStageStatus(state, stageId) {
  if ((state.completedStages || []).includes(stageId)) return STAGE_STATUS.COMPLETED;
  if (stageId > (state.highestUnlocked || 1)) return STAGE_STATUS.LOCKED;
  if (state.currentStage === stageId && state.view !== "welcome" && state.view !== "path") {
    return STAGE_STATUS.IN_PROGRESS;
  }
  return STAGE_STATUS.AVAILABLE;
}

/**
 * Aplica parámetros editables de H5P/semantics sin tocar pedagogía embebida.
 * @param {Record<string, unknown>} params
 */
export function applyH5PParams(params = {}) {
  const g = params.general || {};
  if (g.labName) LAB_CONFIG.labName = g.labName;
  if (g.labSubtitle) LAB_CONFIG.labSubtitle = g.labSubtitle;
  if (g.welcomeTitle) LAB_CONFIG.welcomeTitle = g.welcomeTitle;
  if (g.durationHint) LAB_CONFIG.durationHint = g.durationHint;

  const a = params.assessment || {};
  if (typeof a.practiceWeight === "number") LAB_CONFIG.assessment.practiceWeight = a.practiceWeight;
  if (typeof a.finalAssessmentWeight === "number") {
    LAB_CONFIG.assessment.finalAssessmentWeight = a.finalAssessmentWeight;
  }
  if (typeof a.passingScorePercent === "number") {
    LAB_CONFIG.assessment.passingScorePercent = a.passingScorePercent;
  }
  if (typeof a.allowFinalAssessmentRetry === "boolean") {
    LAB_CONFIG.assessment.allowFinalAssessmentRetry = a.allowFinalAssessmentRetry;
  }
  if (a.scorePolicy) LAB_CONFIG.assessment.scorePolicy = a.scorePolicy;

  const c = params.completion || {};
  if (c.closingTitle) LAB_CONFIG.completion.closingTitle = c.closingTitle;
  if (c.closingMessage) LAB_CONFIG.completion.closingMessage = c.closingMessage;

  if (params.appearance?.debugMode === true) LAB_CONFIG.debug = true;
  LAB_CONFIG._showDesignReference = params.appearance?.showDesignReference === true;

  return LAB_CONFIG;
}
