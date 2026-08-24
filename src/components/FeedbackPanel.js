/**
 * FeedbackPanel — estados:
 * correct | adequate | partial | incorrect | unsupported
 * (aliases visuales: ADECUADA / PARCIAL / NO SUSTENTADA / INCORRECTO·RIESGOSO)
 */
const TITLES = {
  correct: "Correcto",
  adequate: "Adecuada",
  partial: "Parcial",
  incorrect: "Incorrecto / riesgoso",
  unsupported: "No sustentada",
};

const ICONS = {
  correct: "✓",
  adequate: "✓",
  partial: "!",
  incorrect: "×",
  unsupported: "×",
};

/** Mapea aliases a clase CSS existente */
function cssStatus(status) {
  if (status === "adequate") return "correct";
  if (status === "unsupported") return "incorrect";
  return status;
}

export function FeedbackPanel({ status, message, showRetry = false }) {
  if (!status) return "";
  const visual = cssStatus(status);
  return `
    <div
      class="feedback-panel is-${visual}"
      role="status"
      aria-live="polite"
      data-feedback-status="${status}"
    >
      <div class="feedback-panel__badge">
        <span class="feedback-panel__icon" aria-hidden="true">${ICONS[status] || "!"}</span>
        <span>${TITLES[status] || status}</span>
      </div>
      <h3 class="feedback-panel__title">${TITLES[status] || status}</h3>
      <p class="feedback-panel__message">${message}</p>
      ${
        showRetry
          ? `<div class="feedback-panel__actions">
              <button type="button" class="btn btn-secondary" data-action="retry">
                ↻ INTENTAR NUEVAMENTE
              </button>
            </div>`
          : ""
      }
    </div>
  `;
}
