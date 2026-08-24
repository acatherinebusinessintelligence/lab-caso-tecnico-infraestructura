import { LAB_CONFIG } from "../config/labConfig.js";
import { TRACK_EVENTS } from "./trackingService.js";

/**
 * Puente tracking interno → xAPI vía H5P (cuando existe).
 * No incluye PII ni texto del caso del estudiante.
 */

function canUseH5P() {
  return typeof globalThis.H5P !== "undefined" && globalThis.H5P.XAPIEvent;
}

/**
 * @param {object} contentTypeInstance — instancia H5P (EventDispatcher)
 * @param {() => object} getScoreSnapshot
 */
export function attachXapiBridge(contentTypeInstance, getScoreSnapshot) {
  if (!contentTypeInstance) return () => {};

  const map = {
    [TRACK_EVENTS.LAB_STARTED]: () => triggerVerb(contentTypeInstance, "initialized"),
    [TRACK_EVENTS.ACTIVITY_ATTEMPTED]: (ev) =>
      triggerInteracted(contentTypeInstance, ev, getScoreSnapshot),
    [TRACK_EVENTS.ACTIVITY_COMPLETED]: (ev) =>
      triggerInteracted(contentTypeInstance, ev, getScoreSnapshot),
    [TRACK_EVENTS.STAGE_COMPLETED]: (ev) =>
      triggerProgressed(contentTypeInstance, ev, getScoreSnapshot),
    [TRACK_EVENTS.FINAL_ASSESSMENT_COMPLETED]: (ev) =>
      triggerAnswered(contentTypeInstance, ev, getScoreSnapshot),
    [TRACK_EVENTS.LAB_COMPLETED]: () => triggerCompleted(contentTypeInstance, getScoreSnapshot),
  };

  return function onInternalTrack(event) {
    if (!canUseH5P()) return;
    const fn = map[event.eventName];
    if (!fn) return;
    try {
      fn(event);
    } catch (err) {
      if (LAB_CONFIG.debug) {
        // eslint-disable-next-line no-console
        console.warn("[lab-xapi]", err);
      }
    }
  };
}

function baseEvent(instance, verb) {
  const xAPIEvent = instance.createXAPIEventTemplate
    ? instance.createXAPIEventTemplate(verb)
    : new globalThis.H5P.XAPIEvent();
  if (!instance.createXAPIEventTemplate && xAPIEvent.setVerb) {
    xAPIEvent.setVerb(verb);
  }
  return xAPIEvent;
}

function triggerVerb(instance, verb) {
  const ev = baseEvent(instance, verb);
  instance.trigger(ev);
}

function triggerInteracted(instance, internal, getScoreSnapshot) {
  const ev = baseEvent(instance, "interacted");
  const def = ev.data?.statement?.object?.definition;
  if (def) {
    def.extensions = def.extensions || {};
    def.extensions["https://h5p.org/x-api/h5p-local-content-id"] =
      instance.contentId ?? instance.id;
    if (internal.activityId) {
      def.extensions["https://uniminuto.edu/xapi/activityId"] = String(internal.activityId);
    }
    if (internal.stageId != null) {
      def.extensions["https://uniminuto.edu/xapi/stageId"] = Number(internal.stageId);
    }
  }
  instance.trigger(ev);
}

function triggerProgressed(instance, internal, getScoreSnapshot) {
  const snap = getScoreSnapshot?.() || {};
  const ev = baseEvent(instance, "progressed");
  if (ev.data?.statement) {
    ev.data.statement.result = ev.data.statement.result || {};
    ev.data.statement.result.extensions = {
      "https://uniminuto.edu/xapi/stageId": internal.stageId,
      "https://uniminuto.edu/xapi/progressPercent": snap.progressPercent ?? null,
    };
  }
  instance.trigger(ev);
}

function triggerAnswered(instance, internal, getScoreSnapshot) {
  const snap = getScoreSnapshot?.() || {};
  const ev = baseEvent(instance, "answered");
  if (ev.data?.statement) {
    ev.data.statement.result = {
      score: {
        min: 0,
        max: snap.maxScore ?? LAB_CONFIG.assessment.finalQuestionCount,
        raw: snap.score ?? 0,
      },
      success: Boolean(snap.passed),
      completion: Boolean(snap.completed),
      extensions: {
        "https://uniminuto.edu/xapi/attempt": internal.attempt ?? null,
      },
    };
  }
  instance.trigger(ev);
}

function triggerCompleted(instance, getScoreSnapshot) {
  const snap = getScoreSnapshot?.() || {};
  if (typeof instance.triggerXAPIScored === "function") {
    instance.triggerXAPIScored(
      snap.score ?? 0,
      snap.maxScore ?? LAB_CONFIG.assessment.finalQuestionCount,
      Boolean(snap.passed)
    );
    return;
  }
  const ev = baseEvent(instance, "completed");
  if (ev.data?.statement) {
    ev.data.statement.result = {
      score: {
        min: 0,
        max: snap.maxScore ?? 8,
        raw: snap.score ?? 0,
      },
      success: Boolean(snap.passed),
      completion: true,
    };
  }
  instance.trigger(ev);
}
