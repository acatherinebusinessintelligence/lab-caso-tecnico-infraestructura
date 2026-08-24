import { FeedbackPanel } from "./FeedbackPanel.js";

/** Clasificación en 3 categorías (HECHO / INTERPRETACIÓN / SUPOSICIÓN). */
export function TripleClassify({
  items,
  categories,
  assignments,
  checked,
  feedbackStatus,
  feedbackMessage,
}) {
  const pool = items.filter((i) => !assignments[i.id]);
  return `
    <section class="triple-classify" aria-label="Clasificación de afirmaciones">
      <div class="classify-pool">
        ${
          pool.length
            ? pool
                .map(
                  (item) => `
            <div class="classify-item card-pad">
              <strong>${item.label}</strong>
              <div class="classify-item__actions">
                ${categories
                  .map(
                    (c) => `
                  <button type="button" class="btn btn-secondary" data-tassign="${item.id}" data-tbucket="${c.id}" ${
                    checked ? "disabled" : ""
                  }>
                    ${c.label}
                  </button>`
                  )
                  .join("")}
              </div>
            </div>`
                )
                .join("")
            : `<p class="meta-line">Todas las afirmaciones están clasificadas.</p>`
        }
      </div>
      <div class="triple-cols">
        ${categories
          .map((c) => {
            const placed = items.filter((i) => assignments[i.id] === c.id);
            return `
              <div class="classify-col">
                <h3>${c.label}</h3>
                <div class="classify-drop">
                  ${
                    placed.length
                      ? placed
                          .map(
                            (i) => `
                    <div class="classify-chip ${
                      checked
                        ? assignments[i.id] === i.bucket
                          ? "is-ok"
                          : "is-bad"
                        : ""
                    }">
                      <span>${i.label}</span>
                      ${
                        !checked
                          ? `<button type="button" class="classify-chip__remove" data-tremove="${i.id}" aria-label="Quitar">×</button>`
                          : ""
                      }
                    </div>`
                          )
                          .join("")
                      : `<p class="meta-line">Vacío</p>`
                  }
                </div>
              </div>`;
          })
          .join("")}
      </div>
      <div class="btn-row" style="justify-content:flex-start;margin-top:1rem;">
        <button type="button" class="btn btn-primary" data-action="check-triple" ${
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

export function evaluateTripleClassify(items, assignments) {
  const allAssigned = items.every((i) => assignments[i.id]);
  if (!allAssigned) return { status: null, message: "" };
  const correctCount = items.filter((i) => assignments[i.id] === i.bucket).length;
  if (correctCount === items.length) {
    return {
      status: "correct",
      message:
        "Correcto. Estás diferenciando la evidencia de lo que interpretas y de lo que todavía no puedes afirmar.",
    };
  }
  if (correctCount >= Math.ceil(items.length / 2)) {
    return {
      status: "partial",
      message:
        "Revisa las afirmaciones que presentan una conclusión absoluta sin suficiente evidencia.",
    };
  }
  return {
    status: "incorrect",
    message:
      "Revisa las afirmaciones que presentan una conclusión absoluta sin suficiente evidencia.",
  };
}

export function bindTripleClassify(root, { onAssign, onRemove, onCheck, onRetry }) {
  root.querySelectorAll("[data-tassign]").forEach((btn) => {
    btn.addEventListener("click", () => onAssign(btn.dataset.tassign, btn.dataset.tbucket));
  });
  root.querySelectorAll("[data-tremove]").forEach((btn) => {
    btn.addEventListener("click", () => onRemove(btn.dataset.tremove));
  });
  root.querySelector('[data-action="check-triple"]')?.addEventListener("click", onCheck);
  root.querySelector('[data-action="retry"]')?.addEventListener("click", onRetry);
}
