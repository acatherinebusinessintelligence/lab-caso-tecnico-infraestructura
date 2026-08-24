import { FeedbackPanel } from "./FeedbackPanel.js";

/**
 * Clasificación Servicio vs Componente (click-to-assign).
 */
export function ClassifyBoard({ items, assignments, checked, feedbackStatus, feedbackMessage }) {
  const pool = items.filter((i) => !assignments[i.id]);
  const servicios = items.filter((i) => assignments[i.id] === "servicio");
  const componentes = items.filter((i) => assignments[i.id] === "componente");

  const renderChip = (item, inBucket) => `
    <div class="classify-chip ${checked && assignments[item.id] === item.bucket ? "is-ok" : ""} ${
      checked && assignments[item.id] && assignments[item.id] !== item.bucket ? "is-bad" : ""
    }" data-item="${item.id}">
      <span>${item.label}</span>
      ${
        inBucket && !checked
          ? `<button type="button" class="classify-chip__remove" data-remove="${item.id}" aria-label="Quitar ${item.label}">×</button>`
          : ""
      }
    </div>
  `;

  return `
    <section class="classify-board" aria-label="Clasificar servicio o componente">
      <p class="lead" style="margin-bottom:0.85rem;">
        Clasifica cada elemento. Pregúntate: ¿el usuario lo consume como servicio o forma parte de la infraestructura?
      </p>

      <div class="classify-pool" aria-label="Elementos por clasificar">
        ${
          pool.length
            ? pool
                .map(
                  (item) => `
              <div class="classify-item card-pad">
                <strong>${item.label}</strong>
                <div class="classify-item__actions">
                  <button type="button" class="btn btn-secondary" data-assign="${item.id}" data-bucket="servicio" ${
                    checked ? "disabled" : ""
                  }>Servicio</button>
                  <button type="button" class="btn btn-secondary" data-assign="${item.id}" data-bucket="componente" ${
                    checked ? "disabled" : ""
                  }>Componente</button>
                </div>
              </div>
            `
                )
                .join("")
            : `<p class="meta-line">Todos los elementos están clasificados. Puedes comprobar o corregir.</p>`
        }
      </div>

      <div class="classify-columns">
        <div class="classify-col">
          <h3>SERVICIO</h3>
          <div class="classify-drop" data-drop="servicio">${servicios.map((i) => renderChip(i, true)).join("") || '<p class="meta-line">Vacío</p>'}</div>
        </div>
        <div class="classify-col">
          <h3>COMPONENTE</h3>
          <div class="classify-drop" data-drop="componente">${componentes.map((i) => renderChip(i, true)).join("") || '<p class="meta-line">Vacío</p>'}</div>
        </div>
      </div>

      <div class="btn-row" style="justify-content:flex-start;margin-top:1rem;">
        <button type="button" class="btn btn-primary" data-action="check-classify" ${
          Object.keys(assignments).length < items.length || checked ? "disabled" : ""
        }>
          Comprobar clasificación
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

export function evaluateClassify(items, assignments) {
  const allAssigned = items.every((i) => assignments[i.id]);
  if (!allAssigned) return { status: null, message: "" };
  const allCorrect = items.every((i) => assignments[i.id] === i.bucket);
  if (allCorrect) {
    return {
      status: "correct",
      message:
        "Correcto. Ya puedes diferenciar lo que el negocio consume de los componentes que permiten prestarlo.",
    };
  }
  return {
    status: "incorrect",
    message:
      "Revisa nuevamente. Pregúntate: ¿el usuario consume directamente este elemento como servicio o forma parte de la infraestructura que lo soporta?",
  };
}

export function bindClassifyBoard(root, { onAssign, onRemove, onCheck, onRetry }) {
  root.querySelectorAll("[data-assign]").forEach((btn) => {
    btn.addEventListener("click", () => onAssign(btn.dataset.assign, btn.dataset.bucket));
  });
  root.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => onRemove(btn.dataset.remove));
  });
  root.querySelector('[data-action="check-classify"]')?.addEventListener("click", onCheck);
  root.querySelector('[data-action="retry"]')?.addEventListener("click", onRetry);
}
