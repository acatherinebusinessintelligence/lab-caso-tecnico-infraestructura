import { FeedbackPanel } from "./FeedbackPanel.js";

/** Ordenar cadena de dependencias (botones subir/bajar). */
export function OrderChain({ items, order, checked, feedbackStatus, feedbackMessage }) {
  const ordered = order.map((id) => items.find((i) => i.id === id)).filter(Boolean);
  return `
    <section class="order-chain" aria-label="Ordenar la cadena de dependencias">
      <p class="lead" style="margin-bottom:0.75rem;">
        Organiza el recorrido desde el usuario hasta los datos.
      </p>
      <ol class="order-list">
        ${ordered
          .map(
            (item, index) => `
          <li class="order-item">
            <span class="order-item__pos" aria-hidden="true">${index + 1}</span>
            <span class="order-item__label">${item.label}</span>
            <div class="order-item__actions">
              <button type="button" class="btn btn-secondary" data-move="${item.id}" data-dir="up" ${
                checked || index === 0 ? "disabled" : ""
              } aria-label="Subir ${item.label}">↑</button>
              <button type="button" class="btn btn-secondary" data-move="${item.id}" data-dir="down" ${
                checked || index === ordered.length - 1 ? "disabled" : ""
              } aria-label="Bajar ${item.label}">↓</button>
            </div>
          </li>
        `
          )
          .join("")}
      </ol>
      <div class="btn-row" style="justify-content:flex-start;margin-top:0.85rem;">
        <button type="button" class="btn btn-primary" data-action="check-order" ${checked ? "disabled" : ""}>
          Comprobar orden
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

export function evaluateOrder(order, correct) {
  const ok = order.length === correct.length && order.every((id, i) => id === correct[i]);
  if (ok) {
    return {
      status: "correct",
      message:
        "Correcto. Ahora puedes visualizar cómo un usuario depende progresivamente de distintos componentes.",
    };
  }
  return {
    status: "incorrect",
    message:
      "Revisa el recorrido desde el usuario hasta los datos. Piensa qué componente necesita atravesar antes de llegar al siguiente.",
  };
}

export function shuffleIds(ids) {
  const arr = [...ids];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // evitar que coincida exactamente con el orden correcto al cargar
  if (arr.every((id, i) => id === ids[i])) {
    arr.reverse();
  }
  return arr;
}

export function bindOrderChain(root, { onMove, onCheck, onRetry }) {
  root.querySelectorAll("[data-move]").forEach((btn) => {
    btn.addEventListener("click", () => onMove(btn.dataset.move, btn.dataset.dir));
  });
  root.querySelector('[data-action="check-order"]')?.addEventListener("click", onCheck);
  root.querySelector('[data-action="retry"]')?.addEventListener("click", onRetry);
}
