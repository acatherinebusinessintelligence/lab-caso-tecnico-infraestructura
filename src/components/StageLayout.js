import { ConsultantTip } from "./ConsultantTip.js";

/**
 * StageLayout — plantilla reusable: CONCEPTO / OBSERVA / DECIDE / APLICA
 */
export function StageLayout({
  stageTitle,
  concept,
  observeNodes,
  tip,
  apply,
  questionSlotHtml,
}) {
  return `
    <section class="stage-layout" aria-label="${stageTitle}">
      <header class="card card-pad">
        <p class="eyebrow">Plantilla de etapa</p>
        <h2 class="h2">${stageTitle}</h2>
        <p class="lead">Estructura reusable para las seis etapas del laboratorio.</p>
      </header>

      <article class="stage-block">
        <p class="stage-block__label">1 · CONCEPTO</p>
        <div class="stage-block__body">
          <p style="margin:0;">${concept}</p>
        </div>
      </article>

      <article class="stage-block">
        <p class="stage-block__label">2 · OBSERVA</p>
        <div class="stage-block__body">
          <div class="flow-diagram" aria-label="Diagrama demostrativo AS-IS">
            ${observeNodes
              .map(
                (n, i) =>
                  `<span class="flow-node">${n}</span>${
                    i < observeNodes.length - 1 ? '<span class="flow-sep" aria-hidden="true">↓</span>' : ""
                  }`
              )
              .join("")}
          </div>
        </div>
      </article>

      ${ConsultantTip({ text: tip })}

      <article class="stage-block">
        <p class="stage-block__label">3 · DECIDE</p>
        <div class="stage-block__body">
          ${questionSlotHtml}
        </div>
      </article>

      <article class="stage-block">
        <p class="stage-block__label">4 · APLICA A TU CASO</p>
        <div class="stage-block__body">
          <div class="callout-warn">
            <strong>Instrucción:</strong> ${apply}
          </div>
        </div>
      </article>
    </section>
  `;
}

export function NavigationButtons({
  canGoPrev = true,
  canGoNext = false,
  prevLabel = "ANTERIOR",
  nextLabel = "CONTINUAR",
}) {
  return `
    <div class="btn-row" role="navigation" aria-label="Navegación de etapa">
      <button type="button" class="btn btn-secondary" data-nav="prev" ${canGoPrev ? "" : "disabled"}>
        ${prevLabel}
      </button>
      <button type="button" class="btn btn-primary" data-nav="next" ${canGoNext ? "" : "disabled"}>
        ${nextLabel}
      </button>
    </div>
  `;
}

export function bindNavigation(root, { onPrev, onNext }) {
  const prev = root.querySelector('[data-nav="prev"]');
  const next = root.querySelector('[data-nav="next"]');
  if (prev) prev.addEventListener("click", onPrev);
  if (next) next.addEventListener("click", onNext);
}
