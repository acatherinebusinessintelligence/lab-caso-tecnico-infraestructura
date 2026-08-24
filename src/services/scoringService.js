import { LAB_CONFIG, RESULT_STATUS } from "../config/labConfig.js";

/**
 * Separa PROGRESO (recorrido) de PUNTUACIÓN (desempeño evaluable).
 */

export function computeFinalAssessmentScore(stage6 = {}) {
  const knowledge = stage6.knowledge || {};
  const ids = Object.keys(knowledge);
  const expected = LAB_CONFIG.assessment.finalQuestionCount;
  const correct = Object.values(knowledge).filter(Boolean).length;
  const answered = ids.length;
  const percent = expected > 0 ? Math.round((correct / expected) * 100) : 0;
  return {
    correct,
    answered,
    expected,
    percent,
    complete: answered >= expected,
  };
}

/**
 * Aplica política best | latest | first sobre el historial de intentos finales.
 */
export function resolveReportedFinalScore(state) {
  const expected = LAB_CONFIG.assessment.finalQuestionCount;
  const history = state.finalScoreHistory || [];
  const current = computeFinalAssessmentScore(state.stage6);
  const policy = LAB_CONFIG.assessment.scorePolicy || "best";

  if (!history.length && !current.complete) {
    return { correct: 0, expected, percent: 0, complete: false, policy };
  }

  let chosen = current.complete
    ? { correct: current.correct, expected, percent: current.percent, at: Date.now() }
    : null;

  if (history.length) {
    if (policy === "first") {
      chosen = history[0];
    } else if (policy === "latest") {
      chosen = history[history.length - 1];
    } else {
      // best
      const pool = chosen ? [...history, chosen] : history;
      chosen = pool.reduce((a, b) => (b.correct >= a.correct ? b : a));
    }
  }

  if (!chosen) {
    return { correct: 0, expected, percent: 0, complete: false, policy };
  }

  const percent = expected > 0 ? Math.round((chosen.correct / expected) * 100) : 0;
  return {
    correct: chosen.correct,
    expected,
    percent,
    complete: true,
    policy,
  };
}

export function computeLabScore(state) {
  const { practiceWeight, finalAssessmentWeight } = LAB_CONFIG.assessment;
  const final = resolveReportedFinalScore(state);
  const practiceScore = 0;
  const totalWeight = practiceWeight + finalAssessmentWeight || 100;
  const weighted =
    (practiceScore * practiceWeight + final.percent * finalAssessmentWeight) / totalWeight;
  return {
    practiceScore,
    finalAssessment: {
      ...computeFinalAssessmentScore(state.stage6),
      ...final,
    },
    overallPercent: Math.round(weighted),
    weights: { practiceWeight, finalAssessmentWeight },
    score: final.correct,
    maxScore: final.expected,
  };
}

/** ¿Recorrido + evaluación final + pantalla final? */
export function isLabCompleted(state) {
  const stagesOk =
    (state.completedStages || []).length >= LAB_CONFIG.totalStages &&
    [1, 2, 3, 4, 5, 6].every((n) => (state.completedStages || []).includes(n));
  const finalOk = resolveReportedFinalScore(state).complete;
  return Boolean(state.labComplete && stagesOk && finalOk);
}

export function isPassed(state) {
  if (!isLabCompleted(state)) return false;
  const { percent } = resolveReportedFinalScore(state);
  return percent >= (LAB_CONFIG.assessment.passingScorePercent ?? 70);
}

export function getResultStatus(state) {
  if (!state) return RESULT_STATUS.NOT_STARTED;
  if (isLabCompleted(state)) {
    return isPassed(state) ? RESULT_STATUS.PASSED : RESULT_STATUS.FAILED;
  }
  if ((state.completedStages || []).length || (state.view && state.view !== "welcome")) {
    return RESULT_STATUS.IN_PROGRESS;
  }
  return RESULT_STATUS.NOT_STARTED;
}

/** Contrato H5P Question type (parcial). */
export function getH5PScoreContract(state) {
  const score = computeLabScore(state);
  const completed = isLabCompleted(state);
  const passed = isPassed(state);
  return {
    score: score.score,
    maxScore: score.maxScore,
    percent: score.finalAssessment.percent,
    completed,
    passed,
    resultStatus: getResultStatus(state),
  };
}
