import {
  bindQuestionCard,
  evaluateSingleChoice,
} from "../components/QuestionCard.js";
import { track, TRACK_EVENTS } from "../services/trackingService.js";

/** Estado vacío de pregunta de opción única (con contador de intentos). */
export function emptyQuizState() {
  return {
    selectedId: null,
    checked: false,
    status: null,
    message: "",
    attempt: 0,
  };
}

/**
 * Restaura quiz desde un gate persistido (completado = correct).
 * Conserva attempt si viene en activities.
 */
export function quizFromGate(done, correctMessage, activity = null) {
  if (activity && typeof activity === "object") {
    return {
      selectedId: activity.selectedId ?? null,
      checked: Boolean(activity.checked ?? done),
      status: activity.status ?? (done ? "correct" : null),
      message: activity.message ?? (done ? correctMessage : ""),
      attempt: Number(activity.attempt) || (done ? 1 : 0),
    };
  }
  return {
    ...emptyQuizState(),
    checked: Boolean(done),
    status: done ? "correct" : null,
    message: done ? correctMessage : "",
    attempt: done ? 1 : 0,
  };
}

/**
 * Enlaza QuestionCard con intentos progresivos, tracking y persistencia opcional.
 */
export function bindStandardQuiz({
  root,
  local,
  key,
  question,
  gateName,
  markGate,
  render,
  stageId,
  store,
  activityPrefix,
}) {
  const scope = root.querySelector(`[data-quiz="${key}"]`);
  if (!scope) return;

  const persist = () => {
    if (!store?.setActivity || !activityPrefix) return;
    const snap = local[key];
    store.setActivity(`${activityPrefix}.${key}`, {
      selectedId: snap.selectedId,
      checked: snap.checked,
      status: snap.status,
      message: snap.message,
      attempt: snap.attempt || 0,
    });
  };

  bindQuestionCard(scope, {
    onSelect(id) {
      if (local[key].checked) return;
      local[key].selectedId = id;
      render();
    },
    onCheck() {
      const attempt = (local[key].attempt || 0) + 1;
      const result = evaluateSingleChoice(question, local[key].selectedId, attempt);
      local[key].attempt = attempt;
      local[key].checked = true;
      local[key].status = result.status;
      local[key].message = result.message;
      track(TRACK_EVENTS.ACTIVITY_ATTEMPTED, {
        stageId,
        activityId: key,
        result: result.status,
        attempt,
      });
      if (result.status === "correct") {
        markGate(gateName, true);
        track(TRACK_EVENTS.ACTIVITY_COMPLETED, {
          stageId,
          activityId: key,
          result: "correct",
          attempt,
        });
      }
      persist();
      render();
    },
    onRetry() {
      const prevAttempt = local[key].attempt || 0;
      local[key] = { ...emptyQuizState(), attempt: prevAttempt };
      markGate(gateName, false);
      persist();
      render();
    },
  });
}
