import { FeedbackPanel } from "./FeedbackPanel.js";
import { LAB_CONFIG } from "../config/labConfig.js";

export function TechnologyOptionCompare({ rows }) {
  return `
    <div class="tech-compare" role="table" aria-label="Comparador de alternativas">
      <div class="tech-compare__head" role="row">
        <span>Criterio</span>
        <span>On-premise</span>
        <span>Cloud</span>
        <span>Híbrido</span>
        <span>Edge</span>
      </div>
      ${rows
        .map(
          (r) => `
        <div class="tech-compare__row" role="row">
          <span><strong>${r.criterio}</strong></span>
          <span>${r.onprem}</span>
          <span>${r.cloud}</span>
          <span>${r.hybrid}</span>
          <span>${r.edge}</span>
        </div>`
        )
        .join("")}
      <p class="meta-line tech-compare__note">No existe un ganador universal. Compara según el problema.</p>
    </div>
  `;
}

export function PriorityMatrix() {
  return `
    <div class="priority-matrix" aria-label="Matriz impacto esfuerzo">
      <div class="priority-matrix__cell is-high">
        <strong>Alto impacto / Bajo esfuerzo</strong>
        <span>Prioridad alta</span>
      </div>
      <div class="priority-matrix__cell is-plan">
        <strong>Alto impacto / Alto esfuerzo</strong>
        <span>Planificar</span>
      </div>
      <div class="priority-matrix__cell is-eval">
        <strong>Bajo impacto / Bajo esfuerzo</strong>
        <span>Evaluar</span>
      </div>
      <div class="priority-matrix__cell is-low">
        <strong>Bajo impacto / Alto esfuerzo</strong>
        <span>Prioridad menor</span>
      </div>
    </div>
  `;
}

export function PathCompare() {
  return `
    <div class="path-compare">
      <div class="path-compare__bad" aria-label="Camino incorrecto">
        <p class="path-compare__label">CAMINO INCORRECTO</p>
        <div class="chain-flow">
          <span class="chain-flow__node">Cloud</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="meta-line" style="margin:0;">«Busquemos un problema que justifique usarlo»</span>
        </div>
      </div>
      <div class="path-compare__good" aria-label="Camino correcto">
        <p class="path-compare__label">CAMINO CORRECTO</p>
        <div class="chain-flow">
          <span class="chain-flow__node">Problema</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">Evidencia</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">Impacto</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">Alternativas</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">Decisión</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">Métrica</span>
        </div>
      </div>
    </div>
  `;
}

export function MethodChain() {
  return `
    <div class="method-chain" aria-label="Método del laboratorio">
      ${["COMPRENDER", "REPRESENTAR", "MEDIR", "DIAGNOSTICAR", "GOBERNAR", "DECIDIR"]
        .map(
          (s, i, arr) =>
            `<span class="method-chain__node">${s}</span>${
              i < arr.length - 1 ? '<span class="method-chain__arrow" aria-hidden="true">→</span>' : ""
            }`
        )
        .join("")}
    </div>
  `;
}

export function FinalReadyBanner({ labComplete }) {
  if (!labComplete) return "";
  return `
    <div class="final-ready" role="status">
      <p class="h2" style="margin:0 0 0.5rem;">${LAB_CONFIG.completion.closingTitle}</p>
      <p class="final-ready__mantra">
        ${LAB_CONFIG.completion.closingMessage}
      </p>
      <p>Ahora vuelve a tu caso asignado e integra todo el análisis para la entrega del primer corte.</p>
      <p class="meta-line">Laboratorio completado · Progreso 100 %</p>
    </div>
  `;
}
