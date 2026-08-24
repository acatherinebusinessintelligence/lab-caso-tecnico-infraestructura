import { FeedbackPanel } from "./FeedbackPanel.js";
import { validateNumericInput, nearlyEqual } from "../utils/numbers.js";

export function CalculationExercise({
  id,
  prompt,
  unit = "",
  placeholder = "Ej. 97,81",
  value = "",
  checked = false,
  showProcedure = false,
  procedureHtml = "",
  feedbackStatus = null,
  feedbackMessage = "",
  hint = "",
  attempt = 0,
}) {
  return `
    <section class="calc-exercise" data-calc="${id}" aria-label="Ejercicio de cálculo">
      <p class="calc-exercise__prompt"><strong>${prompt}</strong></p>
      ${hint ? `<p class="meta-line">${hint}</p>` : ""}
      <div class="calc-exercise__row">
        <label class="sr-only" for="calc-input-${id}">Respuesta numérica</label>
        <input
          id="calc-input-${id}"
          class="calc-input"
          type="text"
          inputmode="decimal"
          autocomplete="off"
          placeholder="${placeholder}"
          value="${value}"
          data-calc-input="${id}"
          ${checked ? "disabled" : ""}
          aria-describedby="calc-unit-${id}"
        />
        <span id="calc-unit-${id}" class="calc-unit">${unit}</span>
        <button type="button" class="btn btn-primary" data-action="check-calc" data-calc-id="${id}" ${
          checked ? "disabled" : ""
        }>
          Comprobar
        </button>
        <button type="button" class="btn btn-secondary" data-action="toggle-proc" data-calc-id="${id}">
          VER PROCEDIMIENTO
        </button>
      </div>
      ${showProcedure ? `<div class="calc-procedure">${procedureHtml}</div>` : ""}
      ${FeedbackPanel({
        status: feedbackStatus,
        message: feedbackMessage,
        showRetry: checked && feedbackStatus !== "correct",
      })}
      ${
        checked && feedbackStatus !== "correct" && attempt > 1
          ? `<p class="meta-line">Intento ${attempt}. Revisa el procedimiento y vuelve a calcular.</p>`
          : ""
      }
    </section>
  `;
}

export function checkNumericAnswer(raw, expected, tolerance = 0.05, opts = {}) {
  const validation = validateNumericInput(raw, opts);
  if (!validation.ok) {
    return {
      status: "incorrect",
      message: validation.message,
      value: validation.value,
    };
  }
  const { value } = validation;
  if (nearlyEqual(value, expected, tolerance)) {
    return { status: "correct", message: "", value };
  }
  return { status: "incorrect", message: "", value };
}

export function bindCalculationExercise(root, { onInput, onCheck, onToggleProc, onRetry }) {
  root.querySelectorAll("[data-calc-input]").forEach((input) => {
    input.addEventListener("input", () => onInput(input.dataset.calcInput, input.value));
  });
  root.querySelectorAll('[data-action="check-calc"]').forEach((btn) => {
    btn.addEventListener("click", () => onCheck(btn.dataset.calcId));
  });
  root.querySelectorAll('[data-action="toggle-proc"]').forEach((btn) => {
    btn.addEventListener("click", () => onToggleProc(btn.dataset.calcId));
  });
  root.querySelectorAll('[data-action="retry"]').forEach((btn) => {
    btn.addEventListener("click", onRetry);
  });
}
