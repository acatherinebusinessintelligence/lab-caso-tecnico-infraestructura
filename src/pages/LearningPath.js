import { StageMap } from "../components/StageMap.js";

export function LearningPathPage(state = {}) {
  const unlocked2 = (state.highestUnlocked || 1) >= 2;
  const unlocked3 = (state.highestUnlocked || 1) >= 3;
  const unlocked4 = (state.highestUnlocked || 1) >= 4;
  const unlocked5 = (state.highestUnlocked || 1) >= 5;
  const unlocked6 = (state.highestUnlocked || 1) >= 6;
  const done1 = (state.completedStages || []).includes(1);
  const done2 = (state.completedStages || []).includes(2);
  const done3 = (state.completedStages || []).includes(3);
  const done4 = (state.completedStages || []).includes(4);
  const done5 = (state.completedStages || []).includes(5);
  const done6 = (state.completedStages || []).includes(6);
  const labDone = Boolean(state.labComplete);
  return `
    <section class="page" aria-labelledby="path-title">
      <article class="card card-pad">
        <p class="eyebrow">Mapa de ruta</p>
        <h1 class="h1" id="path-title">Tu ruta de análisis</h1>
        <p class="lead">
          Seis etapas para pasar del problema a una decisión defendible con evidencia.
        </p>
        ${
          labDone
            ? `<div class="complete-banner" style="margin-top:1rem;">
                 <p style="margin:0;"><strong>Laboratorio completado (100 %).</strong> Puedes revisar cualquier etapa.</p>
               </div>`
            : ""
        }
      </article>

      ${StageMap()}

      <div class="path-banner" role="note">
        <span class="path-banner__icon" aria-hidden="true">📋</span>
        <p>
          <strong>Recuerda:</strong>
          No busques una respuesta única. Busca una decisión que puedas defender técnicamente.
        </p>
      </div>

      <div class="btn-row">
        <button type="button" class="btn btn-secondary" data-action="back-welcome">
          ANTERIOR
        </button>
        <div style="display:flex;flex-wrap:wrap;gap:0.65rem;">
          <button type="button" class="btn btn-primary" data-action="start-stage1">
            ${done1 ? "REVISAR ETAPA 1" : "COMENZAR ETAPA 1"}
          </button>
          ${
            unlocked2
              ? `<button type="button" class="btn btn-primary" data-action="start-stage2">
                   ${done2 ? "REVISAR ETAPA 2" : "CONTINUAR ETAPA 2"}
                 </button>`
              : ""
          }
          ${
            unlocked3
              ? `<button type="button" class="btn btn-primary" data-action="start-stage3">
                   ${done3 ? "REVISAR ETAPA 3" : "CONTINUAR ETAPA 3"}
                 </button>`
              : ""
          }
          ${
            unlocked4
              ? `<button type="button" class="btn btn-primary" data-action="start-stage4">
                   ${done4 ? "REVISAR ETAPA 4" : "CONTINUAR ETAPA 4"}
                 </button>`
              : ""
          }
          ${
            unlocked5
              ? `<button type="button" class="btn btn-primary" data-action="start-stage5">
                   ${done5 ? "REVISAR ETAPA 5" : "CONTINUAR ETAPA 5"}
                 </button>`
              : ""
          }
          ${
            unlocked6
              ? `<button type="button" class="btn btn-cta" data-action="start-stage6">
                   ${labDone || done6 ? "REVISAR ETAPA 6" : "CONTINUAR ETAPA 6"}
                 </button>`
              : ""
          }
        </div>
      </div>
      <p class="meta-line" style="margin-top:1rem;">
        <button type="button" class="btn-link" data-action="open-reset">Reiniciar progreso</button>
        <span aria-hidden="true"> · </span>
        Acción secundaria. No borra datos de Moodle.
      </p>
    </section>
  `;
}

export function bindLearningPath(
  root,
  {
    onBack,
    onStartStage1,
    onStartStage2,
    onStartStage3,
    onStartStage4,
    onStartStage5,
    onStartStage6,
    onOpenReset,
  }
) {
  root.querySelector('[data-action="back-welcome"]')?.addEventListener("click", onBack);
  root.querySelector('[data-action="start-stage1"]')?.addEventListener("click", onStartStage1);
  root.querySelector('[data-action="start-stage2"]')?.addEventListener("click", onStartStage2);
  root.querySelector('[data-action="start-stage3"]')?.addEventListener("click", onStartStage3);
  root.querySelector('[data-action="start-stage4"]')?.addEventListener("click", onStartStage4);
  root.querySelector('[data-action="start-stage5"]')?.addEventListener("click", onStartStage5);
  root.querySelector('[data-action="start-stage6"]')?.addEventListener("click", onStartStage6);
  root.querySelector('[data-action="open-reset"]')?.addEventListener("click", onOpenReset);
}
