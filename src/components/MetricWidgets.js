export function MetricCard({ label, value, hint }) {
  return `
    <button type="button" class="metric-card" data-metric="${label}">
      <span class="metric-card__label">${label}</span>
      <span class="metric-card__value">${value}</span>
      ${hint ? `<span class="metric-card__hint">${hint}</span>` : ""}
    </button>
  `;
}

export function MiniMetricDashboard({ metrics, activeId, insight }) {
  return `
    <section class="metric-dashboard" aria-label="Mini dashboard pedagógico">
      <div class="metric-dashboard__grid">
        ${metrics
          .map(
            (m) => `
          <button type="button" class="metric-card ${activeId === m.id ? "is-active" : ""}" data-metric="${m.id}">
            <span class="metric-card__label">${m.label}</span>
            <span class="metric-card__value">${m.value}</span>
          </button>`
          )
          .join("")}
      </div>
      <div class="metric-dashboard__insight callout-warn" aria-live="polite">
        ${
          insight ||
          "<strong>Selecciona una métrica.</strong> ¿Qué más necesitas saber antes de interpretarla?"
        }
      </div>
    </section>
  `;
}

export function FormulaCard({ title, lines, spoken }) {
  const spokenText =
    spoken ||
    `${title}. ${lines.map((l) => String(l).replace(/×/g, "por").replace(/−/g, "menos")).join(" ")}`;
  return `
    <div class="formula-card" role="group" aria-label="${title}">
      <p class="sr-only">${spokenText}</p>
      <p class="formula-card__title" aria-hidden="true">${title}</p>
      <div class="formula-card__body" aria-hidden="true">
        ${lines.map((l) => `<div class="formula-line">${l}</div>`).join("")}
      </div>
    </div>
  `;
}

export function MetricComparison({ left, right }) {
  return `
    <div class="metric-compare">
      <div class="two-col__card">
        <h3>${left.title}</h3>
        ${left.rows.map((r) => `<p><strong>${r.k}:</strong> ${r.v}</p>`).join("")}
      </div>
      <div class="two-col__card">
        <h3>${right.title}</h3>
        ${right.rows.map((r) => `<p><strong>${r.k}:</strong> ${r.v}</p>`).join("")}
      </div>
    </div>
  `;
}

export function bindMetricDashboard(root, { onSelect }) {
  root.querySelectorAll("[data-metric]").forEach((btn) => {
    btn.addEventListener("click", () => onSelect(btn.dataset.metric));
  });
}
