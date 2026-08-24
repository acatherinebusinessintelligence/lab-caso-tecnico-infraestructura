import { ConsultantTip } from "../components/ConsultantTip.js";
import { LAB_CONFIG } from "../config/labConfig.js";
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
  OrderChain,
  evaluateOrder,
  shuffleIds,
  bindOrderChain,
} from "../components/OrderChain.js";
import {
  AnalysisChainBuilder,
  evaluateAnalysisStep,
  bindAnalysisBuilder,
} from "../components/FrameworkWidgets.js";
import {
  TechnologyOptionCompare,
  PriorityMatrix,
  PathCompare,
  MethodChain,
  FinalReadyBanner,
} from "../components/DecisionWidgets.js";
import { NavigationButtons, bindNavigation } from "../components/StageLayout.js";
import {
  STAGE6_STEPS,
  STAGE6_Q_CPU,
  STAGE6_Q_WEAK,
  STAGE6_Q_ONPREM,
  STAGE6_Q_CLOUD,
  STAGE6_Q_HYBRID,
  STAGE6_Q_EDGE,
  STAGE6_COMPARE_CRITERIA,
  STAGE6_Q_BEST,
  STAGE6_Q_RISK,
  STAGE6_CAPEX_CATS,
  STAGE6_CAPEX_ITEMS,
  STAGE6_Q_CAPEX_PEAK,
  STAGE6_Q_METRIC,
  STAGE6_Q_PRIORITY,
  STAGE6_DECISION_BUILDER,
  STAGE6_CHAIN_ITEMS,
  STAGE6_CHAIN_CORRECT,
  STAGE6_MINI_CAP,
  STAGE6_MINI_AVAIL,
  STAGE6_MINI_MON,
  STAGE6_Q_BEFORE_TECH,
  STAGE6_KNOWLEDGE,
  STAGE6_APPLY_CHECKS,
  STAGE6_FINAL_CHECKS,
} from "../data/stage6.js";

let local = null;

function emptyQuiz() {
  return { selectedId: null, checked: false, status: null, message: "", attempt: 0 };
}

function restoreBuilder(config, done) {
  if (!done) {
    return { stepIndex: 0, selections: {}, stepFeedback: null, complete: false };
  }
  return {
    stepIndex: config.steps.length,
    selections: Object.fromEntries(config.steps.map((s) => [s.id, s.correctId])),
    stepFeedback: null,
    complete: true,
  };
}

export function resetStage6Local(state) {
  const s6 = state.stage6 || {};
  local = {
    qCpu: {
      ...emptyQuiz(),
      checked: Boolean(s6.qCpu),
      status: s6.qCpu ? "correct" : null,
      message: s6.qCpu ? STAGE6_Q_CPU.feedback.correct : "",
    },
    qWeak: {
      ...emptyQuiz(),
      checked: Boolean(s6.qWeak),
      status: s6.qWeak ? "correct" : null,
      message: s6.qWeak ? STAGE6_Q_WEAK.feedback.correct : "",
    },
    qOnprem: {
      ...emptyQuiz(),
      checked: Boolean(s6.qOnprem),
      status: s6.qOnprem ? "correct" : null,
      message: s6.qOnprem ? STAGE6_Q_ONPREM.feedback.correct : "",
    },
    qCloud: {
      ...emptyQuiz(),
      checked: Boolean(s6.qCloud),
      status: s6.qCloud ? "correct" : null,
      message: s6.qCloud ? STAGE6_Q_CLOUD.feedback.correct : "",
    },
    qHybrid: {
      ...emptyQuiz(),
      checked: Boolean(s6.qHybrid),
      status: s6.qHybrid ? "correct" : null,
      message: s6.qHybrid ? STAGE6_Q_HYBRID.feedback.correct : "",
    },
    qEdge: {
      ...emptyQuiz(),
      checked: Boolean(s6.qEdge),
      status: s6.qEdge ? "correct" : null,
      message: s6.qEdge ? STAGE6_Q_EDGE.feedback.correct : "",
    },
    compareSeen: Boolean(s6.compareSeen),
    qBest: {
      ...emptyQuiz(),
      checked: Boolean(s6.qBest),
      status: s6.qBest ? "correct" : null,
      message: s6.qBest ? STAGE6_Q_BEST.feedback.correct : "",
    },
    qRisk: {
      ...emptyQuiz(),
      checked: Boolean(s6.qRisk),
      status: s6.qRisk ? "correct" : null,
      message: s6.qRisk ? STAGE6_Q_RISK.feedback.correct : "",
    },
    capex: {
      assignments: s6.capex
        ? Object.fromEntries(STAGE6_CAPEX_ITEMS.map((i) => [i.id, i.bucket]))
        : {},
      checked: Boolean(s6.capex),
      status: s6.capex ? "correct" : null,
      message: s6.capex ? "Correcto. CAPEX = inversión en activos; OPEX = gasto recurrente." : "",
    },
    qCapexPeak: {
      ...emptyQuiz(),
      checked: Boolean(s6.qCapexPeak),
      status: s6.qCapexPeak ? "correct" : null,
      message: s6.qCapexPeak ? STAGE6_Q_CAPEX_PEAK.feedback.correct : "",
    },
    qMetric: {
      ...emptyQuiz(),
      checked: Boolean(s6.qMetric),
      status: s6.qMetric ? "correct" : null,
      message: s6.qMetric ? STAGE6_Q_METRIC.feedback.correct : "",
    },
    qPriority: {
      ...emptyQuiz(),
      checked: Boolean(s6.qPriority),
      status: s6.qPriority ? "correct" : null,
      message: s6.qPriority ? STAGE6_Q_PRIORITY.feedback.correct : "",
    },
    decisionBuilder: restoreBuilder(STAGE6_DECISION_BUILDER, s6.decisionBuilder),
    chain: {
      order: s6.chain ? [...STAGE6_CHAIN_CORRECT] : shuffleIds(STAGE6_CHAIN_CORRECT),
      checked: Boolean(s6.chain),
      status: s6.chain ? "correct" : null,
      message: s6.chain
        ? "Correcto. Problema → Evidencia → Impacto → Decisión → Métrica."
        : "",
    },
    miniCap: restoreBuilder(STAGE6_MINI_CAP, s6.miniCap),
    miniAvail: restoreBuilder(STAGE6_MINI_AVAIL, s6.miniAvail),
    miniMon: restoreBuilder(STAGE6_MINI_MON, s6.miniMon),
    qBefore: {
      ...emptyQuiz(),
      checked: Boolean(s6.qBefore),
      status: s6.qBefore ? "correct" : null,
      message: s6.qBefore ? STAGE6_Q_BEFORE_TECH.feedback.correct : "",
    },
    knowledge: Object.fromEntries(
      STAGE6_KNOWLEDGE.map((q) => {
        const done = s6.knowledge?.[q.id];
        return [
          q.id,
          {
            selectedId: done ? q.correctId : null,
            checked: Boolean(done),
            status: done ? "correct" : null,
            message: done ? q.feedback.correct : "",
          },
        ];
      })
    ),
  };
}

function stepDots(step) {
  return `
    <div class="step-dots" aria-label="Progreso dentro de la Etapa 6">
      ${STAGE6_STEPS.map(
        (_, i) => `
        <span class="step-dot ${i === step ? "is-active" : ""} ${i < step ? "is-done" : ""}"></span>
      `
      ).join("")}
      <span class="step-dots__label">Paso ${step + 1} de ${STAGE6_STEPS.length}</span>
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

function renderStep0() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">La tecnología viene después del diagnóstico</h2>
        <p class="lead" style="margin:0 0 1rem;">No existe una tecnología correcta por defecto. Existe una decisión que debe poder justificarse.</p>
        ${PathCompare()}
        ${ConsultantTip({
          text: "Si tu recomendación comienza con el nombre de una tecnología, revisa si realmente partiste del problema.",
        })}
        ${quizHtml("qCpu", STAGE6_Q_CPU)}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · OBSERVA · De diagnóstico a decisión</p>
      <div class="stage-block__body">
        <div class="chain-flow">
          <span class="chain-flow__node">HALLAZGO</span>
          <span class="meta-line" style="margin:0;">Degradación durante picos de demanda</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">EVIDENCIA</span>
          <span class="meta-line" style="margin:0;">CPU 95 % · Latencia 900 ms · Demanda ×3</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">IMPACTO</span>
          <span class="meta-line" style="margin:0;">Tiempos de respuesta elevados</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">PREGUNTA</span>
          <span class="meta-line" style="margin:0;">¿Cómo soportar demanda variable sin degradar el servicio?</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="meta-line" style="margin:0;">Alternativas: optimizar · escalar · elasticidad · servicio administrado…</span>
        </div>
        <p class="meta-line">No todas las alternativas deben aparecer en todos los casos.</p>
        ${quizHtml("qWeak", STAGE6_Q_WEAK)}
      </div>
    </article>
  `;
}

function renderStep1() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO · On-premise</p>
      <div class="stage-block__body">
        <h2 class="h2">On-premise: mantener control local</h2>
        <div class="two-col">
          <div class="two-col__card">
            <h3>Puede ser pertinente</h3>
            <ul class="plain-list">
              <li>control directo;</li>
              <li>latencia local;</li>
              <li>requisitos regulatorios;</li>
              <li>integración existente;</li>
              <li>operación local crítica;</li>
              <li>cargas estables;</li>
              <li>inversiones ya realizadas;</li>
              <li>restricciones de conectividad.</li>
            </ul>
          </div>
          <div class="two-col__card">
            <h3>Posibles retos</h3>
            <ul class="plain-list">
              <li>inversión inicial;</li>
              <li>renovación de hardware;</li>
              <li>capacidad ociosa;</li>
              <li>mantenimiento;</li>
              <li>personal especializado;</li>
              <li>escalamiento más lento.</li>
            </ul>
          </div>
        </div>
        <p class="meta-line">On-premise no es «tecnología antigua» ni incorrecta por defecto.</p>
        ${quizHtml("qOnprem", STAGE6_Q_ONPREM)}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · CONCEPTO · Cloud</p>
      <div class="stage-block__body">
        <h2 class="h2">Cloud: capacidad y servicios flexibles</h2>
        <div class="two-col">
          <div class="two-col__card">
            <h3>Potenciales ventajas</h3>
            <ul class="plain-list">
              <li>elasticidad;</li>
              <li>aprovisionamiento rápido;</li>
              <li>servicios administrados;</li>
              <li>pago por consumo;</li>
              <li>expansión geográfica;</li>
              <li>automatización.</li>
            </ul>
          </div>
          <div class="two-col__card">
            <h3>Riesgos / retos</h3>
            <ul class="plain-list">
              <li>costo variable;</li>
              <li>dependencia de proveedor;</li>
              <li>conectividad;</li>
              <li>gobierno de consumo;</li>
              <li>seguridad y configuración;</li>
              <li>habilidades y arquitectura.</li>
            </ul>
          </div>
        </div>
        <div class="callout-warn"><strong>Cloud no significa automáticamente menor costo.</strong></div>
        ${ConsultantTip({
          text: "Elasticidad sin gobierno puede convertirse en crecimiento descontrolado del gasto.",
        })}
        ${quizHtml("qCloud", STAGE6_Q_CLOUD)}
      </div>
    </article>
  `;
}

function renderStep2() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO · Híbrido</p>
      <div class="stage-block__body">
        <h2 class="h2">Híbrido no significa mitad cloud y mitad local</h2>
        <p>Combina modelos cuando existe una razón técnica u operativa.</p>
        <ul class="plain-list">
          <li>core local · portal elástico en cloud;</li>
          <li>backup replicado externamente;</li>
          <li>históricos en cloud;</li>
          <li>procesamiento crítico cerca de la operación.</li>
        </ul>
        <p><strong>Pregunta clave:</strong> ¿Qué componente debe estar dónde y por qué?</p>
        <p class="meta-line">Evita «lo mejor de ambos mundos» sin justificación.</p>
        ${quizHtml("qHybrid", STAGE6_Q_HYBRID)}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · CONCEPTO · Edge</p>
      <div class="stage-block__body">
        <h2 class="h2">Edge: procesar cerca de la operación</h2>
        <div class="two-col">
          <div class="two-col__card">
            <h3>Puede tener sentido</h3>
            <p>Baja latencia, operación sin conectividad, menos tráfico, respuesta inmediata, dispositivos distribuidos (fábrica, tiendas, logística, sedes remotas).</p>
          </div>
          <div class="two-col__card">
            <h3>Puede NO tener sentido</h3>
            <p>Portal administrativo central, correo, sistemas sin necesidad de procesamiento local. No propongas edge solo porque hay varias sedes.</p>
          </div>
        </div>
        ${quizHtml("qEdge", STAGE6_Q_EDGE)}
      </div>
    </article>
  `;
}

function renderStep3() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · OBSERVA · Comparador</p>
      <div class="stage-block__body">
        <h2 class="h2">Comparar alternativas</h2>
        ${TechnologyOptionCompare({ rows: STAGE6_COMPARE_CRITERIA })}
        <div class="btn-row" style="justify-content:flex-start;">
          <button type="button" class="btn btn-primary" data-action="mark-compare" ${
            local.compareSeen ? "disabled" : ""
          }>
            ${local.compareSeen ? "Comparación revisada ✓" : "He revisado la matriz (sin ganador universal)"}
          </button>
        </div>
        ${quizHtml("qBest", STAGE6_Q_BEST)}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · CONCEPTO · Riesgo introducido</p>
      <div class="stage-block__body">
        <h3 class="h3">Toda solución también introduce riesgos</h3>
        <div class="chain-flow">
          <span class="chain-flow__node">DECISIÓN</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="meta-line" style="margin:0;">Beneficio + Nuevo riesgo</span>
        </div>
        <div class="two-col" style="margin-top:1rem;">
          <div class="two-col__card">
            <p><strong>Migrar a cloud:</strong> elasticidad · riesgo: dependencia de conectividad/proveedor.</p>
          </div>
          <div class="two-col__card">
            <p><strong>Procesamiento en 80 tiendas:</strong> continuidad · riesgo: complejidad operativa.</p>
          </div>
        </div>
        ${quizHtml("qRisk", STAGE6_Q_RISK)}
      </div>
    </article>
  `;
}

function renderStep4() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO · CAPEX / OPEX</p>
      <div class="stage-block__body">
        <h2 class="h2">¿Cómo se paga la decisión?</h2>
        <div class="two-col">
          <div class="two-col__card">
            <h3>CAPEX</h3>
            <p>Inversión en activos: servidores, almacenamiento, switches, appliances.</p>
          </div>
          <div class="two-col__card">
            <h3>OPEX</h3>
            <p>Gasto recurrente: cloud, SaaS, servicios administrados, soporte, suscripciones.</p>
          </div>
        </div>
        <p class="meta-line">Una solución puede combinar ambos.</p>
        <div data-quiz="capex">
          ${TripleClassify({
            items: STAGE6_CAPEX_ITEMS,
            categories: STAGE6_CAPEX_CATS,
            assignments: local.capex.assignments,
            checked: local.capex.checked,
            feedbackStatus: local.capex.status,
            feedbackMessage: local.capex.message,
          attempt: local.capex.attempt || 1,
          })}
        </div>
        ${quizHtml("qCapexPeak", STAGE6_Q_CAPEX_PEAK)}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · CONCEPTO · Métricas de éxito</p>
      <div class="stage-block__body">
        <h3 class="h3">¿Cómo sabrás si la decisión funcionó?</h3>
        <div class="microcase-grid">
          <div class="two-col__card">MTTR alto → mejorar respuesta → <strong>métrica: MTTR</strong></div>
          <div class="two-col__card">Alta latencia → capacidad → <strong>latencia p95</strong></div>
          <div class="two-col__card">Backup sin detección → monitoreo → <strong>% exitosos + detección</strong></div>
          <div class="two-col__card">Almacenamiento sin control → ciclo de vida → <strong>crecimiento + % usado</strong></div>
        </div>
        ${quizHtml("qMetric", STAGE6_Q_METRIC)}
      </div>
    </article>
  `;
}

function renderStep5() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO · Priorizar</p>
      <div class="stage-block__body">
        <h2 class="h2">No todas las mejoras pueden ejecutarse primero</h2>
        <p>Criterios: criticidad, impacto, riesgo, urgencia, costo, esfuerzo, dependencia, beneficio, factibilidad.</p>
        ${PriorityMatrix()}
        <p class="meta-line">No es una fórmula rígida.</p>
        ${quizHtml("qPriority", STAGE6_Q_PRIORITY)}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · DECIDE · DecisionBuilder</p>
      <div class="stage-block__body">
        <p>Construye la cadena completa. El builder no genera la solución: enseña la secuencia.</p>
        ${builderHtml("decisionBuilder", STAGE6_DECISION_BUILDER)}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">3 · DECIDE · Ordena la cadena</p>
      <div class="stage-block__body">
        <div data-quiz="chain">
          ${OrderChain({
            items: STAGE6_CHAIN_ITEMS,
            order: local.chain.order,
            checked: local.chain.checked,
            feedbackStatus: local.chain.status,
            feedbackMessage: local.chain.message,
          attempt: local.chain.attempt || 1,
          })}
        </div>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">4 · MINI CASO INTEGRADOR</p>
      <div class="stage-block__body">
        <div class="microcase-grid" style="margin-bottom:1rem;">
          <div class="two-col__card">24/7 · Disp. 98,4 % · MTTR 3,8 h</div>
          <div class="two-col__card">CPU 93 % · Latencia 850 ms · Demanda +40 %</div>
          <div class="two-col__card">Almacenamiento 87 % · +5 %/mes · Backup sin detección</div>
          <div class="two-col__card">Una instancia de autenticación · presupuesto limitado</div>
        </div>
        <p>Construye 3 recomendaciones sustentadas (capacidad, disponibilidad, monitoreo). Se aceptan alternativas distintas si están bien justificadas.</p>
        ${builderHtml("miniCap", STAGE6_MINI_CAP)}
        ${builderHtml("miniAvail", STAGE6_MINI_AVAIL)}
        ${builderHtml("miniMon", STAGE6_MINI_MON)}
      </div>
    </article>
  `;
}

function renderStep6(state) {
  const cl = state.stage6?.checklist || {};
  const fl = state.stage6?.finalChecklist || {};
  const knowledgeOk = STAGE6_KNOWLEDGE.every(
    (q) => local.knowledge[q.id]?.status === "correct" || state.stage6?.knowledge?.[q.id]
  );
  const beforeOk = local.qBefore.status === "correct" || state.stage6?.qBefore;

  return `
    <article class="stage-block">
      <p class="stage-block__label">APLICA A TU CASO</p>
      <div class="stage-block__body">
        <div class="apply-card">
          <h2 class="h2">APLICA A TU CASO</h2>
          <p>Vuelve a los hallazgos de tu caso. Selecciona <strong>5 recomendaciones prioritarias</strong>.</p>
          <p>Para cada una responde: problema, evidencia, impacto, decisión, por qué, alternativa descartada, beneficio, riesgo, CAPEX/OPEX, indicador y prioridad.</p>
          <ul class="check-list">
            ${STAGE6_APPLY_CHECKS.map(
              (c) => `
              <li><label><input type="checkbox" data-check6="${c.id}" ${cl[c.id] ? "checked" : ""}/> ${c.label}</label></li>`
            ).join("")}
          </ul>
        </div>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">CHECKPOINT DEL MÉTODO</p>
      <div class="stage-block__body">
        ${MethodChain()}
        <div class="chain-flow" style="margin:1rem 0;">
          <span class="chain-flow__node">PROBLEMA</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">EVIDENCIA</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">IMPACTO</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">DECISIÓN</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">MÉTRICA</span>
        </div>
        ${quizHtml("qBefore", STAGE6_Q_BEFORE_TECH)}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">EVALUACIÓN FINAL</p>
      <div class="stage-block__body">
        <h3 class="h3">Comprensión del laboratorio (8 preguntas)</h3>
        ${STAGE6_KNOWLEDGE.map((q) => {
          const st = local.knowledge[q.id];
          return `
            <div data-quiz="know-${q.id}" style="margin-bottom:1rem;">
              ${QuestionCard({
                question: q,
                selectedId: st.selectedId,
                checked: st.checked,
                feedbackStatus: st.status,
                feedbackMessage: st.message,
                attempt: st.attempt || 1,
              })}
            </div>`;
        }).join("")}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">RESULTADO FINAL</p>
      <div class="stage-block__body">
        ${
          state.labComplete
            ? `
          ${FinalReadyBanner({ labComplete: true })}
          <ul class="check-list">
            ${STAGE6_FINAL_CHECKS.map(
              (c) => `
              <li><label><input type="checkbox" data-final6="${c.id}" ${fl[c.id] ? "checked" : ""}/> ${c.label}</label></li>`
            ).join("")}
          </ul>
          <div class="btn-row" style="justify-content:flex-start;flex-wrap:wrap;">
            <button type="button" class="btn btn-primary" data-action="back-path">VOLVER A LA RUTA</button>
            <button type="button" class="btn btn-secondary" data-action="review-stages">REVISAR ETAPAS</button>
          </div>
          ${
            state.labScore
              ? `<p class="meta-line">Progreso: 100 %. Evaluación final: ${state.labScore.finalAssessment.percent}% (${state.labScore.finalAssessment.correct}/${state.labScore.finalAssessment.expected}). El progreso no es la nota académica.</p>`
              : ""
          }`
            : `
          <h3 class="h3">Antes de finalizar, confirma:</h3>
          <ul class="check-list">
            ${STAGE6_FINAL_CHECKS.map(
              (c) => `
              <li><label><input type="checkbox" data-final6="${c.id}" ${fl[c.id] ? "checked" : ""}/> ${c.label}</label></li>`
            ).join("")}
          </ul>
          <button type="button" class="btn btn-cta" data-action="finish-lab" ${
            knowledgeOk && beforeOk ? "" : "disabled"
          }>
            FINALIZAR LABORATORIO
          </button>
          ${
            !(knowledgeOk && beforeOk)
              ? `<p class="meta-line">Completa el checkpoint del método y las 8 preguntas finales.</p>`
              : ""
          }`
        }
      </div>
    </article>
  `;
}

function startReady(state) {
  const s = state.stage6;
  return (
    (local.qCpu.status === "correct" || s.qCpu) &&
    (local.qWeak.status === "correct" || s.qWeak)
  );
}

function modelsReady(state) {
  const s = state.stage6;
  return (
    (local.qOnprem.status === "correct" || s.qOnprem) &&
    (local.qCloud.status === "correct" || s.qCloud)
  );
}

function hybridEdgeReady(state) {
  const s = state.stage6;
  return (
    (local.qHybrid.status === "correct" || s.qHybrid) &&
    (local.qEdge.status === "correct" || s.qEdge)
  );
}

function compareReady(state) {
  const s = state.stage6;
  return (
    (local.compareSeen || s.compareSeen) &&
    (local.qBest.status === "correct" || s.qBest) &&
    (local.qRisk.status === "correct" || s.qRisk)
  );
}

function financeReady(state) {
  const s = state.stage6;
  return (
    (local.capex.status === "correct" || s.capex) &&
    (local.qCapexPeak.status === "correct" || s.qCapexPeak) &&
    (local.qMetric.status === "correct" || s.qMetric)
  );
}

function decisionReady(state) {
  const s = state.stage6;
  return (
    (local.qPriority.status === "correct" || s.qPriority) &&
    (local.decisionBuilder.complete || s.decisionBuilder) &&
    (local.chain.status === "correct" || s.chain) &&
    (local.miniCap.complete || s.miniCap) &&
    (local.miniAvail.complete || s.miniAvail) &&
    (local.miniMon.complete || s.miniMon)
  );
}

function finalReady(state) {
  const s = state.stage6;
  const knowledgeOk = STAGE6_KNOWLEDGE.every(
    (q) => local.knowledge[q.id]?.status === "correct" || s.knowledge?.[q.id]
  );
  return (local.qBefore.status === "correct" || s.qBefore) && knowledgeOk;
}

function canAdvance(step, state) {
  const gate = STAGE6_STEPS[step].gate;
  if (gate === "startBlock") return startReady(state);
  if (gate === "modelsBlock") return modelsReady(state);
  if (gate === "hybridEdgeBlock") return hybridEdgeReady(state);
  if (gate === "compareBlock") return compareReady(state);
  if (gate === "financeBlock") return financeReady(state);
  if (gate === "decisionBlock") return decisionReady(state);
  if (gate === "finalBlock") return finalReady(state) || state.labComplete;
  return true;
}

export function Stage6Page(state) {
  if (!local) resetStage6Local(state);
  const step = Math.min(state.stage6Step || 0, STAGE6_STEPS.length - 1);
  let body = "";
  if (step === 0) body = renderStep0();
  if (step === 1) body = renderStep1();
  if (step === 2) body = renderStep2();
  if (step === 3) body = renderStep3();
  if (step === 4) body = renderStep4();
  if (step === 5) body = renderStep5();
  if (step === 6) body = renderStep6(state);

  const isLast = step === STAGE6_STEPS.length - 1;

  return `
    <section class="page stage6" aria-label="Etapa 6 DECIDIR">
      <header class="card card-pad">
        <p class="eyebrow">Etapa 6 · DECIDIR Y SUSTENTAR</p>
        <h1 class="h1" style="font-size:1.55rem;">${STAGE6_STEPS[step].title}</h1>
        <p class="lead">No existe una tecnología correcta por defecto. Existe una decisión que debe poder justificarse.</p>
        ${stepDots(step)}
      </header>
      <div class="stage-layout">${body}</div>
      ${
        state.labComplete && isLast
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

export function bindStage6(root, { store, render }) {
  const state = store.getState();
  const step = state.stage6Step || 0;

  const bindQuiz = (key, question, gateName) => {
    bindStandardQuiz({
      root,
      local,
      key,
      question,
      gateName,
      markGate: (g, v) => store.markStage6Gate(g, v),
      render,
      stageId: 6,
      store,
      activityPrefix: "s6",
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
            store.markStage6Gate(gateName, true);
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
    bindQuiz("qCpu", STAGE6_Q_CPU, "qCpu");
    bindQuiz("qWeak", STAGE6_Q_WEAK, "qWeak");
  }

  if (step === 1) {
    bindQuiz("qOnprem", STAGE6_Q_ONPREM, "qOnprem");
    bindQuiz("qCloud", STAGE6_Q_CLOUD, "qCloud");
  }

  if (step === 2) {
    bindQuiz("qHybrid", STAGE6_Q_HYBRID, "qHybrid");
    bindQuiz("qEdge", STAGE6_Q_EDGE, "qEdge");
  }

  if (step === 3) {
    root.querySelector('[data-action="mark-compare"]')?.addEventListener("click", () => {
      local.compareSeen = true;
      store.markStage6Gate("compareSeen", true);
      render();
    });
    bindQuiz("qBest", STAGE6_Q_BEST, "qBest");
    bindQuiz("qRisk", STAGE6_Q_RISK, "qRisk");
  }

  if (step === 4) {
    const scope = root.querySelector('[data-quiz="capex"]');
    if (scope) {
      bindTripleClassify(scope, {
        onAssign(id, bucket) {
          if (local.capex.checked) return;
          local.capex.assignments = { ...local.capex.assignments, [id]: bucket };
          render();
        },
        onRemove(id) {
          if (local.capex.checked) return;
          const next = { ...local.capex.assignments };
          delete next[id];
          local.capex.assignments = next;
          render();
        },
        onCheck() {
          const result = evaluateTripleClassify(STAGE6_CAPEX_ITEMS, local.capex.assignments);
          local.capex.checked = true;
          local.capex.status = result.status;
          local.capex.message =
            result.status === "correct"
              ? "Correcto. CAPEX = inversión en activos; OPEX = gasto recurrente."
              : "Revisa: compra de activos suele ser CAPEX; suscripciones y consumo mensual, OPEX.";
          if (result.status === "correct") store.markStage6Gate("capex", true);
          render();
        },
        onRetry() {
          local.capex = { assignments: {}, checked: false, status: null, message: "" };
          store.markStage6Gate("capex", false);
          render();
        },
      });
    }
    bindQuiz("qCapexPeak", STAGE6_Q_CAPEX_PEAK, "qCapexPeak");
    bindQuiz("qMetric", STAGE6_Q_METRIC, "qMetric");
  }

  if (step === 5) {
    bindQuiz("qPriority", STAGE6_Q_PRIORITY, "qPriority");
    bindBuilder("decisionBuilder", STAGE6_DECISION_BUILDER, "decisionBuilder");
    const scope = root.querySelector('[data-quiz="chain"]');
    if (scope) {
      bindOrderChain(scope, {
        onMove(id, dir) {
          if (local.chain.checked) return;
          const arr = [...local.chain.order];
          const i = arr.indexOf(id);
          const j = dir === "up" ? i - 1 : i + 1;
          if (j < 0 || j >= arr.length) return;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          local.chain.order = arr;
          render();
        },
        onCheck() {
          const result = evaluateOrder(local.chain.order, STAGE6_CHAIN_CORRECT);
          local.chain.checked = true;
          if (result.status === "correct") {
            local.chain.status = "correct";
            local.chain.message =
              "Correcto. Problema → Evidencia → Impacto → Decisión → Métrica.";
            store.markStage6Gate("chain", true);
          } else {
            local.chain.status = "incorrect";
            local.chain.message =
              "Revisa el orden: primero el problema, luego evidencia, impacto, decisión y métrica.";
          }
          render();
        },
        onRetry() {
          local.chain = {
            order: shuffleIds(STAGE6_CHAIN_CORRECT),
            checked: false,
            status: null,
            message: "",
          };
          store.markStage6Gate("chain", false);
          render();
        },
      });
    }
    bindBuilder("miniCap", STAGE6_MINI_CAP, "miniCap");
    bindBuilder("miniAvail", STAGE6_MINI_AVAIL, "miniAvail");
    bindBuilder("miniMon", STAGE6_MINI_MON, "miniMon");
  }

  if (step === 6) {
    root.querySelectorAll("[data-check6]").forEach((input) => {
      input.addEventListener("change", () => {
        store.setStage6ChecklistItem(input.dataset.check6, input.checked);
      });
    });
    root.querySelectorAll("[data-final6]").forEach((input) => {
      input.addEventListener("change", () => {
        store.setStage6FinalChecklistItem(input.dataset.final6, input.checked);
      });
    });
    bindQuiz("qBefore", STAGE6_Q_BEFORE_TECH, "qBefore");
    STAGE6_KNOWLEDGE.forEach((q) => {
      const scope = root.querySelector(`[data-quiz="know-${q.id}"]`);
      if (!scope) return;
      bindQuestionCard(scope, {
        onSelect(id) {
          if (local.knowledge[q.id].checked) return;
          local.knowledge[q.id].selectedId = id;
          render();
        },
        onCheck() {
          const st = local.knowledge[q.id];
          const attempt = (st.attempt || 0) + 1;
          const result = evaluateSingleChoice(q, st.selectedId, attempt);
          st.attempt = attempt;
          st.checked = true;
          st.status = result.status;
          st.message = result.message;
          if (result.status === "correct") store.markStage6Knowledge(q.id, true);
          store.setActivity(`s6.know.${q.id}`, {
            selectedId: st.selectedId,
            checked: st.checked,
            status: st.status,
            message: st.message,
            attempt: st.attempt,
          });
          render();
        },
        onRetry() {
          if (
            store.getState().labComplete &&
            !LAB_CONFIG.assessment.allowFinalAssessmentRetry
          ) {
            return;
          }
          const prev = local.knowledge[q.id].attempt || 0;
          local.knowledge[q.id] = { ...emptyQuiz(), attempt: prev };
          store.markStage6Knowledge(q.id, false);
          render();
        },
      });
    });
    root.querySelector('[data-action="finish-lab"]')?.addEventListener("click", () => {
      if (!finalReady(store.getState())) return;
      store.completeStage6();
      store.completeLab();
      render();
    });
    root.querySelector('[data-action="back-path"]')?.addEventListener("click", () => {
      store.setView("path");
    });
    root.querySelector('[data-action="review-stages"]')?.addEventListener("click", () => {
      store.setView("path");
    });
  }

  bindNavigation(root, {
    onPrev() {
      if (step === 0) store.setView("path");
      else store.setStage6Step(step - 1);
    },
    onNext() {
      if (!canAdvance(step, store.getState())) return;
      if (step < STAGE6_STEPS.length - 1) store.setStage6Step(step + 1);
    },
  });
}
