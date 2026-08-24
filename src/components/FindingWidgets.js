import { FeedbackPanel } from "./FeedbackPanel.js";

export function CriticalityBadge({ level }) {
  const map = {
    baja: { cls: "crit-baja", label: "BAJA" },
    media: { cls: "crit-media", label: "MEDIA" },
    alta: { cls: "crit-alta", label: "ALTA" },
    critica: { cls: "crit-critica", label: "CRÍTICA" },
  };
  const m = map[level] || map.media;
  return `<span class="crit-badge ${m.cls}">${m.label}</span>`;
}

export function FindingCard({ hallazgo, evidencia, impacto, criticidad, mutedRec = true }) {
  return `
    <article class="finding-card" aria-label="Hallazgo completo">
      <h3 class="finding-card__title">HALLAZGO COMPLETO</h3>
      <dl class="finding-card__dl">
        <dt>Hallazgo</dt><dd>${hallazgo || "—"}</dd>
        <dt>Evidencia</dt><dd>${evidencia || "—"}</dd>
        <dt>Impacto</dt><dd>${impacto || "—"}</dd>
        <dt>Criticidad</dt><dd>${criticidad || "—"}</dd>
        <dt class="${mutedRec ? "is-muted" : ""}">Recomendación</dt>
        <dd class="${mutedRec ? "is-muted" : ""}">Se desarrollará en la Etapa 6.</dd>
      </dl>
    </article>
  `;
}

export function DiagnosticMatrix() {
  return `
    <div class="diag-matrix" aria-label="Matriz de diagnóstico">
      <div class="diag-matrix__col"><strong>HALLAZGO</strong><span>Qué ocurre</span></div>
      <span class="diag-matrix__pipe" aria-hidden="true">|</span>
      <div class="diag-matrix__col"><strong>EVIDENCIA</strong><span>Qué lo demuestra</span></div>
      <span class="diag-matrix__pipe" aria-hidden="true">|</span>
      <div class="diag-matrix__col"><strong>IMPACTO</strong><span>Consecuencia</span></div>
      <span class="diag-matrix__pipe" aria-hidden="true">|</span>
      <div class="diag-matrix__col"><strong>CRITICIDAD</strong><span>Prioridad</span></div>
      <span class="diag-matrix__pipe" aria-hidden="true">|</span>
      <div class="diag-matrix__col is-muted"><strong>RECOMENDACIÓN</strong><span>Etapa 6</span></div>
    </div>
  `;
}

/**
 * Constructor paso a paso: Hallazgo → Evidencia → Impacto → Criticidad.
 */
export function FindingBuilder({ config, stepIndex, selections, stepFeedback, complete }) {
  const step = config.steps[stepIndex];
  if (complete) {
    const labels = Object.fromEntries(
      config.steps.map((s) => {
        const opt = s.options.find((o) => o.id === selections[s.id]);
        return [s.id, opt?.label || "—"];
      })
    );
    return FindingCard({
      hallazgo: labels.hallazgo,
      evidencia: labels.evidencia,
      impacto: labels.impacto,
      criticidad: labels.criticidad,
    });
  }

  return `
    <section class="finding-builder" aria-label="Constructor de hallazgo">
      <p class="meta-line"><strong>Datos:</strong> ${config.context}</p>
      <div class="finding-builder__progress">
        ${config.steps
          .map(
            (s, i) => `
          <span class="fb-step ${i === stepIndex ? "is-active" : ""} ${
            selections[s.id] ? "is-done" : ""
          }">${i + 1}. ${s.id}</span>`
          )
          .join("")}
      </div>
      <h3 class="h3">${step.title}</h3>
      <p>${step.prompt}</p>
      <ul class="option-list">
        ${step.options
          .map(
            (opt) => `
          <li>
            <button type="button" class="option-item ${
              selections[step.id] === opt.id ? "is-selected" : ""
            }" data-fb-opt="${opt.id}" ${stepFeedback?.checked ? "disabled" : ""}>
              <span>${opt.label}</span>
            </button>
          </li>`
          )
          .join("")}
      </ul>
      <div class="btn-row" style="justify-content:flex-start;">
        <button type="button" class="btn btn-primary" data-action="fb-check" ${
          !selections[step.id] || stepFeedback?.checked ? "disabled" : ""
        }>
          Confirmar
        </button>
      </div>
      ${FeedbackPanel({
        status: stepFeedback?.status,
        message: stepFeedback?.message,
        showRetry: stepFeedback?.checked && stepFeedback?.status !== "correct",
      })}
    </section>
  `;
}

export function evaluateBuilderStep(step, selectedId) {
  if (selectedId === step.correctId) {
    return {
      status: "correct",
      message: "Correcto. Continúa al siguiente elemento del hallazgo.",
    };
  }
  if (step.partialId && selectedId === step.partialId) {
    return {
      status: "incorrect",
      message:
        step.partialMessage ||
        "Estás proponiendo una solución o una afirmación no sustentada antes de completar el diagnóstico.",
    };
  }
  return {
    status: "incorrect",
    message:
      "Revisa si la opción anticipa una solución o no se sostiene con la evidencia disponible.",
  };
}

export function bindFindingBuilder(root, { onSelect, onCheck, onRetry }) {
  root.querySelectorAll("[data-fb-opt]").forEach((btn) => {
    btn.addEventListener("click", () => onSelect(btn.dataset.fbOpt));
  });
  root.querySelector('[data-action="fb-check"]')?.addEventListener("click", onCheck);
  root.querySelector('[data-action="retry"]')?.addEventListener("click", onRetry);
}

/** Mini caso: seleccionar hallazgos válidos (mínimo 3 correctos, sin incorrectos). */
export function MiniFindingsPicker({
  options,
  selected,
  checked,
  feedbackStatus,
  feedbackMessage,
}) {
  return `
    <section class="mini-findings" aria-label="Identificar hallazgos">
      <p class="lead">Selecciona al menos tres hallazgos sustentados (sin soluciones prematuras).</p>
      <ul class="option-list">
        ${options
          .map((opt) => {
            const on = selected.includes(opt.id);
            return `
              <li>
                <button type="button" class="option-item ${on ? "is-selected" : ""}" data-mf="${opt.id}" ${
                  checked ? "disabled" : ""
                } aria-pressed="${on}">
                  <span>${opt.label}</span>
                </button>
              </li>`;
          })
          .join("")}
      </ul>
      <div class="btn-row" style="justify-content:flex-start;">
        <button type="button" class="btn btn-primary" data-action="check-mf" ${
          selected.length < 3 || checked ? "disabled" : ""
        }>Comprobar hallazgos</button>
      </div>
      ${FeedbackPanel({
        status: feedbackStatus,
        message: feedbackMessage,
        showRetry: checked && feedbackStatus !== "correct",
      })}
    </section>
  `;
}

export function evaluateMiniFindings(options, selected) {
  const correctIds = options.filter((o) => o.correct).map((o) => o.id);
  const badIds = options.filter((o) => !o.correct).map((o) => o.id);
  const sel = new Set(selected);
  const good = correctIds.filter((id) => sel.has(id)).length;
  const bad = badIds.filter((id) => sel.has(id)).length;

  if (good >= 3 && bad === 0) {
    return {
      status: "correct",
      message:
        "Correcto. Identificaste hallazgos sustentados sin saltar a soluciones tecnológicas.",
    };
  }
  if (good >= 2 && bad === 0) {
    return {
      status: "partial",
      message: "Vas bien, pero necesitas al menos tres hallazgos sustentados.",
    };
  }
  if (bad > 0) {
    return {
      status: "incorrect",
      message:
        "Incluiste una solución prematura o una afirmación no sustentada. Quédate en el diagnóstico.",
    };
  }
  return {
    status: "incorrect",
    message: "Selecciona hallazgos basados en la evidencia del microcaso.",
  };
}

export function bindMiniFindings(root, { onToggle, onCheck, onRetry }) {
  root.querySelectorAll("[data-mf]").forEach((btn) => {
    btn.addEventListener("click", () => onToggle(btn.dataset.mf));
  });
  root.querySelector('[data-action="check-mf"]')?.addEventListener("click", onCheck);
  root.querySelector('[data-action="retry"]')?.addEventListener("click", onRetry);
}
