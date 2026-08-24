import { FeedbackPanel } from "./FeedbackPanel.js";
import { resolveAttemptFeedback } from "../utils/feedback.js";

/**
 * QuestionCard — selección única + comprobar + reintento con pistas progresivas.
 */
export function QuestionCard({
  question,
  selectedId = null,
  checked = false,
  feedbackStatus = null,
  feedbackMessage = "",
  attempt = 1,
}) {
  const locked = checked;
  return `
    <section class="question-card" aria-labelledby="q-prompt-${question.id || "q"}">
      <h3 class="question-card__prompt" id="q-prompt-${question.id || "q"}">${question.prompt}</h3>
      <ul class="option-list" role="radiogroup" aria-labelledby="q-prompt-${question.id || "q"}">
        ${question.options
          .map((opt) => {
            const selected = selectedId === opt.id;
            return `
              <li>
                <button
                  type="button"
                  class="option-item ${selected ? "is-selected" : ""}"
                  role="radio"
                  aria-checked="${selected ? "true" : "false"}"
                  data-option="${opt.id}"
                  ${locked ? "disabled" : ""}
                >
                  <span class="option-key" aria-hidden="true">${opt.key}</span>
                  <span>${opt.label}</span>
                </button>
              </li>
            `;
          })
          .join("")}
      </ul>
      <div class="btn-row" style="margin-top:0;justify-content:flex-start;">
        <button
          type="button"
          class="btn btn-primary"
          data-action="check"
          ${!selectedId || locked ? "disabled" : ""}
        >
          Comprobar respuesta
        </button>
      </div>
      ${FeedbackPanel({
        status: feedbackStatus,
        message: feedbackMessage,
        showRetry: checked && feedbackStatus !== "correct" && feedbackStatus !== "adequate",
      })}
      ${
        checked && feedbackStatus !== "correct" && attempt > 1
          ? `<p class="meta-line">Intento ${attempt}. Usa la pista y vuelve a razonar antes de elegir.</p>`
          : ""
      }
    </section>
  `;
}

export function evaluateSingleChoice(question, selectedId, attempt = 1) {
  if (!selectedId) return { status: null, message: "" };
  if (selectedId === question.correctId) {
    return {
      status: "correct",
      message: resolveAttemptFeedback(question, "correct", attempt),
    };
  }
  return {
    status: "incorrect",
    message: resolveAttemptFeedback(question, "incorrect", attempt),
  };
}

export function bindQuestionCard(root, { onSelect, onCheck, onRetry }) {
  root.querySelectorAll("[data-option]").forEach((btn) => {
    btn.addEventListener("click", () => onSelect(btn.dataset.option));
  });
  const check = root.querySelector('[data-action="check"]');
  if (check) check.addEventListener("click", onCheck);
  const retry = root.querySelector('[data-action="retry"]');
  if (retry) retry.addEventListener("click", onRetry);
}
