import { LAB_CONFIG } from "../config/labConfig.js";
import { LOGIC_CHAIN } from "../data/stages.js";

export function WelcomePage() {
  const showRef = LAB_CONFIG._showDesignReference === true;
  return `
    <section class="page welcome" aria-labelledby="welcome-title">
      <header class="welcome-topbar">
        <div>
          <p class="welcome-topbar__title">${LAB_CONFIG.labName}</p>
          <p class="welcome-topbar__sub">${LAB_CONFIG.labSubtitle}</p>
        </div>
      </header>

      <div class="welcome-grid${showRef ? "" : " welcome-grid--solo"}">
        <article class="card welcome-hero">
          <h1 class="h1" id="welcome-title">${LAB_CONFIG.welcomeTitle}</h1>
          <p class="lead">Una guía paso a paso para construir tu diagnóstico.</p>

          <div class="callout-warn" style="margin-top:1.1rem;">
            <strong>Mensaje clave:</strong>
            En este laboratorio no resolveremos tu caso.
            Aprenderás el método para resolverlo.
          </div>

          <div class="logic-strip" aria-label="Lógica transversal del laboratorio">
            ${LOGIC_CHAIN.map(
              (item, i) =>
                `<span class="logic-chip">${item}</span>${
                  i < LOGIC_CHAIN.length - 1
                    ? '<span class="logic-arrow" aria-hidden="true">→</span>'
                    : ""
                }`
            ).join("")}
          </div>

          <div style="margin-top:1.35rem;">
            <button type="button" class="btn btn-cta" data-action="start">
              INICIAR ANÁLISIS →
            </button>
            <p class="meta-line">Duración aproximada: ${LAB_CONFIG.durationHint}</p>
          </div>
        </article>

        ${
          showRef
            ? `<aside class="welcome-visual-card card" aria-label="Referencia visual del laboratorio">
          <img
            class="welcome-ref-img"
            src="./assets/referencias/diseno_h5p_infraestructura.png"
            alt="Referencia visual del laboratorio de Gestión de la Infraestructura"
          />
        </aside>`
            : ""
        }
      </div>
    </section>
  `;
}

export function bindWelcome(root, { onStart }) {
  root.querySelector('[data-action="start"]')?.addEventListener("click", onStart);
}
