import { ConsultantTip } from "../components/ConsultantTip.js";
import {
  QuestionCard,
  evaluateSingleChoice,
  bindQuestionCard,
} from "../components/QuestionCard.js";
import { bindStandardQuiz, emptyQuizState, quizFromGate } from "../utils/quizHelpers.js";
import {
  TripleClassify,
  evaluateTripleClassify,
  bindTripleClassify,
} from "../components/TripleClassify.js";
import {
  FrameworkCard,
  FrameworkComparison,
  AnalysisChainBuilder,
  evaluateAnalysisStep,
  bindAnalysisBuilder,
  FrameworkQuickPick,
  bindFrameworkQuickPick,
} from "../components/FrameworkWidgets.js";
import { NavigationButtons, bindNavigation } from "../components/StageLayout.js";
import {
  STAGE5_STEPS,
  STAGE5_FW_CARDS,
  STAGE5_FW_CATS,
  STAGE5_FW_ITEMS,
  STAGE5_INC_PROB_CATS,
  STAGE5_INC_PROB_ITEMS,
  STAGE5_Q_CHANGE,
  STAGE5_Q_ALERTS,
  STAGE5_ITIL_BUILDER,
  STAGE5_GOV_MGMT_CATS,
  STAGE5_GOV_MGMT_ITEMS,
  STAGE5_Q_COBIT,
  STAGE5_COBIT_BUILDER,
  STAGE5_THREAT_CATS,
  STAGE5_THREAT_ITEMS,
  STAGE5_Q_VULN,
  STAGE5_Q_THREAT,
  STAGE5_ISO_BUILDER,
  STAGE5_COMPARE_ROWS,
  STAGE5_CHOOSE_ITEMS,
  STAGE5_MINI_ITIL,
  STAGE5_MINI_COBIT,
  STAGE5_MINI_ISO,
  STAGE5_CHECKPOINT,
  STAGE5_APPLY_ITIL,
  STAGE5_APPLY_COBIT,
  STAGE5_APPLY_ISO,
} from "../data/stage5.js";

let local = null;

function emptyQuiz() {
  return { selectedId: null, checked: false, status: null, message: "", attempt: 0 };
}

function emptyBuilder(done) {
  return {
    stepIndex: done ? 99 : 0,
    selections: {},
    stepFeedback: null,
    complete: Boolean(done),
  };
}

function restoreBuilder(config, done) {
  if (!done) return emptyBuilder(false);
  return {
    stepIndex: config.steps.length,
    selections: Object.fromEntries(config.steps.map((s) => [s.id, s.correctId])),
    stepFeedback: null,
    complete: true,
  };
}

export function resetStage5Local(state) {
  const s5 = state.stage5 || {};
  local = {
    classifyFw: {
      assignments: s5.classifyFw
        ? Object.fromEntries(STAGE5_FW_ITEMS.map((i) => [i.id, i.bucket]))
        : {},
      checked: Boolean(s5.classifyFw),
      status: s5.classifyFw ? "correct" : null,
      message: s5.classifyFw
        ? "Correcto. Estás diferenciando gestión del servicio, gobierno y seguridad de la información."
        : "",
    },
    incProb: {
      assignments: s5.incProb
        ? Object.fromEntries(STAGE5_INC_PROB_ITEMS.map((i) => [i.id, i.bucket]))
        : {},
      checked: Boolean(s5.incProb),
      status: s5.incProb ? "correct" : null,
      message: s5.incProb
        ? "Correcto. Incidente restaura el servicio; problema busca la causa recurrente."
        : "",
    },
    qChange: {
      ...emptyQuiz(),
      checked: Boolean(s5.qChange),
      status: s5.qChange ? "correct" : null,
      message: s5.qChange ? STAGE5_Q_CHANGE.feedback.correct : "",
    },
    itilBuilder: restoreBuilder(STAGE5_ITIL_BUILDER, s5.itilBuilder),
    qAlerts: {
      ...emptyQuiz(),
      checked: Boolean(s5.qAlerts),
      status: s5.qAlerts ? "correct" : null,
      message: s5.qAlerts ? STAGE5_Q_ALERTS.feedback.correct : "",
    },
    govMgmt: {
      assignments: s5.govMgmt
        ? Object.fromEntries(STAGE5_GOV_MGMT_ITEMS.map((i) => [i.id, i.bucket]))
        : {},
      checked: Boolean(s5.govMgmt),
      status: s5.govMgmt ? "correct" : null,
      message: s5.govMgmt
        ? "Correcto. Gobierno define dirección y control; gestión ejecuta."
        : "",
    },
    qCobit: {
      ...emptyQuiz(),
      checked: Boolean(s5.qCobit),
      status: s5.qCobit ? "correct" : null,
      message: s5.qCobit ? STAGE5_Q_COBIT.feedback.correct : "",
    },
    cobitBuilder: restoreBuilder(STAGE5_COBIT_BUILDER, s5.cobitBuilder),
    threatVuln: {
      assignments: s5.threatVuln
        ? Object.fromEntries(STAGE5_THREAT_ITEMS.map((i) => [i.id, i.bucket]))
        : {},
      checked: Boolean(s5.threatVuln),
      status: s5.threatVuln ? "correct" : null,
      message: s5.threatVuln
        ? "Correcto. Amenaza es el evento/agente; vulnerabilidad es la debilidad."
        : "",
    },
    qVuln: {
      ...emptyQuiz(),
      checked: Boolean(s5.qVuln),
      status: s5.qVuln ? "correct" : null,
      message: s5.qVuln ? STAGE5_Q_VULN.feedback.correct : "",
    },
    qThreat: {
      ...emptyQuiz(),
      checked: Boolean(s5.qThreat),
      status: s5.qThreat ? "correct" : null,
      message: s5.qThreat ? STAGE5_Q_THREAT.feedback.correct : "",
    },
    isoBuilder: restoreBuilder(STAGE5_ISO_BUILDER, s5.isoBuilder),
    chooseFw: {
      assignments: s5.chooseFw
        ? Object.fromEntries(STAGE5_CHOOSE_ITEMS.map((i) => [i.id, i.bucket]))
        : {},
      checked: Boolean(s5.chooseFw),
      status: s5.chooseFw ? "correct" : null,
      message: s5.chooseFw
        ? "Correcto. Identificaste la perspectiva principal de cada situación."
        : "",
    },
    multiSeen: Boolean(s5.multiSeen),
    miniItil: restoreBuilder(STAGE5_MINI_ITIL, s5.miniItil),
    miniCobit: restoreBuilder(STAGE5_MINI_COBIT, s5.miniCobit),
    miniIso: restoreBuilder(STAGE5_MINI_ISO, s5.miniIso),
    checkpoint: Object.fromEntries(
      STAGE5_CHECKPOINT.map((ck) => {
        const done = s5.checkpoint?.[ck.id];
        return [
          ck.id,
          {
            selectedId: done ? ck.correctId : null,
            checked: Boolean(done),
            status: done ? "correct" : null,
          },
        ];
      })
    ),
  };
}

function stepDots(step) {
  return `
    <div class="step-dots" aria-label="Progreso dentro de la Etapa 5">
      ${STAGE5_STEPS.map(
        (_, i) => `
        <span class="step-dot ${i === step ? "is-active" : ""} ${i < step ? "is-done" : ""}"></span>
      `
      ).join("")}
      <span class="step-dots__label">Paso ${step + 1} de ${STAGE5_STEPS.length}</span>
    </div>
  `;
}

function quizHtml(key, question) {
  const q = local[key];
  return `
    <div data-quiz="${key}">
      ${QuestionCard({
        question,
        selectedId: q.selectedId,
        checked: q.checked,
        feedbackStatus: q.status,
        feedbackMessage: q.message,
        attempt: q.attempt || 1,
      })}
    </div>
  `;
}

function builderHtml(key, config) {
  const b = local[key];
  return `
    <div data-builder="${key}">
      ${AnalysisChainBuilder({
        config,
        stepIndex: Math.min(b.stepIndex, config.steps.length - 1),
        selections: b.selections,
        stepFeedback: b.stepFeedback,
        complete: b.complete,
      })}
    </div>
  `;
}

function classifyHtml(key, items, cats) {
  const c = local[key];
  return `
    <div data-quiz="${key}">
      ${TripleClassify({
        items,
        categories: cats,
        assignments: c.assignments,
        checked: c.checked,
        feedbackStatus: c.status,
        feedbackMessage: c.message,
      })}
    </div>
  `;
}

function renderStep0() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">ITIL, COBIT e ISO 27001 no responden la misma pregunta</h2>
        <p class="lead" style="margin:0 0 1rem;">Los tres marcos aportan perspectivas diferentes. No son intercambiables.</p>
        <div class="fw-grid">
          ${STAGE5_FW_CARDS.map((c) => FrameworkCard({ card: c })).join("")}
        </div>
        ${ConsultantTip({
          text: "No empieces buscando el nombre de un marco. Empieza entendiendo qué problema necesitas analizar.",
        })}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · DECIDE</p>
      <div class="stage-block__body">
        <h3 class="h3">¿Con qué perspectiva empezarías?</h3>
        <p class="meta-line">Algunas situaciones pueden tocar más de un marco; elige la perspectiva principal.</p>
        ${classifyHtml("classifyFw", STAGE5_FW_ITEMS, STAGE5_FW_CATS)}
      </div>
    </article>
  `;
}

function renderStep1() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO · ITIL</p>
      <div class="stage-block__body fw-panel fw-itil">
        <h2 class="h2">ITIL: gestionar mejor los servicios</h2>
        <p>En este laboratorio ITIL analiza cómo mejorar la gestión del servicio. No memorices todas las prácticas.</p>
        <p>Trabaja principalmente: incidentes, problemas, habilitación del cambio, monitoreo y eventos, niveles de servicio.
        Cuando aplique: continuidad, capacidad, disponibilidad.</p>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · OBSERVA · Incidente vs problema</p>
      <div class="stage-block__body">
        <div class="two-col">
          <div class="two-col__card fw-itil-border">
            <h3>INCIDENTE</h3>
            <p>«Algo dejó de funcionar o se degradó.»</p>
            <p><em>Ej.: Moodle no responde durante 2 horas.</em></p>
            <div class="chain-flow" style="margin-top:0.75rem;">
              <span class="chain-flow__node">INCIDENTE</span>
              <span class="chain-flow__arrow">↓</span>
              <span class="meta-line" style="margin:0;">Restaurar el servicio</span>
            </div>
          </div>
          <div class="two-col__card fw-itil-border">
            <h3>PROBLEMA</h3>
            <p>«Causa o patrón que explica uno o varios incidentes.»</p>
            <p><em>Ej.: Saturación recurrente con alta concurrencia.</em></p>
            <div class="chain-flow" style="margin-top:0.75rem;">
              <span class="chain-flow__node">PROBLEMA</span>
              <span class="chain-flow__arrow">↓</span>
              <span class="meta-line" style="margin:0;">Identificar y reducir la causa recurrente</span>
            </div>
          </div>
        </div>
        ${classifyHtml("incProb", STAGE5_INC_PROB_ITEMS, STAGE5_INC_PROB_CATS)}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">3 · DECIDE · Cambios</p>
      <div class="stage-block__body">
        <h3 class="h3">No todo incidente empieza con una falla</h3>
        <div class="change-flow" aria-label="Ciclo de cambio">
          ${["Cambio", "Riesgo", "Prueba", "Autorización", "Implementación", "Validación", "Reversa"]
            .map(
              (t, i, arr) =>
                `<span>${t}</span>${i < arr.length - 1 ? '<span class="change-flow__arrow">↓</span>' : ""}`
            )
            .join("")}
        </div>
        ${quizHtml("qChange", STAGE5_Q_CHANGE)}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">4 · OBSERVA · Monitoreo</p>
      <div class="stage-block__body">
        <div class="microcase-grid">
          <div class="two-col__card"><strong>Situación:</strong> backup fallando 7 días</div>
          <div class="two-col__card"><strong>Problema de gestión:</strong> detección tardía</div>
          <div class="two-col__card"><strong>Práctica:</strong> monitoreo y gestión de eventos</div>
          <div class="two-col__card"><strong>Acción:</strong> alerta + ticket</div>
          <div class="two-col__card"><strong>Indicador:</strong> tiempo de detección</div>
        </div>
        <div class="chain-flow" style="margin-top:1rem;">
          <span class="chain-flow__node">SITUACIÓN</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">PRÁCTICA</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">ACCIÓN</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">BENEFICIO</span>
        </div>
        <p class="meta-line">No basta escribir «Aplicar ITIL».</p>
        ${builderHtml("itilBuilder", STAGE5_ITIL_BUILDER)}
        ${quizHtml("qAlerts", STAGE5_Q_ALERTS)}
      </div>
    </article>
  `;
}

function renderStep2() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO · COBIT</p>
      <div class="stage-block__body fw-panel fw-cobit">
        <h2 class="h2">COBIT: gobernar no es operar</h2>
        <div class="two-col">
          <div class="two-col__card">
            <h3>GOBIERNO</h3>
            <p>Evalúa necesidades, dirige con decisiones y prioridades, monitorea resultados.</p>
            <div class="chain-flow">
              <span class="chain-flow__node">EVALUAR</span>
              <span class="chain-flow__arrow">↓</span>
              <span class="chain-flow__node">DIRIGIR</span>
              <span class="chain-flow__arrow">↓</span>
              <span class="chain-flow__node">MONITOREAR</span>
            </div>
          </div>
          <div class="two-col__card">
            <h3>GESTIÓN</h3>
            <p>Planifica, construye, ejecuta y monitorea actividades.</p>
            <div class="chain-flow">
              <span class="chain-flow__node">PLANIFICAR</span>
              <span class="chain-flow__arrow">↓</span>
              <span class="chain-flow__node">IMPLEMENTAR</span>
              <span class="chain-flow__arrow">↓</span>
              <span class="chain-flow__node">OPERAR</span>
              <span class="chain-flow__arrow">↓</span>
              <span class="chain-flow__node">MEDIR</span>
            </div>
          </div>
        </div>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · DECIDE · Gobierno o gestión</p>
      <div class="stage-block__body">
        ${classifyHtml("govMgmt", STAGE5_GOV_MGMT_ITEMS, STAGE5_GOV_MGMT_CATS)}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">3 · OBSERVA · Estructura</p>
      <div class="stage-block__body">
        <div class="chain-flow">
          <span class="chain-flow__node">PROBLEMA</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">DECISIÓN</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">RESPONSABLE</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">INDICADOR</span>
        </div>
        <div class="two-col" style="margin-top:1rem;">
          <div class="two-col__card fw-cobit-border">
            <p><strong>Problema:</strong> No existe SLA para el servicio crítico.</p>
            <p><strong>Decisión:</strong> Definir y aprobar un nivel de servicio.</p>
            <p><strong>Responsables:</strong> Dirección de TI + dueño del servicio.</p>
            <p><strong>Indicador:</strong> % cumplimiento del SLA.</p>
          </div>
          <div class="two-col__card fw-cobit-border">
            <p><strong>Problema:</strong> Inversiones por urgencia.</p>
            <p><strong>Decisión:</strong> Criterios corporativos de priorización.</p>
            <p><strong>Responsable:</strong> Comité / dirección.</p>
            <p><strong>Indicador:</strong> % inversiones evaluadas con criterios.</p>
          </div>
        </div>
        ${quizHtml("qCobit", STAGE5_Q_COBIT)}
        ${builderHtml("cobitBuilder", STAGE5_COBIT_BUILDER)}
        ${ConsultantTip({
          text: "No pongas al CIO como responsable de todo. Identifica quién realmente debe tomar, aprobar, ejecutar o supervisar cada decisión.",
        })}
      </div>
    </article>
  `;
}

function renderStep3() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO · ISO 27001</p>
      <div class="stage-block__body fw-panel fw-iso">
        <h2 class="h2">ISO 27001: pensar en riesgo</h2>
        <p>El objetivo NO es implementar completamente ISO 27001. Aplica la lógica:</p>
        <div class="chain-flow">
          <span class="chain-flow__node">ACTIVO</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">AMENAZA</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">VULNERABILIDAD</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">IMPACTO</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">CONTROL</span>
        </div>
        <ul class="plain-list" style="margin-top:1rem;">
          <li><strong>Activo:</strong> algo de valor (BD, información clínica, credenciales, servicio crítico).</li>
          <li><strong>Amenaza:</strong> evento o agente que podría causar daño.</li>
          <li><strong>Vulnerabilidad:</strong> debilidad explotable (MFA ausente, cuentas antiguas, parches pendientes).</li>
          <li><strong>Impacto:</strong> consecuencia.</li>
          <li><strong>Control:</strong> medida para reducir el riesgo.</li>
        </ul>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · OBSERVA · Amenaza vs vulnerabilidad</p>
      <div class="stage-block__body">
        <div class="two-col">
          <div class="two-col__card fw-iso-border">
            <h3>AMENAZA</h3>
            <p>«Acceso no autorizado»</p>
            <p class="meta-line">Evento / agente</p>
          </div>
          <div class="two-col__card fw-iso-border">
            <h3>VULNERABILIDAD</h3>
            <p>«Usuarios comparten credenciales»</p>
            <p class="meta-line">Debilidad</p>
          </div>
        </div>
        <p class="meta-line" style="margin-top:0.75rem;">Si una situación puede variar según contexto, el feedback lo explica.</p>
        ${classifyHtml("threatVuln", STAGE5_THREAT_ITEMS, STAGE5_THREAT_CATS)}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">3 · DECIDE</p>
      <div class="stage-block__body">
        ${builderHtml("isoBuilder", STAGE5_ISO_BUILDER)}
        ${quizHtml("qVuln", STAGE5_Q_VULN)}
        ${
          local.qVuln.status === "correct"
            ? quizHtml("qThreat", STAGE5_Q_THREAT)
            : `<p class="meta-line">Tras acertar la vulnerabilidad, identifica la amenaza asociada.</p>`
        }
      </div>
    </article>
  `;
}

function renderStep4() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">Comparar los tres marcos</h2>
        ${FrameworkComparison({ rows: STAGE5_COMPARE_ROWS })}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · DECIDE · Elige la perspectiva</p>
      <div class="stage-block__body">
        ${classifyHtml("chooseFw", STAGE5_CHOOSE_ITEMS, STAGE5_FW_CATS)}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">3 · OBSERVA · Misma situación, distintas preguntas</p>
      <div class="stage-block__body">
        <p>Los marcos no son compartimentos totalmente aislados.</p>
        <p><strong>Ejemplo: cambio no autorizado</strong></p>
        <div class="fw-grid">
          <div class="fw-card fw-itil"><h3>ITIL</h3><p>¿Cómo gestionamos mejor el cambio?</p></div>
          <div class="fw-card fw-cobit"><h3>COBIT</h3><p>¿Quién tiene autoridad para aprobar cambios?</p></div>
          <div class="fw-card fw-iso"><h3>ISO 27001</h3><p>¿Qué riesgo genera el cambio sobre la información?</p></div>
        </div>
        <div class="chain-flow" style="margin-top:1rem;">
          <span class="chain-flow__node">MISMA SITUACIÓN</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">DIFERENTES PREGUNTAS</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">DIFERENTES PERSPECTIVAS</span>
        </div>
        <div class="btn-row" style="justify-content:flex-start;margin-top:1rem;">
          <button type="button" class="btn btn-primary" data-action="mark-multi" ${
            local.multiSeen ? "disabled" : ""
          }>
            ${local.multiSeen ? "Comprendido ✓" : "Entiendo: una situación puede tener varias perspectivas"}
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderStep5() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · OBSERVA · Mini caso</p>
      <div class="stage-block__body">
        <h2 class="h2">Caso integrador</h2>
        <div class="microcase-grid">
          <div class="two-col__card">Backup fallando 3 días · sin ticket automático</div>
          <div class="two-col__card">Cuentas de antiguos empleados activas</div>
          <div class="two-col__card">Cambios de producción aprobados informalmente</div>
          <div class="two-col__card">No existe SLA · no está claro quién aprueba continuidad</div>
        </div>
        <p>Construye: 1 análisis ITIL · 1 COBIT · 1 ISO 27001.</p>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · DECIDE · ITIL</p>
      <div class="stage-block__body">${builderHtml("miniItil", STAGE5_MINI_ITIL)}</div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">3 · DECIDE · COBIT</p>
      <div class="stage-block__body">${builderHtml("miniCobit", STAGE5_MINI_COBIT)}</div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">4 · DECIDE · ISO 27001</p>
      <div class="stage-block__body">${builderHtml("miniIso", STAGE5_MINI_ISO)}</div>
    </article>
  `;
}

function renderStep6(state) {
  const cl = state.stage5?.checklist || {};
  const ready = STAGE5_CHECKPOINT.every(
    (ck) => local.checkpoint[ck.id]?.status === "correct" || state.stage5?.checkpoint?.[ck.id]
  );
  return `
    <article class="stage-block">
      <p class="stage-block__label">APLICA A TU CASO</p>
      <div class="stage-block__body">
        <div class="apply-card">
          <h2 class="h2">APLICA A TU CASO</h2>
          <p>Ahora vuelve al caso asignado.</p>

          <div class="fw-panel fw-itil" style="margin:1rem 0;padding:1rem;border-radius:10px;">
            <h3>ITIL — mínimo 4 situaciones</h3>
            <p>Para cada una: Situación · Práctica · Acción · Beneficio</p>
            <ul class="check-list">
              ${STAGE5_APPLY_ITIL.map(
                (c) => `
                <li><label><input type="checkbox" data-check5="${c.id}" ${cl[c.id] ? "checked" : ""}/> ${c.label}</label></li>`
              ).join("")}
            </ul>
          </div>

          <div class="fw-panel fw-cobit" style="margin:1rem 0;padding:1rem;border-radius:10px;">
            <h3>COBIT — mínimo 3 situaciones</h3>
            <p>Para cada una: Problema · Decisión · Responsable · Indicador</p>
            <ul class="check-list">
              ${STAGE5_APPLY_COBIT.map(
                (c) => `
                <li><label><input type="checkbox" data-check5="${c.id}" ${cl[c.id] ? "checked" : ""}/> ${c.label}</label></li>`
              ).join("")}
            </ul>
          </div>

          <div class="fw-panel fw-iso" style="margin:1rem 0;padding:1rem;border-radius:10px;">
            <h3>ISO 27001 — mínimo 5 riesgos</h3>
            <p>Para cada uno: Activo · Amenaza · Vulnerabilidad · Impacto · Control</p>
            <ul class="check-list">
              ${STAGE5_APPLY_ISO.map(
                (c) => `
                <li><label><input type="checkbox" data-check5="${c.id}" ${cl[c.id] ? "checked" : ""}/> ${c.label}</label></li>`
              ).join("")}
            </ul>
          </div>
        </div>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">CHECKPOINT</p>
      <div class="stage-block__body">
        <div class="fw-grid" style="margin-bottom:1rem;">
          <div class="fw-card fw-itil"><h3>ITIL</h3><p>Gestionar el servicio</p></div>
          <div class="fw-card fw-cobit"><h3>COBIT</h3><p>Gobernar y controlar</p></div>
          <div class="fw-card fw-iso"><h3>ISO 27001</h3><p>Gestionar riesgos de información</p></div>
        </div>
        <div data-quiz="checkpoint">
          ${FrameworkQuickPick({ items: STAGE5_CHECKPOINT, answers: local.checkpoint })}
        </div>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">FINALIZAR</p>
      <div class="stage-block__body">
        ${
          state.stage5Complete
            ? `
          <div class="complete-banner">
            <p class="h2" style="margin:0;">Ya sabes qué ocurre.</p>
            <p>Ya sabes cómo gestionarlo, gobernarlo y protegerlo.</p>
            <p><strong>Ahora debes decidir qué hacer.</strong></p>
            <p class="meta-line">Etapa 5 de 6 · Completada</p>
            <button type="button" class="btn btn-cta" data-action="go-stage6">ETAPA 6 · DECIDIR Y SUSTENTAR</button>
          </div>`
            : `
          <button type="button" class="btn btn-cta" data-action="finish-stage5" ${ready ? "" : "disabled"}>
            FINALIZAR ETAPA 5
          </button>
          ${!ready ? `<p class="meta-line">Completa el checkpoint de marcos para finalizar.</p>` : ""}`
        }
      </div>
    </article>
  `;
}

function itilReady(state) {
  const s = state.stage5;
  return (
    (local.incProb.status === "correct" || s.incProb) &&
    (local.qChange.status === "correct" || s.qChange) &&
    (local.itilBuilder.complete || s.itilBuilder) &&
    (local.qAlerts.status === "correct" || s.qAlerts)
  );
}

function cobitReady(state) {
  const s = state.stage5;
  return (
    (local.govMgmt.status === "correct" || s.govMgmt) &&
    (local.qCobit.status === "correct" || s.qCobit) &&
    (local.cobitBuilder.complete || s.cobitBuilder)
  );
}

function isoReady(state) {
  const s = state.stage5;
  return (
    (local.threatVuln.status === "correct" || s.threatVuln) &&
    (local.isoBuilder.complete || s.isoBuilder) &&
    (local.qVuln.status === "correct" || s.qVuln) &&
    (local.qThreat.status === "correct" || s.qThreat)
  );
}

function compareReady(state) {
  const s = state.stage5;
  return (
    (local.chooseFw.status === "correct" || s.chooseFw) &&
    (local.multiSeen || s.multiSeen)
  );
}

function miniReady(state) {
  const s = state.stage5;
  return (
    (local.miniItil.complete || s.miniItil) &&
    (local.miniCobit.complete || s.miniCobit) &&
    (local.miniIso.complete || s.miniIso)
  );
}

function canAdvance(step, state) {
  const gate = STAGE5_STEPS[step].gate;
  if (gate === "classifyFw")
    return local.classifyFw.status === "correct" || state.stage5.classifyFw;
  if (gate === "itilBlock") return itilReady(state);
  if (gate === "cobitBlock") return cobitReady(state);
  if (gate === "isoBlock") return isoReady(state);
  if (gate === "compareBlock") return compareReady(state);
  if (gate === "miniBlock") return miniReady(state);
  if (gate === "checkpoint")
    return STAGE5_CHECKPOINT.every(
      (ck) => local.checkpoint[ck.id]?.status === "correct" || state.stage5?.checkpoint?.[ck.id]
    );
  return true;
}

export function Stage5Page(state) {
  if (!local) resetStage5Local(state);
  const step = Math.min(state.stage5Step || 0, STAGE5_STEPS.length - 1);
  let body = "";
  if (step === 0) body = renderStep0();
  if (step === 1) body = renderStep1();
  if (step === 2) body = renderStep2();
  if (step === 3) body = renderStep3();
  if (step === 4) body = renderStep4();
  if (step === 5) body = renderStep5();
  if (step === 6) body = renderStep6(state);

  const isLast = step === STAGE5_STEPS.length - 1;

  return `
    <section class="page stage5" aria-label="Etapa 5 GOBERNAR">
      <header class="card card-pad">
        <p class="eyebrow">Etapa 5 · GOBERNAR</p>
        <h1 class="h1" style="font-size:1.55rem;">${STAGE5_STEPS[step].title}</h1>
        <p class="lead">Los tres marcos aportan perspectivas diferentes. No son intercambiables.</p>
        ${stepDots(step)}
      </header>
      <div class="stage-layout">${body}</div>
      ${
        state.stage5Complete && isLast
          ? ""
          : NavigationButtons({
              canGoPrev: true,
              canGoNext: !isLast && canAdvance(step, state),
              prevLabel: step === 0 ? "VOLVER AL MAPA" : "ANTERIOR",
              nextLabel: "CONTINUAR",
            })
      }
    </section>
  `;
}

export function bindStage5(root, { store, render }) {
  const state = store.getState();
  const step = state.stage5Step || 0;

  const bindQuiz = (key, question, gateName) => {
    bindStandardQuiz({
      root,
      local,
      key,
      question,
      gateName,
      markGate: (g, v) => store.markStage5Gate(g, v),
      render,
      stageId: 5,
      store,
      activityPrefix: "s5",
    });
  };

  const bindClassify = (key, items, gateName, messages = {}) => {
    const scope = root.querySelector(`[data-quiz="${key}"]`);
    if (!scope) return;
    bindTripleClassify(scope, {
      onAssign(id, bucket) {
        if (local[key].checked) return;
        local[key].assignments = { ...local[key].assignments, [id]: bucket };
        render();
      },
      onRemove(id) {
        if (local[key].checked) return;
        const next = { ...local[key].assignments };
        delete next[id];
        local[key].assignments = next;
        render();
      },
      onCheck() {
        const result = evaluateTripleClassify(items, local[key].assignments);
        local[key].checked = true;
        local[key].status = result.status;
        if (result.status === "correct") {
          local[key].message =
            messages.correct ||
            "Correcto. Estás diferenciando gestión del servicio, gobierno y seguridad de la información.";
          store.markStage5Gate(gateName, true);
        } else if (result.status === "partial") {
          local[key].message =
            messages.partial ||
            "Algunas situaciones pueden relacionarse con más de un marco, pero debes identificar cuál perspectiva responde mejor a la pregunta principal.";
        } else {
          local[key].message =
            messages.incorrect ||
            "Revisa qué pregunta responde mejor cada marco ante esa situación.";
        }
        render();
      },
      onRetry() {
        local[key] = { assignments: {}, checked: false, status: null, message: "" };
        store.markStage5Gate(gateName, false);
        render();
      },
    });
  };

  const bindBuilder = (key, config, gateName) => {
    const scope = root.querySelector(`[data-builder="${key}"]`);
    if (!scope || local[key].complete) return;
    const stepCfg = config.steps[local[key].stepIndex];
    if (!stepCfg) return;
    bindAnalysisBuilder(scope, {
      onSelect(id) {
        if (local[key].stepFeedback?.checked) return;
        local[key].selections = { ...local[key].selections, [stepCfg.id]: id };
        render();
      },
      onCheck() {
        const result = evaluateAnalysisStep(stepCfg, local[key].selections[stepCfg.id]);
        local[key].stepFeedback = {
          checked: true,
          status: result.status,
          message: result.message,
        };
        if (result.status === "correct") {
          const next = local[key].stepIndex + 1;
          if (next >= config.steps.length) {
            local[key].complete = true;
            store.markStage5Gate(gateName, true);
          } else {
            local[key].stepIndex = next;
            local[key].stepFeedback = null;
          }
        }
        render();
      },
      onRetry() {
        const id = config.steps[local[key].stepIndex].id;
        const next = { ...local[key].selections };
        delete next[id];
        local[key].selections = next;
        local[key].stepFeedback = null;
        render();
      },
    });
  };

  if (step === 0) {
    bindClassify("classifyFw", STAGE5_FW_ITEMS, "classifyFw", {
      correct:
        "Correcto. Estás diferenciando gestión del servicio, gobierno y seguridad de la información.",
      partial:
        "Algunas situaciones pueden relacionarse con más de un marco, pero debes identificar cuál perspectiva responde mejor a la pregunta principal.",
    });
  }

  if (step === 1) {
    bindClassify("incProb", STAGE5_INC_PROB_ITEMS, "incProb", {
      correct: "Correcto. Incidente restaura el servicio; problema busca la causa recurrente.",
      partial: "Revisa: ¿restaura el servicio (incidente) o apunta a una causa recurrente (problema)?",
    });
    bindQuiz("qChange", STAGE5_Q_CHANGE, "qChange");
    bindBuilder("itilBuilder", STAGE5_ITIL_BUILDER, "itilBuilder");
    bindQuiz("qAlerts", STAGE5_Q_ALERTS, "qAlerts");
  }

  if (step === 2) {
    bindClassify("govMgmt", STAGE5_GOV_MGMT_ITEMS, "govMgmt", {
      correct: "Correcto. Gobierno define dirección y control; gestión ejecuta.",
      partial: "Revisa si la acción ejecuta operación o define dirección/control.",
    });
    bindQuiz("qCobit", STAGE5_Q_COBIT, "qCobit");
    bindBuilder("cobitBuilder", STAGE5_COBIT_BUILDER, "cobitBuilder");
  }

  if (step === 3) {
    bindClassify("threatVuln", STAGE5_THREAT_ITEMS, "threatVuln", {
      correct:
        "Correcto. Amenaza es el evento/agente; vulnerabilidad es la debilidad. «Robo de información» suele tratarse como amenaza (o impacto según contexto).",
      partial:
        "Revisa amenaza vs vulnerabilidad. Algunas frases (p. ej. robo de información) pueden verse como amenaza o impacto según el contexto.",
    });
    bindBuilder("isoBuilder", STAGE5_ISO_BUILDER, "isoBuilder");
    bindQuiz("qVuln", STAGE5_Q_VULN, "qVuln");
    if (local.qVuln.status === "correct") bindQuiz("qThreat", STAGE5_Q_THREAT, "qThreat");
  }

  if (step === 4) {
    bindClassify("chooseFw", STAGE5_CHOOSE_ITEMS, "chooseFw", {
      correct: "Correcto. Identificaste la perspectiva principal de cada situación.",
      partial:
        "Algunas situaciones admiten más de un marco; elige la perspectiva que responde mejor a la pregunta principal.",
    });
    root.querySelector('[data-action="mark-multi"]')?.addEventListener("click", () => {
      local.multiSeen = true;
      store.markStage5Gate("multiSeen", true);
      render();
    });
  }

  if (step === 5) {
    bindBuilder("miniItil", STAGE5_MINI_ITIL, "miniItil");
    bindBuilder("miniCobit", STAGE5_MINI_COBIT, "miniCobit");
    bindBuilder("miniIso", STAGE5_MINI_ISO, "miniIso");
  }

  if (step === 6) {
    root.querySelectorAll("[data-check5]").forEach((input) => {
      input.addEventListener("change", () => {
        store.setStage5ChecklistItem(input.dataset.check5, input.checked);
      });
    });
    const scope = root.querySelector('[data-quiz="checkpoint"]');
    if (scope) {
      bindFrameworkQuickPick(scope, {
        onAnswer(id, ans) {
          const ck = STAGE5_CHECKPOINT.find((c) => c.id === id);
          if (!ck || local.checkpoint[id].checked) return;
          local.checkpoint[id].selectedId = ans;
          local.checkpoint[id].checked = true;
          local.checkpoint[id].status = ans === ck.correctId ? "correct" : "incorrect";
          if (ans === ck.correctId) store.markStage5Checkpoint(id, true);
          render();
        },
        onRetry(id) {
          local.checkpoint[id] = { selectedId: null, checked: false, status: null };
          store.markStage5Checkpoint(id, false);
          render();
        },
      });
    }
    root.querySelector('[data-action="finish-stage5"]')?.addEventListener("click", () => {
      if (!canAdvance(6, store.getState())) return;
      store.completeStage5();
      render();
    });
    root.querySelector('[data-action="go-stage6"]')?.addEventListener("click", () => {
      store.startStage6();
    });
  }

  bindNavigation(root, {
    onPrev() {
      if (step === 0) store.setView("path");
      else store.setStage5Step(step - 1);
    },
    onNext() {
      if (!canAdvance(step, store.getState())) return;
      if (step < STAGE5_STEPS.length - 1) store.setStage5Step(step + 1);
    },
  });
}
