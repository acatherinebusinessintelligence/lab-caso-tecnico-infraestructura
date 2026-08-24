import { LAB_CONFIG } from "../config/labConfig.js";

/**
 * Capa de tracking desacoplada de localStorage / Moodle / xAPI.
 * Hoy: buffer en memoria (+ log opcional en debug).
 * Mañana: emitir a H5P / xAPI sin reescribir UI.
 */

const MAX_EVENTS = 200;
const buffer = [];
const listeners = new Set();

export const TRACK_EVENTS = {
  LAB_STARTED: "LAB_STARTED",
  STAGE_STARTED: "STAGE_STARTED",
  ACTIVITY_ATTEMPTED: "ACTIVITY_ATTEMPTED",
  ACTIVITY_COMPLETED: "ACTIVITY_COMPLETED",
  STAGE_COMPLETED: "STAGE_COMPLETED",
  FINAL_ASSESSMENT_COMPLETED: "FINAL_ASSESSMENT_COMPLETED",
  LAB_COMPLETED: "LAB_COMPLETED",
  LAB_RESET: "LAB_RESET",
};

/**
 * @param {string} eventName
 * @param {{ stageId?: number, activityId?: string, result?: string, score?: number, attempt?: number }} [payload]
 */
export function track(eventName, payload = {}) {
  const event = {
    eventName,
    timestamp: Date.now(),
    stageId: payload.stageId ?? null,
    activityId: payload.activityId ?? null,
    result: payload.result ?? null,
    score: payload.score ?? null,
    attempt: payload.attempt ?? null,
  };
  buffer.push(event);
  if (buffer.length > MAX_EVENTS) buffer.shift();
  if (LAB_CONFIG.debug && typeof console !== "undefined") {
    // eslint-disable-next-line no-console
    console.info("[lab-track]", event);
  }
  listeners.forEach((fn) => {
    try {
      fn(event);
    } catch {
      /* no romper UI */
    }
  });
  return event;
}

export function onTrack(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getTrackBuffer() {
  return [...buffer];
}

export function clearTrackBuffer() {
  buffer.length = 0;
}
