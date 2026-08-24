import { FeedbackPanel } from "./FeedbackPanel.js";

/** Selección múltiple de evidencia relevante. */
export function EvidenceSelector({
  options,
  selected,
  checked,
  feedbackStatus,
  feedbackMessage,
  prompt,
}) {
  return `
    <section class="evidence-selector" aria-label="Seleccionar evidencia">
      ${prompt ? `<p class="lead" style="margin-bottom:0.75rem;">${prompt}</p>` : ""}
      <ul class="option-list" role="group">
        ${options
          .map((opt) => {
            const on = selected.includes(opt.id);
            return `
              <li>
                <button
                  type="button"
                  class="option-item ${on ? "is-selected" : ""} ${
                    checked
                      ? opt.relevant
                        ? on
                          ? "is-evidence-ok"
                          : "is-evidence-miss"
                        : on
                          ? "is-evidence-bad"
                          : ""
                      : ""
                  }"
                  data-evid="${opt.id}"
                  aria-pressed="${on ? "true" : "false"}"
                  ${checked ? "disabled" : ""}
                >
                  <span class="option-key" aria-hidden="true">${opt.id.toUpperCase()}</span>
                  <span>${opt.label}</span>
                </button>
              </li>`;
          })
          .join("")}
      </ul>
      <div class="btn-row" style="justify-content:flex-start;margin-top:0.75rem;">
        <button type="button" class="btn btn-primary" data-action="check-evidence" ${
          !selected.length || checked ? "disabled" : ""
        }>
          Comprobar selección
        </button>
      </div>
      ${FeedbackPanel({
        status: feedbackStatus,
        message: feedbackMessage,
        showRetry: checked && feedbackStatus !== "correct",
      })}
    </section>
  `;
}

export function evaluateEvidence(options, selected) {
  const relevant = options.filter((o) => o.relevant).map((o) => o.id);
  const irrelevant = options.filter((o) => !o.relevant).map((o) => o.id);
  const sel = new Set(selected);
  const hitRelevant = relevant.filter((id) => sel.has(id)).length;
  const hitBad = irrelevant.filter((id) => sel.has(id)).length;
  const allRelevant = hitRelevant === relevant.length;
  const noBad = hitBad === 0;

  if (allRelevant && noBad) {
    return {
      status: "correct",
      message:
        "Correcto. Esos datos permiten relacionar demanda, capacidad y latencia con la degradación observada.",
    };
  }
  if (hitRelevant > 0 && hitRelevant < relevant.length && hitBad === 0) {
    return {
      status: "partial",
      message:
        "Seleccionaste evidencia relevante, pero existen otros datos que permiten relacionar demanda, capacidad y latencia.",
    };
  }
  if (hitRelevant > 0 && hitBad > 0) {
    return {
      status: "partial",
      message:
        "Hay evidencia útil, pero también incluiste datos sin relación técnica con el comportamiento observado.",
    };
  }
  return {
    status: "incorrect",
    message: "Revisa cuáles datos tienen relación técnica con el comportamiento observado.",
  };
}

export function bindEvidenceSelector(root, { onToggle, onCheck, onRetry }) {
  root.querySelectorAll("[data-evid]").forEach((btn) => {
    btn.addEventListener("click", () => onToggle(btn.dataset.evid));
  });
  root.querySelector('[data-action="check-evidence"]')?.addEventListener("click", onCheck);
  root.querySelector('[data-action="retry"]')?.addEventListener("click", onRetry);
}
