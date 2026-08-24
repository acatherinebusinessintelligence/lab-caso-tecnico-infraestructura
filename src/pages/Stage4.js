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
  EvidenceSelector,
  evaluateEvidence,
  bindEvidenceSelector,
} from "../components/EvidenceSelector.js";
import {
  OrderChain,
  evaluateOrder,
  shuffleIds,
  bindOrderChain,
} from "../components/OrderChain.js";
import {
  CriticalityBadge,
  FindingCard,
  DiagnosticMatrix,
  FindingBuilder,
  evaluateBuilderStep,
  bindFindingBuilder,
  MiniFindingsPicker,
  evaluateMiniFindings,
  bindMiniFindings,
} from "../components/FindingWidgets.js";
import { NavigationButtons, bindNavigation } from "../components/StageLayout.js";
import {
  STAGE4_STEPS,
  STAGE4_CLASSIFY_CATS,
  STAGE4_CLASSIFY_ITEMS,
  STAGE4_EVIDENCE_OPTS,
  STAGE4_FINDING_COMPLETE,
  STAGE4_Q_STRONG,
  STAGE4_Q_IMPACT,
  STAGE4_CRIT_ITEMS,
  STAGE4_CRIT_MUST_FIRST,
  STAGE4_CAT_CATS,
  STAGE4_CAT_ITEMS,
  STAGE4_Q_INSUFFICIENT,
  STAGE4_BUILDER,
  STAGE4_Q_GAP,
  STAGE4_MINI_FINDINGS,
  STAGE4_CHAIN_ITEMS,
  STAGE4_CHAIN_CORRECT,
  STAGE4_APPLY_CHECKS,
} from "../data/stage4.js";

let local = null;

function emptyQuiz() {
  return { selectedId: null, checked: false, status: null, message: "", attempt: 0 };
}

function evaluateCritOrder(order) {
  if (order[0] !== STAGE4_CRIT_MUST_FIRST) {
    return {
      status: "incorrect",
      message:
        "El servicio de autenticación único suele tener mayor criticidad. Lo más importante es justificar el impacto, no memorizar una clasificación.",
    };
  }
  const rest = new Set(order.slice(1));
  if (rest.has("a") && rest.has("c") && order.length === 3) {
    return {
      status: "correct",
      message:
        "Correcto. B es el más crítico. A y C pueden discutirse según contexto: lo clave es justificar el impacto, no memorizar una clasificación.",
    };
  }
  return {
    status: "partial",
    message:
      "Identificaste el hallazgo más crítico, pero revisa el resto. A y C dependen del contexto: justifica el impacto.",
  };
}

export function resetStage4Local(state) {
  const s4 = state.stage4 || {};
  local = {
    classify: {
      assignments: s4.classify
        ? Object.fromEntries(STAGE4_CLASSIFY_ITEMS.map((i) => [i.id, i.bucket]))
        : {},
      checked: Boolean(s4.classify),
      status: s4.classify ? "correct" : null,
      message: s4.classify
        ? "Correcto. El dato describe. El hallazgo interpreta la evidencia en el contexto del servicio."
        : "",
    },
    evidence: {
      selected: s4.evidence
        ? STAGE4_EVIDENCE_OPTS.filter((o) => o.relevant).map((o) => o.id)
        : [],
      checked: Boolean(s4.evidence),
      status: s4.evidence ? "correct" : null,
      message: s4.evidence
        ? "Correcto. Esos datos permiten relacionar demanda, capacidad y latencia con la degradación observada."
        : "",
    },
    complete: {
      hallazgo: s4.findingComplete ? STAGE4_FINDING_COMPLETE.hallazgo.correctId : null,
      evidencia: s4.findingComplete ? STAGE4_FINDING_COMPLETE.evidencia.correctId : null,
      impacto: s4.findingComplete ? STAGE4_FINDING_COMPLETE.impacto.correctId : null,
      criticidad: s4.findingComplete ? STAGE4_FINDING_COMPLETE.criticidad.correctId : null,
      checked: Boolean(s4.findingComplete),
      status: s4.findingComplete ? "correct" : null,
      message: s4.findingComplete
        ? "Correcto. Completaste un hallazgo con evidencia, impacto y criticidad."
        : "",
    },
    qStrong: {
      ...emptyQuiz(),
      checked: Boolean(s4.qStrong),
      status: s4.qStrong ? "correct" : null,
      message: s4.qStrong ? STAGE4_Q_STRONG.feedback.correct : "",
    },
    qImpact: {
      ...emptyQuiz(),
      checked: Boolean(s4.qImpact),
      status: s4.qImpact ? "correct" : null,
      message: s4.qImpact ? STAGE4_Q_IMPACT.feedback.correct : "",
    },
    critOrder: {
      order: s4.critOrder
        ? [STAGE4_CRIT_MUST_FIRST, "a", "c"]
        : shuffleIds(["a", "b", "c"]),
      checked: Boolean(s4.critOrder),
      status: s4.critOrder ? "correct" : null,
      message: s4.critOrder
        ? "Correcto. B es el más crítico. A y C pueden discutirse según contexto."
        : "",
    },
    catClassify: {
      assignments: s4.catClassify
        ? Object.fromEntries(STAGE4_CAT_ITEMS.map((i) => [i.id, i.bucket]))
        : {},
      checked: Boolean(s4.catClassify),
      status: s4.catClassify ? "correct" : null,
      message: s4.catClassify
        ? "Correcto. Estás categorizando hallazgos más allá de la infraestructura física."
        : "",
    },
    qInsufficient: {
      ...emptyQuiz(),
      checked: Boolean(s4.qInsufficient),
      status: s4.qInsufficient ? "correct" : null,
      message: s4.qInsufficient ? STAGE4_Q_INSUFFICIENT.feedback.correct : "",
    },
    builder: {
      stepIndex: s4.builder ? STAGE4_BUILDER.steps.length : 0,
      selections: s4.builder
        ? Object.fromEntries(
            STAGE4_BUILDER.steps.map((s) => [s.id, s.correctId])
          )
        : {},
      stepFeedback: null,
      complete: Boolean(s4.builder),
    },
    qGap: {
      ...emptyQuiz(),
      checked: Boolean(s4.qGap),
      status: s4.qGap ? "correct" : null,
      message: s4.qGap ? STAGE4_Q_GAP.feedback.correct : "",
    },
    mini: {
      selected: s4.mini
        ? STAGE4_MINI_FINDINGS.filter((f) => f.correct).slice(0, 3).map((f) => f.id)
        : [],
      checked: Boolean(s4.mini),
      status: s4.mini ? "correct" : null,
      message: s4.mini
        ? "Correcto. Identificaste hallazgos sustentados sin saltar a soluciones tecnológicas."
        : "",
    },
    chain: {
      order: s4.chain ? [...STAGE4_CHAIN_CORRECT] : shuffleIds(STAGE4_CHAIN_CORRECT),
      checked: Boolean(s4.chain),
      status: s4.chain ? "correct" : null,
      message: s4.chain
        ? "Correcto. Dato → Evidencia → Hallazgo → Impacto → Criticidad."
        : "",
    },
  };
}

function stepDots(step) {
  return `
    <div class="step-dots" aria-label="Progreso dentro de la Etapa 4">
      ${STAGE4_STEPS.map(
        (_, i) => `
        <span class="step-dot ${i === step ? "is-active" : ""} ${i < step ? "is-done" : ""}"></span>
      `
      ).join("")}
      <span class="step-dots__label">Paso ${step + 1} de ${STAGE4_STEPS.length}</span>
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
      })}
    </div>
  `;
}

function renderStep0() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">De métricas a diagnóstico</h2>
        <p class="lead" style="margin:0 0 1rem;">Un hallazgo no es una opinión. Es una conclusión sustentada por evidencia.</p>
        <p>Una métrica por sí sola no constituye un hallazgo. <strong>CPU = 95 %</strong> es un dato.
        Afirmar «el servidor tiene problemas» es vago.</p>
        <p>Un hallazgo debe expresar: qué se observa, qué evidencia lo sustenta, qué impacto puede producir y qué criticidad tiene.</p>
        <div class="chain-flow">
          <span class="chain-flow__node">DATO</span>
          <span class="meta-line" style="margin:0;">CPU pico 95 %</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">EVIDENCIA</span>
          <span class="meta-line" style="margin:0;">CPU elevada + latencia &gt; 600 ms en alta demanda</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">HALLAZGO</span>
          <span class="meta-line" style="margin:0;">Posible presión de capacidad en alta concurrencia</span>
        </div>
        ${ConsultantTip({
          text: "Un buen hallazgo puede ser defendido mostrando exactamente de dónde salió.",
        })}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · DECIDE</p>
      <div class="stage-block__body">
        <h3 class="h3">¿Dato o hallazgo?</h3>
        <div data-quiz="classify">
          ${TripleClassify({
            items: STAGE4_CLASSIFY_ITEMS,
            categories: STAGE4_CLASSIFY_CATS,
            assignments: local.classify.assignments,
            checked: local.classify.checked,
            feedbackStatus: local.classify.status,
            feedbackMessage: local.classify.message,
          attempt: local.classify.attempt || 1,
          })}
        </div>
      </div>
    </article>
  `;
}

function renderStep1() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">No todos los datos tienen el mismo peso</h2>
        <p>Una evidencia sólida puede surgir de combinar varios datos.</p>
        <div class="microcase-grid">
          <div class="two-col__card">CPU promedio 84 %</div>
          <div class="two-col__card">CPU pico 97 %</div>
          <div class="two-col__card">RAM promedio 91 %</div>
          <div class="two-col__card">Usuarios reportan lentitud</div>
          <div class="two-col__card">Tiempo de respuesta ↑ en horas pico</div>
        </div>
        <div class="callout-warn" style="margin-top:1rem;">
          <strong>EVIDENCIA:</strong> «El servidor presenta utilización elevada de CPU y RAM coincidente con periodos de degradación del servicio.»
        </div>
        <p>Un único dato puede ser relevante; la correlación fortalece el hallazgo.</p>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · DECIDE</p>
      <div class="stage-block__body">
        <p><strong>Situación:</strong> El portal presenta lentitud durante matrícula.</p>
        <div data-quiz="evidence">
          ${EvidenceSelector({
            options: STAGE4_EVIDENCE_OPTS,
            selected: local.evidence.selected,
            checked: local.evidence.checked,
            feedbackStatus: local.evidence.status,
            feedbackMessage: local.evidence.message,
          attempt: local.evidence.attempt || 1,
            prompt: "¿Qué datos aportan evidencia al análisis de degradación?",
          })}
        </div>
      </div>
    </article>
  `;
}

function completeSelectHtml(field, cfg) {
  const sel = local.complete[field];
  return `
    <div class="complete-field" data-complete-field="${field}">
      <p><strong>${field.toUpperCase()}</strong></p>
      <ul class="option-list">
        ${cfg.options
          .map(
            (o) => `
          <li>
            <button type="button" class="option-item ${sel === o.id ? "is-selected" : ""}" data-cf-opt="${o.id}" data-cf-field="${field}" ${
              local.complete.checked ? "disabled" : ""
            }>
              <span>${o.label}</span>
            </button>
          </li>`
          )
          .join("")}
      </ul>
    </div>
  `;
}

function renderStep2() {
  const fc = STAGE4_FINDING_COMPLETE;
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">Cómo construir un hallazgo defendible</h2>
        <div class="chain-flow">
          <span class="chain-flow__node">HALLAZGO</span><span class="meta-line" style="margin:0;">¿Qué está ocurriendo?</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">EVIDENCIA</span><span class="meta-line" style="margin:0;">¿Qué datos lo demuestran?</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">IMPACTO</span><span class="meta-line" style="margin:0;">¿Qué consecuencia tiene?</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">CRITICIDAD</span><span class="meta-line" style="margin:0;">¿Qué tan urgente es?</span>
        </div>
        ${FindingCard({
          hallazgo: "Posible saturación del servidor de aplicaciones durante periodos de alta demanda.",
          evidencia: "CPU promedio 84 %, picos 97 %, RAM 91 % y aumento de latencia durante la jornada crítica.",
          impacto: "Degradación del servicio utilizado por usuarios clínicos.",
          criticidad: "Alta.",
        })}
        <p class="meta-line">La recomendación se trabajará posteriormente.</p>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · DECIDE · Completar el hallazgo</p>
      <div class="stage-block__body">
        <div class="two-col" style="margin-bottom:1rem;">
          <div class="two-col__card">NAS 20 TB · Usado 16,8 TB · Crecimiento 420 GB/mes</div>
        </div>
        <div data-quiz="complete">
          ${completeSelectHtml("hallazgo", fc.hallazgo)}
          ${completeSelectHtml("evidencia", fc.evidencia)}
          ${completeSelectHtml("impacto", fc.impacto)}
          ${completeSelectHtml("criticidad", fc.criticidad)}
          <div class="btn-row" style="justify-content:flex-start;">
            <button type="button" class="btn btn-primary" data-action="check-complete" ${
              !local.complete.hallazgo ||
              !local.complete.evidencia ||
              !local.complete.impacto ||
              !local.complete.criticidad ||
              local.complete.checked
                ? "disabled"
                : ""
            }>Comprobar hallazgo</button>
          </div>
          ${
            local.complete.status
              ? `<div class="feedback-panel is-${local.complete.status}" role="status">
                   <p class="feedback-panel__message">${local.complete.message}</p>
                   ${
                     local.complete.status !== "correct"
                       ? `<div class="feedback-panel__actions">
                            <button type="button" class="btn btn-secondary" data-action="retry-complete">↻ INTENTAR NUEVAMENTE</button>
                          </div>`
                       : ""
                   }
                 </div>`
              : ""
          }
        </div>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">3 · DECIDE · Débil vs fuerte</p>
      <div class="stage-block__body">
        ${quizHtml("qStrong", STAGE4_Q_STRONG)}
      </div>
    </article>
  `;
}

function renderStep3() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">El problema técnico importa por su impacto</h2>
        <p>Dimensiones: operativo, financiero, usuarios, seguridad, regulatorio, reputacional, continuidad, calidad del servicio.</p>
        <div class="two-col">
          <div class="two-col__card">
            <h3>HCE indisponible</h3>
            <p><strong>Técnico:</strong> aplicación fuera de servicio.</p>
            <p><strong>Operativo:</strong> médicos no acceden a la historia clínica.</p>
            <p><strong>Negocio:</strong> formularios manuales y retrasos en atención.</p>
          </div>
          <div class="two-col__card">
            <h3>Motor de pagos con alta latencia</h3>
            <p><strong>Técnico:</strong> colas de procesamiento.</p>
            <p><strong>Negocio:</strong> confirmaciones tardías y más consultas de soporte.</p>
          </div>
        </div>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · DECIDE</p>
      <div class="stage-block__body">
        ${quizHtml("qImpact", STAGE4_Q_IMPACT)}
      </div>
    </article>
  `;
}

function renderStep4() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">Priorizar no significa llamar crítico a todo</h2>
        <p>La criticidad se justifica con impacto, usuarios, servicio, duración, riesgo, frecuencia, alternativas, legalidad y horario.</p>
        <div class="crit-scale">
          <div class="crit-scale__item">${CriticalityBadge({ level: "baja" })} Impacto limitado. Existe alternativa. Puede esperar.</div>
          <div class="crit-scale__item">${CriticalityBadge({ level: "media" })} Impacto relevante pero controlable.</div>
          <div class="crit-scale__item">${CriticalityBadge({ level: "alta" })} Afecta un servicio importante; atención prioritaria.</div>
          <div class="crit-scale__item">${CriticalityBadge({ level: "critica" })} Compromete operación esencial, seguridad o continuidad.</div>
        </div>
        <p class="meta-line">No convertir la criticidad en una fórmula rígida.</p>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · DECIDE · Priorizar</p>
      <div class="stage-block__body">
        <p>Ordena de mayor a menor criticidad.</p>
        <div data-quiz="critOrder">
          ${OrderChain({
            items: STAGE4_CRIT_ITEMS,
            order: local.critOrder.order,
            checked: local.critOrder.checked,
            feedbackStatus: local.critOrder.status,
            feedbackMessage: local.critOrder.message,
          attempt: local.critOrder.attempt || 1,
          })}
        </div>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">3 · OBSERVA · No solo infraestructura física</p>
      <div class="stage-block__body">
        <h3 class="h3">También existen hallazgos de operación y gestión</h3>
        <div class="metric-tags">
          ${["CAPACIDAD", "DISPONIBILIDAD", "MONITOREO", "OPERACIÓN", "SEGURIDAD", "GOBIERNO", "DEPENDENCIA"]
            .map((t) => `<span class="metric-tag">${t}</span>`)
            .join("")}
        </div>
        <div data-quiz="catClassify">
          ${TripleClassify({
            items: STAGE4_CAT_ITEMS,
            categories: STAGE4_CAT_CATS,
            assignments: local.catClassify.assignments,
            checked: local.catClassify.checked,
            feedbackStatus: local.catClassify.status,
            feedbackMessage: local.catClassify.message,
          attempt: local.catClassify.attempt || 1,
          })}
        </div>
      </div>
    </article>
  `;
}

function renderStep5() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">No inventes el diagnóstico</h2>
        <p>Usuarios reportan lentitud, pero no hay CPU, latencia, logs ni horarios.</p>
        <div class="two-col">
          <div class="two-col__card">
            <h3>Incorrecto</h3>
            <p>«El servidor está saturado.»</p>
          </div>
          <div class="two-col__card">
            <h3>Correcto</h3>
            <p>«Existe percepción de lentitud, pero no hay evidencia suficiente para determinar la causa.»</p>
          </div>
        </div>
        <p style="margin-top:1rem;"><strong>Hallazgo posible:</strong> Ausencia de métricas de rendimiento que permitan diagnosticar la lentitud reportada.</p>
        ${ConsultantTip({
          text: "La falta de evidencia también puede convertirse en un hallazgo.",
        })}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · DECIDE</p>
      <div class="stage-block__body">
        ${quizHtml("qInsufficient", STAGE4_Q_INSUFFICIENT)}
      </div>
    </article>
  `;
}

function renderStep6() {
  const b = local.builder;
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">Organiza tus hallazgos</h2>
        ${DiagnosticMatrix()}
        <p class="meta-line">En esta etapa trabajamos las primeras cuatro columnas. La recomendación se desarrolla en la Etapa 6.</p>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · DECIDE · FindingBuilder</p>
      <div class="stage-block__body">
        <div data-quiz="builder">
          ${FindingBuilder({
            config: STAGE4_BUILDER,
            stepIndex: Math.min(b.stepIndex, STAGE4_BUILDER.steps.length - 1),
            selections: b.selections,
            stepFeedback: b.stepFeedback,
            complete: b.complete,
          })}
        </div>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">3 · DECIDE · Salto lógico</p>
      <div class="stage-block__body">
        <div class="logic-gap">
          <span>CPU 95 %</span>
          <span class="logic-gap__arrow">→</span>
          <span>Migrar a cloud</span>
        </div>
        <div class="chain-flow" style="margin:1rem 0;">
          <span class="chain-flow__node">PROBLEMA</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">EVIDENCIA</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">IMPACTO</span>
          <span class="chain-flow__arrow">↓</span>
          <span class="chain-flow__node">DECISIÓN</span>
        </div>
        <p class="meta-line"><strong>No saltes de la métrica a la solución.</strong></p>
        ${quizHtml("qGap", STAGE4_Q_GAP)}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">4 · APLICA · Mini caso integrador</p>
      <div class="stage-block__body">
        <div class="microcase-grid" style="margin-bottom:1rem;">
          <div class="two-col__card">Servicio crítico · 720 h · 8 h caída · 6 incidentes</div>
          <div class="two-col__card">CPU 82 % / pico 97 % · Latencia 160→780 ms</div>
          <div class="two-col__card">DB 85 % almacenamiento · Backup falló 2 veces sin alerta</div>
        </div>
        <div data-quiz="mini">
          ${MiniFindingsPicker({
            options: STAGE4_MINI_FINDINGS,
            selected: local.mini.selected,
            checked: local.mini.checked,
            feedbackStatus: local.mini.status,
            feedbackMessage: local.mini.message,
          attempt: local.mini.attempt || 1,
          })}
        </div>
      </div>
    </article>
  `;
}

function renderStep7(state) {
  const checklist = state.stage4?.checklist || {};
  const ready = local.chain.status === "correct" || state.stage4?.chain;
  return `
    <article class="stage-block">
      <p class="stage-block__label">APLICA A TU CASO</p>
      <div class="stage-block__body">
        <div class="apply-card">
          <h2 class="h2">APLICA A TU CASO</h2>
          <p>Ahora vuelve a tu caso asignado.</p>
          <p>Busca evidencia en: información operacional, incidentes, infraestructura, almacenamiento, backup, red, seguridad, operación y gobierno.</p>
          <p><strong>Construye mínimo 8 hallazgos.</strong> Para cada uno:</p>
          <ol class="plain-list numbered">
            <li>¿Qué está ocurriendo?</li>
            <li>¿Qué evidencia lo demuestra?</li>
            <li>¿Qué impacto produce?</li>
            <li>¿Qué criticidad tiene?</li>
            <li>¿Qué información adicional sería útil?</li>
          </ol>
          <ul class="check-list">
            ${STAGE4_APPLY_CHECKS.map(
              (c) => `
              <li>
                <label>
                  <input type="checkbox" data-check4="${c.id}" ${checklist[c.id] ? "checked" : ""} />
                  ${c.label}
                </label>
              </li>`
            ).join("")}
          </ul>
          <div class="callout-warn">No inventes datos. Si falta evidencia, documenta la limitación.</div>
        </div>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">CHECKPOINT</p>
      <div class="stage-block__body">
        <h3 class="h3">Antes de continuar, ordena la cadena diagnóstica</h3>
        <div data-quiz="chain">
          ${OrderChain({
            items: STAGE4_CHAIN_ITEMS,
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
      <p class="stage-block__label">FINALIZAR</p>
      <div class="stage-block__body">
        ${
          state.stage4Complete
            ? `
          <div class="complete-banner">
            <p class="h2" style="margin:0;">Ya puedes demostrar qué está ocurriendo.</p>
            <p>Ahora debemos decidir cómo gestionar, gobernar y proteger esos servicios.</p>
            <p class="meta-line">Etapa 4 de 6 · Completada</p>
            <p class="meta-line">Siguiente: ETAPA 5 · GOBERNAR (ITIL · COBIT · ISO 27001)</p>
            <button type="button" class="btn btn-cta" data-action="go-stage5">CONTINUAR A ETAPA 5</button>
          </div>`
            : `
          <button type="button" class="btn btn-cta" data-action="finish-stage4" ${ready ? "" : "disabled"}>
            FINALIZAR ETAPA 4
          </button>
          ${!ready ? `<p class="meta-line">Completa el ordenamiento del checkpoint para finalizar.</p>` : ""}`
        }
      </div>
    </article>
  `;
}

function structReady(state) {
  const s = state.stage4;
  return (
    (local.complete.status === "correct" || s.findingComplete) &&
    (local.qStrong.status === "correct" || s.qStrong)
  );
}

function critReady(state) {
  const s = state.stage4;
  const orderOk =
    local.critOrder.status === "correct" ||
    local.critOrder.status === "partial" ||
    s.critOrder;
  return orderOk && (local.catClassify.status === "correct" || s.catClassify);
}

function builderReady(state) {
  const s = state.stage4;
  return (
    (local.builder.complete || s.builder) &&
    (local.qGap.status === "correct" || s.qGap) &&
    (local.mini.status === "correct" || s.mini)
  );
}

function canAdvance(step, state) {
  const gate = STAGE4_STEPS[step].gate;
  if (gate === "classify") return local.classify.status === "correct" || state.stage4.classify;
  if (gate === "evidence")
    return local.evidence.status === "correct" || state.stage4.evidence;
  if (gate === "structBlock") return structReady(state);
  if (gate === "qImpact") return local.qImpact.status === "correct" || state.stage4.qImpact;
  if (gate === "critBlock") return critReady(state);
  if (gate === "qInsufficient")
    return local.qInsufficient.status === "correct" || state.stage4.qInsufficient;
  if (gate === "builderBlock") return builderReady(state);
  if (gate === "checkpoint") return local.chain.status === "correct" || state.stage4.chain;
  return true;
}

export function Stage4Page(state) {
  if (!local) resetStage4Local(state);
  const step = Math.min(state.stage4Step || 0, STAGE4_STEPS.length - 1);
  let body = "";
  if (step === 0) body = renderStep0();
  if (step === 1) body = renderStep1();
  if (step === 2) body = renderStep2();
  if (step === 3) body = renderStep3();
  if (step === 4) body = renderStep4();
  if (step === 5) body = renderStep5();
  if (step === 6) body = renderStep6();
  if (step === 7) body = renderStep7(state);

  const isLast = step === STAGE4_STEPS.length - 1;

  return `
    <section class="page stage4" aria-label="Etapa 4 DIAGNOSTICAR">
      <header class="card card-pad">
        <p class="eyebrow">Etapa 4 · DIAGNOSTICAR</p>
        <h1 class="h1" style="font-size:1.55rem;">${STAGE4_STEPS[step].title}</h1>
        <p class="lead">Un hallazgo no es una opinión. Es una conclusión sustentada por evidencia.</p>
        ${stepDots(step)}
      </header>
      <div class="stage-layout">${body}</div>
      ${
        state.stage4Complete && isLast
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

export function bindStage4(root, { store, render }) {
  const state = store.getState();
  const step = state.stage4Step || 0;

  const bindQuiz = (key, question, gateName) => {
    bindStandardQuiz({
      root,
      local,
      key,
      question,
      gateName,
      markGate: (g, v) => store.markStage4Gate(g, v),
      render,
      stageId: 4,
      store,
      activityPrefix: "s4",
    });
  };

  const bindClassify = (key, items, cats, gateName, correctMsg) => {
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
        if (result.status === "correct" && correctMsg) {
          local[key].message = correctMsg;
        } else if (result.status === "partial" && key === "classify") {
          local[key].message =
            "Revisa si la afirmación únicamente informa un valor o si ya establece una situación técnicamente sustentada.";
        } else if (result.status === "incorrect" && key === "classify") {
          local[key].message =
            "Revisa si la afirmación únicamente informa un valor o si ya establece una situación técnicamente sustentada.";
        } else {
          local[key].message = result.message;
        }
        if (result.status === "correct") store.markStage4Gate(gateName, true);
        render();
      },
      onRetry() {
        local[key] = { assignments: {}, checked: false, status: null, message: "" };
        store.markStage4Gate(gateName, false);
        render();
      },
    });
  };

  if (step === 0) {
    bindClassify(
      "classify",
      STAGE4_CLASSIFY_ITEMS,
      STAGE4_CLASSIFY_CATS,
      "classify",
      "Correcto. El dato describe. El hallazgo interpreta la evidencia en el contexto del servicio."
    );
    // Override partial message from evaluateTripleClassify when needed
    const scope = root.querySelector('[data-quiz="classify"]');
    if (scope && !local.classify.checked) {
      // already bound; patch messages on check via custom - evaluateTripleClassify already has partial text
    }
  }

  // Fix classify feedback messages for stage4 specific text
  if (step === 0) {
    // re-bind with custom evaluate messages
  }

  if (step === 1) {
    const scope = root.querySelector('[data-quiz="evidence"]');
    if (scope) {
      bindEvidenceSelector(scope, {
        onToggle(id) {
          if (local.evidence.checked) return;
          const set = new Set(local.evidence.selected);
          if (set.has(id)) set.delete(id);
          else set.add(id);
          local.evidence.selected = [...set];
          render();
        },
        onCheck() {
          const result = evaluateEvidence(STAGE4_EVIDENCE_OPTS, local.evidence.selected);
          local.evidence.checked = true;
          local.evidence.status = result.status;
          local.evidence.message = result.message;
          if (result.status === "correct") store.markStage4Gate("evidence", true);
          render();
        },
        onRetry() {
          local.evidence = { selected: [], checked: false, status: null, message: "" };
          store.markStage4Gate("evidence", false);
          render();
        },
      });
    }
  }

  if (step === 2) {
    root.querySelectorAll("[data-cf-opt]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (local.complete.checked) return;
        local.complete[btn.dataset.cfField] = btn.dataset.cfOpt;
        render();
      });
    });
    root.querySelector('[data-action="check-complete"]')?.addEventListener("click", () => {
      const fc = STAGE4_FINDING_COMPLETE;
      const ok =
        local.complete.hallazgo === fc.hallazgo.correctId &&
        local.complete.evidencia === fc.evidencia.correctId &&
        local.complete.impacto === fc.impacto.correctId &&
        local.complete.criticidad === fc.criticidad.correctId;
      const partial =
        !ok &&
        [
          local.complete.hallazgo === fc.hallazgo.correctId,
          local.complete.evidencia === fc.evidencia.correctId,
          local.complete.impacto === fc.impacto.correctId,
          local.complete.criticidad === fc.criticidad.correctId,
        ].filter(Boolean).length >= 2;
      local.complete.checked = true;
      if (ok) {
        local.complete.status = "correct";
        local.complete.message =
          "Correcto. Completaste un hallazgo con evidencia, impacto y criticidad.";
        store.markStage4Gate("findingComplete", true);
      } else if (partial) {
        local.complete.status = "partial";
        local.complete.message =
          "Parcial. Revisa las partes que anticipan una solución o no se sostienen con los datos del NAS.";
      } else {
        local.complete.status = "incorrect";
        local.complete.message =
          "Revisa hallazgo, evidencia, impacto y criticidad. No saltes a comprar capacidad sin diagnóstico.";
      }
      render();
    });
    root.querySelector('[data-action="retry-complete"]')?.addEventListener("click", () => {
      local.complete = {
        hallazgo: null,
        evidencia: null,
        impacto: null,
        criticidad: null,
        checked: false,
        status: null,
        message: "",
      };
      store.markStage4Gate("findingComplete", false);
      render();
    });
    bindQuiz("qStrong", STAGE4_Q_STRONG, "qStrong");
  }

  if (step === 3) bindQuiz("qImpact", STAGE4_Q_IMPACT, "qImpact");

  if (step === 4) {
    const scope = root.querySelector('[data-quiz="critOrder"]');
    if (scope) {
      bindOrderChain(scope, {
        onMove(id, dir) {
          if (local.critOrder.checked) return;
          const arr = [...local.critOrder.order];
          const i = arr.indexOf(id);
          const j = dir === "up" ? i - 1 : i + 1;
          if (j < 0 || j >= arr.length) return;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          local.critOrder.order = arr;
          render();
        },
        onCheck() {
          const result = evaluateCritOrder(local.critOrder.order);
          local.critOrder.checked = true;
          local.critOrder.status = result.status;
          local.critOrder.message = result.message;
          if (result.status === "correct" || result.status === "partial") {
            store.markStage4Gate("critOrder", true);
          }
          render();
        },
        onRetry() {
          local.critOrder = {
            order: shuffleIds(["a", "b", "c"]),
            checked: false,
            status: null,
            message: "",
          };
          store.markStage4Gate("critOrder", false);
          render();
        },
      });
    }
    bindClassify(
      "catClassify",
      STAGE4_CAT_ITEMS,
      STAGE4_CAT_CATS,
      "catClassify",
      "Correcto. Estás categorizando hallazgos más allá de la infraestructura física."
    );
  }

  if (step === 5) bindQuiz("qInsufficient", STAGE4_Q_INSUFFICIENT, "qInsufficient");

  if (step === 6) {
    const scope = root.querySelector('[data-quiz="builder"]');
    if (scope && !local.builder.complete) {
      const stepCfg = STAGE4_BUILDER.steps[local.builder.stepIndex];
      bindFindingBuilder(scope, {
        onSelect(id) {
          if (local.builder.stepFeedback?.checked) return;
          local.builder.selections = {
            ...local.builder.selections,
            [stepCfg.id]: id,
          };
          render();
        },
        onCheck() {
          const result = evaluateBuilderStep(
            stepCfg,
            local.builder.selections[stepCfg.id]
          );
          local.builder.stepFeedback = {
            checked: true,
            status: result.status,
            message: result.message,
          };
          if (result.status === "correct") {
            const next = local.builder.stepIndex + 1;
            if (next >= STAGE4_BUILDER.steps.length) {
              local.builder.complete = true;
              store.markStage4Gate("builder", true);
            } else {
              local.builder.stepIndex = next;
              local.builder.stepFeedback = null;
            }
          }
          render();
        },
        onRetry() {
          const id = STAGE4_BUILDER.steps[local.builder.stepIndex].id;
          const next = { ...local.builder.selections };
          delete next[id];
          local.builder.selections = next;
          local.builder.stepFeedback = null;
          render();
        },
      });
    }
    bindQuiz("qGap", STAGE4_Q_GAP, "qGap");
    const mf = root.querySelector('[data-quiz="mini"]');
    if (mf) {
      bindMiniFindings(mf, {
        onToggle(id) {
          if (local.mini.checked) return;
          const set = new Set(local.mini.selected);
          if (set.has(id)) set.delete(id);
          else set.add(id);
          local.mini.selected = [...set];
          render();
        },
        onCheck() {
          const result = evaluateMiniFindings(STAGE4_MINI_FINDINGS, local.mini.selected);
          local.mini.checked = true;
          local.mini.status = result.status;
          local.mini.message = result.message;
          if (result.status === "correct") store.markStage4Gate("mini", true);
          render();
        },
        onRetry() {
          local.mini = { selected: [], checked: false, status: null, message: "" };
          store.markStage4Gate("mini", false);
          render();
        },
      });
    }
  }

  if (step === 7) {
    root.querySelectorAll("[data-check4]").forEach((input) => {
      input.addEventListener("change", () => {
        store.setStage4ChecklistItem(input.dataset.check4, input.checked);
      });
    });
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
          const result = evaluateOrder(local.chain.order, STAGE4_CHAIN_CORRECT);
          local.chain.checked = true;
          if (result.status === "correct") {
            local.chain.status = "correct";
            local.chain.message =
              "Correcto. Dato → Evidencia → Hallazgo → Impacto → Criticidad.";
            store.markStage4Gate("chain", true);
          } else {
            local.chain.status = "incorrect";
            local.chain.message =
              "Revisa la cadena: primero el dato, luego la evidencia, el hallazgo, el impacto y la criticidad.";
          }
          render();
        },
        onRetry() {
          local.chain = {
            order: shuffleIds(STAGE4_CHAIN_CORRECT),
            checked: false,
            status: null,
            message: "",
          };
          store.markStage4Gate("chain", false);
          render();
        },
      });
    }
    root.querySelector('[data-action="finish-stage4"]')?.addEventListener("click", () => {
      if (!(local.chain.status === "correct" || store.getState().stage4.chain)) return;
      store.completeStage4();
      render();
    });
    root.querySelector('[data-action="go-stage5"]')?.addEventListener("click", () => {
      store.startStage5();
    });
  }

  bindNavigation(root, {
    onPrev() {
      if (step === 0) store.setView("path");
      else store.setStage4Step(step - 1);
    },
    onNext() {
      if (!canAdvance(step, store.getState())) return;
      if (step < STAGE4_STEPS.length - 1) store.setStage4Step(step + 1);
    },
  });
}
