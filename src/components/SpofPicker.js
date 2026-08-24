import { FeedbackPanel } from "./FeedbackPanel.js";

/**
 * Selección visual de candidatos a SPOF.
 * Estados: correct | partial | incorrect
 */
export function SpofPicker({ nodes, selected, checked, feedbackStatus, feedbackMessage }) {
  return `
    <section class="spof-picker" aria-label="Seleccionar posibles SPOF">
      <p class="lead">
        Selecciona los componentes que consideras candidatos a SPOF en esta arquitectura.
      </p>
      <div class="spof-flow" role="group" aria-label="Arquitectura interactiva">
        ${nodes
          .map((n, i) => {
            const on = selected.includes(n.id);
            return `
              <button
                type="button"
                class="spof-node ${on ? "is-selected" : ""} ${
                  checked && n.role === "must" && on ? "is-ok" : ""
                } ${checked && n.role === "avoid" && on ? "is-warn" : ""}"
                data-spof="${n.id}"
                aria-pressed="${on ? "true" : "false"}"
                ${checked ? "disabled" : ""}
              >
                ${n.label}
              </button>
              ${i < nodes.length - 1 ? '<span class="flow-sep" aria-hidden="true">↓</span>' : ""}
            `;
          })
          .join("")}
      </div>
      <p class="meta-line">Arquitectura: Usuarios → Internet → Firewall → Balanceador → APP01 + APP02 → DB01 → NAS → Backup</p>
      <div class="btn-row" style="justify-content:flex-start;margin-top:0.85rem;">
        <button type="button" class="btn btn-primary" data-action="check-spof" ${
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

export function evaluateSpofSelection(nodes, selected) {
  const must = nodes.filter((n) => n.role === "must").map((n) => n.id);
  const avoid = nodes.filter((n) => n.role === "avoid").map((n) => n.id);
  const selectedSet = new Set(selected);
  const hasAllMust = must.every((id) => selectedSet.has(id));
  const hasAvoid = avoid.some((id) => selectedSet.has(id));
  const hasAnyMust = must.some((id) => selectedSet.has(id));

  if (hasAllMust && !hasAvoid) {
    return {
      status: "correct",
      message:
        "Correcto. Firewall y DB01 son los principales puntos únicos. APP01/APP02 no necesariamente son SPOF si el balanceador mantiene el servicio con el otro nodo.",
    };
  }

  if (hasAllMust && hasAvoid) {
    return {
      status: "partial",
      message:
        "Identificaste los principales puntos únicos, pero APP01 no necesariamente es SPOF si APP02 puede mantener el servicio.",
    };
  }

  if (hasAnyMust && !hasAvoid) {
    return {
      status: "partial",
      message:
        "Vas en la dirección correcta, pero falta relacionar ambos puntos únicos principales (Firewall y DB01) con el impacto de extremo a extremo.",
    };
  }

  return {
    status: "incorrect",
    message:
      "Revisa nuevamente. Busca componentes únicos de los que depende el servicio y no asumas que un APP individual es SPOF si existe alternativa balanceada.",
  };
}

export function bindSpofPicker(root, { onToggle, onCheck, onRetry }) {
  root.querySelectorAll("[data-spof]").forEach((btn) => {
    btn.addEventListener("click", () => onToggle(btn.dataset.spof));
  });
  root.querySelector('[data-action="check-spof"]')?.addEventListener("click", onCheck);
  root.querySelector('[data-action="retry"]')?.addEventListener("click", onRetry);
}
