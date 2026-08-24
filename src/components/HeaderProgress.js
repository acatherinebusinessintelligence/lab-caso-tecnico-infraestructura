import { STAGES } from "../data/stages.js";
import { LAB_CONFIG, getStageStatus, STAGE_STATUS } from "../config/labConfig.js";

export function HeaderProgress({ state }) {
  const percent = state.progressPercent;
  const stage = state.currentStage;
  const score = state.labScore;

  return `
    <header class="header-progress" role="banner">
      <div class="header-progress__inner">
        <div class="header-progress__brand">
          <div>
            <p class="header-progress__title">${LAB_CONFIG.labName}</p>
            <p class="header-progress__subtitle">${LAB_CONFIG.labSubtitle}</p>
          </div>
          <div class="header-progress__meta" aria-live="polite">
            <div>Etapa ${stage} de ${LAB_CONFIG.totalStages}</div>
            <div title="Progreso del recorrido (no es nota académica)">Progreso ${percent} %</div>
            ${
              score?.finalAssessment?.answered
                ? `<div class="header-progress__score" title="Puntuación de evaluación (separada del progreso)">Eval. ${score.finalAssessment.percent} %</div>`
                : ""
            }
            ${
              state.labComplete
                ? '<div class="header-progress__status">Laboratorio completado</div>'
                : state.completedStages.includes(state.currentStage)
                  ? '<div class="header-progress__status">Etapa completada</div>'
                  : ""
            }
          </div>
        </div>
        <p class="header-progress__label">Ruta de análisis</p>
        <div
          class="progress-track"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="${percent}"
          aria-label="Avance del laboratorio: ${percent} por ciento"
        >
          <div class="progress-fill" style="width:${percent}%"></div>
        </div>
        <nav class="stage-rail" aria-label="Etapas del laboratorio">
          ${STAGES.map((s) => {
            const status = getStageStatus(state, s.id);
            const done = status === STAGE_STATUS.COMPLETED;
            const active = status === STAGE_STATUS.IN_PROGRESS;
            const locked = status === STAGE_STATUS.LOCKED;
            const clickable = !locked;
            const classes = [
              "stage-rail__item",
              active ? "is-active" : "",
              done ? "is-done" : "",
              locked ? "is-locked" : "",
              clickable ? "is-clickable" : "",
            ]
              .filter(Boolean)
              .join(" ");
            const statusLabel =
              status === STAGE_STATUS.LOCKED
                ? "bloqueada"
                : status === STAGE_STATUS.COMPLETED
                  ? "completada"
                  : status === STAGE_STATUS.IN_PROGRESS
                    ? "en curso"
                    : "disponible";
            return `
              <button
                type="button"
                class="${classes}"
                data-stage="${s.id}"
                ${locked ? 'disabled aria-disabled="true"' : ""}
                aria-current="${active ? "step" : "false"}"
                aria-label="Etapa ${s.id}: ${s.name} (${statusLabel})"
              >
                <span class="stage-rail__icon" aria-hidden="true">${done && !active ? "✓" : s.id}</span>
                <span class="stage-rail__name">${s.name}</span>
              </button>
            `;
          }).join("")}
        </nav>
      </div>
    </header>
  `;
}

export function bindHeaderProgress(root, { onGoStage }) {
  root.querySelectorAll("[data-stage]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      onGoStage(Number(btn.dataset.stage));
    });
  });
}
