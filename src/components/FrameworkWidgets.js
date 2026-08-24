import { FeedbackPanel } from "./FeedbackPanel.js";

export function FrameworkCard({ card }) {
  return `
    <article class="fw-card ${card.theme}" aria-label="${card.name}">
      <div class="fw-card__icon" aria-hidden="true">${card.icon}</div>
      <h3 class="fw-card__name">${card.name}</h3>
      <p class="fw-card__question">${card.question}</p>
      <ul class="fw-card__keywords">
        ${card.keywords.map((k) => `<li>${k}</li>`).join("")}
      </ul>
    </article>
  `;
}

export function FrameworkComparison({ rows }) {
  return `
    <div class="fw-compare" role="table" aria-label="Comparación de marcos">
      <div class="fw-compare__head" role="row">
        <span role="columnheader">Pregunta</span>
        <span role="columnheader">Perspectiva</span>
      </div>
      ${rows
        .map(
          (r) => `
        <div class="fw-compare__row" role="row">
          <span role="cell">${r.q}</span>
          <span role="cell" class="fw-compare__fw">${r.fw}</span>
        </div>`
        )
        .join("")}
    </div>
  `;
}

/**
 * Constructor genérico en cadena (ITIL / COBIT / ISO).
 */
export function AnalysisChainBuilder({
  config,
  stepIndex,
  selections,
  stepFeedback,
  complete,
}) {
  if (complete) {
    const labels = Object.fromEntries(
      config.steps.map((s) => {
        const opt = s.options.find((o) => o.id === selections[s.id]);
        return [s.id, opt?.label || "—"];
      })
    );
    return `
      <article class="analysis-card ${config.theme}" aria-label="${config.cardTitle}">
        <h3 class="analysis-card__title">${config.cardTitle}</h3>
        <dl class="analysis-card__dl">
          ${config.steps
            .map(
              (s) => `
            <dt>${s.title.replace(/^\d+\.\s*/, "")}</dt>
            <dd>${labels[s.id]}</dd>`
            )
            .join("")}
        </dl>
      </article>
    `;
  }

  const step = config.steps[stepIndex];
  return `
    <section class="analysis-builder ${config.theme}" aria-label="${config.title}">
      <p class="analysis-builder__title"><strong>${config.title}</strong></p>
      <p class="meta-line"><strong>Contexto:</strong> ${config.context}</p>
      <div class="finding-builder__progress">
        ${config.steps
          .map(
            (s, i) => `
          <span class="fb-step ${i === stepIndex ? "is-active" : ""} ${
            selections[s.id] ? "is-done" : ""
          }">${i + 1}</span>`
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
            }" data-ab-opt="${opt.id}" ${stepFeedback?.checked ? "disabled" : ""}>
              <span>${opt.label}</span>
            </button>
          </li>`
          )
          .join("")}
      </ul>
      <div class="btn-row" style="justify-content:flex-start;">
        <button type="button" class="btn btn-primary" data-action="ab-check" ${
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

export function evaluateAnalysisStep(step, selectedId) {
  if (selectedId === step.correctId || selectedId === step.altCorrectId) {
    return {
      status: "correct",
      message: "Correcto. Continúa al siguiente elemento del análisis.",
    };
  }
  if (step.partialId && selectedId === step.partialId) {
    return {
      status: step.partialStatus || "partial",
      message:
        step.partialMessage ||
        "Parcial. Revisa si estás mezclando perspectivas o anticipando una solución.",
    };
  }
  return {
    status: "incorrect",
    message:
      "Revisa la opción. Debe responder a la pregunta del marco sin saltar a soluciones ajenas.",
  };
}

export function bindAnalysisBuilder(root, { onSelect, onCheck, onRetry }) {
  root.querySelectorAll("[data-ab-opt]").forEach((btn) => {
    btn.addEventListener("click", () => onSelect(btn.dataset.abOpt));
  });
  root.querySelector('[data-action="ab-check"]')?.addEventListener("click", onCheck);
  root.querySelector('[data-action="retry"]')?.addEventListener("click", onRetry);
}

/** Checkpoint: elegir marco (ITIL / COBIT / ISO). */
export function FrameworkQuickPick({
  items,
  answers,
  feedback,
}) {
  return `
    <section class="fw-quick" aria-label="Checkpoint de marcos">
      ${items
        .map((item) => {
          const st = answers[item.id] || {};
          return `
            <div class="fw-quick__item" data-fq="${item.id}">
              <p><strong>${item.prompt}</strong></p>
              <div class="btn-row" style="justify-content:flex-start;">
                <button type="button" class="btn btn-secondary fw-btn-itil ${
                  st.selectedId === "itil" ? "is-selected-opt" : ""
                }" data-fq-ans="itil" data-fq-id="${item.id}" ${st.checked ? "disabled" : ""}>ITIL</button>
                <button type="button" class="btn btn-secondary fw-btn-cobit ${
                  st.selectedId === "cobit" ? "is-selected-opt" : ""
                }" data-fq-ans="cobit" data-fq-id="${item.id}" ${st.checked ? "disabled" : ""}>COBIT</button>
                <button type="button" class="btn btn-secondary fw-btn-iso ${
                  st.selectedId === "iso" ? "is-selected-opt" : ""
                }" data-fq-ans="iso" data-fq-id="${item.id}" ${st.checked ? "disabled" : ""}>ISO 27001</button>
              </div>
              ${
                st.checked
                  ? `<div class="feedback-panel is-${st.status}" role="status">
                       <p class="feedback-panel__message">${
                         st.status === "correct"
                           ? "Correcto."
                           : "Revisa qué pregunta responde mejor cada marco."
                       }</p>
                       ${
                         st.status !== "correct"
                           ? `<div class="feedback-panel__actions">
                                <button type="button" class="btn btn-secondary" data-fq-retry="${item.id}">↻ INTENTAR NUEVAMENTE</button>
                              </div>`
                           : ""
                       }
                     </div>`
                  : ""
              }
            </div>`;
        })
        .join("")}
      ${feedback || ""}
    </section>
  `;
}

export function bindFrameworkQuickPick(root, { onAnswer, onRetry }) {
  root.querySelectorAll("[data-fq-ans]").forEach((btn) => {
    btn.addEventListener("click", () => onAnswer(btn.dataset.fqId, btn.dataset.fqAns));
  });
  root.querySelectorAll("[data-fq-retry]").forEach((btn) => {
    btn.addEventListener("click", () => onRetry(btn.dataset.fqRetry));
  });
}
