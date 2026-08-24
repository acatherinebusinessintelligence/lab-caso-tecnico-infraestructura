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
  CalculationExercise,
  checkNumericAnswer,
  bindCalculationExercise,
} from "../components/CalculationExercise.js";
import {
  FormulaCard,
  MetricComparison,
  MiniMetricDashboard,
  bindMetricDashboard,
} from "../components/MetricWidgets.js";
import { NavigationButtons, bindNavigation } from "../components/StageLayout.js";
import {
  STAGE3_STEPS,
  STAGE3_CLASSIFY_CATS,
  STAGE3_CLASSIFY_ITEMS,
  STAGE3_Q_AVAIL,
  STAGE3_Q_MISSING,
  STAGE3_Q_MTTR,
  STAGE3_Q_MTTR_BETTER,
  STAGE3_Q_MTBF,
  STAGE3_Q_CAP,
  STAGE3_Q_PEAK,
  STAGE3_Q_WAIT,
  STAGE3_Q_JOINT,
  STAGE3_Q_SLA_DEF,
  STAGE3_Q_SLA_SAME,
  STAGE3_DASHBOARD,
  STAGE3_CHECKPOINT,
  STAGE3_APPLY_CHECKS,
} from "../data/stage3.js";

let local = null;

function emptyQuiz() {
  return { selectedId: null, checked: false, status: null, message: "", attempt: 0 };
}

function emptyCalc(expected, tolerance, okMsg, badMsg, procedureHtml) {
  return {
    value: "",
    checked: false,
    showProcedure: false,
    status: null,
    message: "",
    attempt: 0,
    expected,
    tolerance,
    okMsg,
    badMsg,
    procedureHtml,
  };
}

export function resetStage3Local(state) {
  const s3 = state.stage3 || {};
  local = {
    classify: {
      assignments: s3.classify
        ? Object.fromEntries(STAGE3_CLASSIFY_ITEMS.map((i) => [i.id, i.bucket]))
        : {},
      checked: Boolean(s3.classify),
      status: s3.classify ? "correct" : null,
      message: s3.classify
        ? "Correcto. Estás diferenciando la evidencia de lo que interpretas y de lo que todavía no puedes afirmar."
        : "",
    },
    qAvail: {
      ...emptyQuiz(),
      checked: Boolean(s3.qAvail),
      status: s3.qAvail ? "correct" : null,
      message: s3.qAvail ? STAGE3_Q_AVAIL.feedback.correct : "",
    },
    calcAvail: emptyCalc(
      97.81,
      0.15,
      "El cálculo es correcto. Ahora falta interpretar si ese nivel es aceptable para el servicio.",
      "Revisa primero cuánto tiempo estuvo disponible el servicio y después divide por el periodo total.",
      `<p><strong>Procedimiento:</strong></p>
       <p>(720 − 15,8) / 720 × 100</p>
       <p>704,2 / 720 × 100 = <strong>97,81 %</strong></p>`
    ),
    qMissing: {
      ...emptyQuiz(),
      checked: Boolean(s3.qMissing),
      status: s3.qMissing ? "correct" : null,
      message: s3.qMissing ? STAGE3_Q_MISSING.feedback.correct : "",
    },
    qMttr: {
      ...emptyQuiz(),
      checked: Boolean(s3.qMttr),
      status: s3.qMttr ? "correct" : null,
      message: s3.qMttr ? STAGE3_Q_MTTR.feedback.correct : "",
    },
    calcMttr: emptyCalc(
      2.5,
      0.05,
      "Correcto. MTTR ≈ 2,5 horas (27,5 ÷ 11).",
      "Divide el tiempo total de recuperación entre el número de incidentes.",
      `<p><strong>Procedimiento:</strong></p>
       <p>MTTR = 27,5 / 11 = <strong>2,5 horas</strong></p>`
    ),
    qMttrBetter: {
      ...emptyQuiz(),
      checked: Boolean(s3.qMttrBetter),
      status: s3.qMttrBetter ? "correct" : null,
      message: s3.qMttrBetter ? STAGE3_Q_MTTR_BETTER.feedback.correct : "",
    },
    qMtbf: {
      ...emptyQuiz(),
      checked: Boolean(s3.qMtbf),
      status: s3.qMtbf ? "correct" : null,
      message: s3.qMtbf ? STAGE3_Q_MTBF.feedback.correct : "",
    },
    qCap: {
      ...emptyQuiz(),
      checked: Boolean(s3.qCap),
      status: s3.qCap ? "correct" : null,
      message: s3.qCap ? STAGE3_Q_CAP.feedback.correct : "",
    },
    qPeak: {
      ...emptyQuiz(),
      checked: Boolean(s3.qPeak),
      status: s3.qPeak ? "correct" : null,
      message: s3.qPeak ? STAGE3_Q_PEAK.feedback.correct : "",
    },
    calcGrowth: emptyCalc(
      7.62,
      0.6,
      "Aproximadamente 7,6 meses (3,2 TB ÷ 0,42 TB/mes). No se exige precisión decimal exacta.",
      "Divide capacidad libre (3,2 TB) entre el crecimiento mensual (0,42 TB).",
      `<p><strong>Procedimiento:</strong></p>
       <p>3,2 TB libres ÷ 0,42 TB/mes ≈ <strong>7,6 meses</strong></p>`
    ),
    qWait: {
      ...emptyQuiz(),
      checked: Boolean(s3.qWait),
      status: s3.qWait ? "correct" : null,
      message: s3.qWait ? STAGE3_Q_WAIT.feedback.correct : "",
    },
    qJoint: {
      ...emptyQuiz(),
      checked: Boolean(s3.qJoint),
      status: s3.qJoint ? "correct" : null,
      message: s3.qJoint ? STAGE3_Q_JOINT.feedback.correct : "",
    },
    qSlaDef: {
      ...emptyQuiz(),
      checked: Boolean(s3.qSlaDef),
      status: s3.qSlaDef ? "correct" : null,
      message: s3.qSlaDef ? STAGE3_Q_SLA_DEF.feedback.correct : "",
    },
    qSlaSame: {
      ...emptyQuiz(),
      checked: Boolean(s3.qSlaSame),
      status: s3.qSlaSame ? "correct" : null,
      message: s3.qSlaSame ? STAGE3_Q_SLA_SAME.feedback.correct : "",
    },
    dashActive: null,
    dashSeen: new Set(s3.dashboard ? STAGE3_DASHBOARD.map((m) => m.id) : []),
    checkpoint: Object.fromEntries(
      STAGE3_CHECKPOINT.map((ck) => {
        const done = s3.checkpoint?.[ck.id];
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

  if (s3.calcAvail) {
    local.calcAvail.checked = true;
    local.calcAvail.status = "correct";
    local.calcAvail.message = local.calcAvail.okMsg;
    local.calcAvail.value = "97,81";
  }
  if (s3.calcMttr) {
    local.calcMttr.checked = true;
    local.calcMttr.status = "correct";
    local.calcMttr.message = local.calcMttr.okMsg;
    local.calcMttr.value = "2,5";
  }
  if (s3.calcGrowth) {
    local.calcGrowth.checked = true;
    local.calcGrowth.status = "correct";
    local.calcGrowth.message = local.calcGrowth.okMsg;
    local.calcGrowth.value = "7,6";
  }
}

function stepDots(step) {
  return `
    <div class="step-dots" aria-label="Progreso dentro de la Etapa 3">
      ${STAGE3_STEPS.map(
        (_, i) => `
        <span class="step-dot ${i === step ? "is-active" : ""} ${i < step ? "is-done" : ""}"></span>
      `
      ).join("")}
      <span class="step-dots__label">Paso ${step + 1} de ${STAGE3_STEPS.length}</span>
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

function calcHtml(id) {
  const c = local[id];
  return CalculationExercise({
    id,
    prompt: id === "calcAvail" ? "Calcula la disponibilidad." : id === "calcMttr" ? "Calcula el MTTR." : "¿Aproximadamente cuántos meses quedan?",
    unit: id === "calcAvail" ? "%" : id === "calcMttr" ? "horas" : "meses",
    placeholder: id === "calcAvail" ? "Ej. 97,81" : id === "calcMttr" ? "Ej. 2,5" : "Ej. 7,6",
    value: c.value,
    checked: c.checked,
    showProcedure: c.showProcedure,
    procedureHtml: c.procedureHtml,
    feedbackStatus: c.status,
    feedbackMessage: c.message,
    hint: "Acepta coma o punto decimal. Se permite un margen de tolerancia.",
    attempt: c.attempt || 0,
  });
}

function renderStep0() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">Un número no es todavía un diagnóstico</h2>
        <p class="lead" style="margin:0 0 1rem;">Medir no es acumular números. Es convertir datos técnicos en evidencia.</p>
        <div class="chain-flow" aria-label="Cadena DATO MÉTRICA INTERPRETACIÓN IMPACTO">
          <span class="chain-flow__node">DATO</span>
          <span class="chain-flow__arrow" aria-hidden="true">↓</span>
          <span class="chain-flow__node">MÉTRICA</span>
          <span class="chain-flow__arrow" aria-hidden="true">↓</span>
          <span class="chain-flow__node">INTERPRETACIÓN</span>
          <span class="chain-flow__arrow" aria-hidden="true">↓</span>
          <span class="chain-flow__node">IMPACTO</span>
        </div>
        <div class="three-col" style="margin-top:1rem;">
          <div class="two-col__card">
            <h3>DATO</h3>
            <p>Valor observado.</p>
            <p><strong>Ejemplo:</strong> CPU = 95 %</p>
          </div>
          <div class="two-col__card">
            <h3>MÉTRICA</h3>
            <p>Dato usado para evaluar un comportamiento.</p>
            <p><strong>Ejemplo:</strong> uso de CPU durante una ventana crítica.</p>
          </div>
          <div class="two-col__card">
            <h3>INTERPRETACIÓN</h3>
            <p>Qué puede significar en contexto.</p>
            <p><strong>Ejemplo:</strong> evidencia de alta utilización en la ventana de mayor demanda.</p>
          </div>
        </div>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · OBSERVA</p>
      <div class="stage-block__body">
        <div class="metric-spotlight">
          <div class="metric-spotlight__num">95 % CPU</div>
          <div class="metric-spotlight__vs">
            <p><strong>NO significa automáticamente:</strong> «El servidor está dañado.»</p>
            <p><strong>Puede significar:</strong> presión de capacidad que debe analizarse junto con duración, latencia, memoria y demanda.</p>
          </div>
        </div>
        ${ConsultantTip({
          text: "Una métrica sin contexto puede llevar a una mala decisión.",
        })}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">3 · DECIDE</p>
      <div class="stage-block__body">
        <h3 class="h3">Hecho, interpretación o suposición</h3>
        <p>Clasifica cada afirmación.</p>
        <div data-quiz="classify">
          ${TripleClassify({
            items: STAGE3_CLASSIFY_ITEMS,
            categories: STAGE3_CLASSIFY_CATS,
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
        <h2 class="h2">¿Cuánto tiempo estuvo realmente disponible el servicio?</h2>
        <p>Disponibilidad representa qué proporción del periodo esperado el servicio estuvo operativo.</p>
        ${FormulaCard({
          title: "Fórmula de disponibilidad",
          lines: [
            "Disponibilidad =",
            "(Tiempo total − Tiempo fuera de servicio)",
            "/ Tiempo total",
            "× 100",
          ],
          spoken:
            "Disponibilidad es igual a tiempo total menos tiempo fuera de servicio, dividido entre tiempo total, multiplicado por cien.",
        })}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · OBSERVA</p>
      <div class="stage-block__body">
        <div class="two-col">
          <div class="two-col__card"><p><strong>Periodo observado:</strong> 720 horas</p></div>
          <div class="two-col__card"><p><strong>Tiempo fuera de servicio:</strong> 9,6 horas</p></div>
        </div>
        <div class="guided-calc">
          <p><strong>Calculadora guiada</strong></p>
          <ol>
            <li>720 − 9,6 = <strong>710,4</strong></li>
            <li>710,4 / 720 = <strong>0,986666…</strong></li>
            <li>× 100 → <strong>98,67 %</strong></li>
          </ol>
        </div>
        ${quizHtml("qAvail", STAGE3_Q_AVAIL)}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">3 · DECIDE</p>
      <div class="stage-block__body">
        <h3 class="h3">Actividad de cálculo</h3>
        <div class="two-col" style="margin-bottom:1rem;">
          <div class="two-col__card"><p><strong>Tiempo total:</strong> 720 horas</p></div>
          <div class="two-col__card"><p><strong>Tiempo fuera:</strong> 15,8 horas</p></div>
        </div>
        <div data-calc-wrap="calcAvail">${calcHtml("calcAvail")}</div>
        ${
          local.calcAvail.status === "correct"
            ? quizHtml("qMissing", STAGE3_Q_MISSING)
            : `<p class="meta-line">Tras acertar el cálculo, interpreta qué falta para juzgar el resultado.</p>`
        }
      </div>
    </article>
  `;
}

function renderStep2() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">¿Cuánto tarda la organización en recuperarse?</h2>
        <p><strong>MTTR</strong> = Mean Time To Repair / Restore / Recover.</p>
        <p>En este laboratorio: <em>tiempo promedio empleado en recuperar el servicio después de un incidente.</em></p>
        ${FormulaCard({
          title: "Fórmula MTTR",
          lines: [
            "MTTR =",
            "Tiempo total empleado en recuperación",
            "/ Número de incidentes",
          ],
          spoken:
            "MTTR es igual al tiempo total empleado en recuperación, dividido entre el número de incidentes.",
        })}
        <div class="guided-calc" style="margin-top:1rem;">
          <p>Ejemplo: 36 h / 9 incidentes = <strong>4 horas</strong></p>
        </div>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · DECIDE</p>
      <div class="stage-block__body">
        ${quizHtml("qMttr", STAGE3_Q_MTTR)}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">3 · APLICA</p>
      <div class="stage-block__body">
        <div class="two-col" style="margin-bottom:1rem;">
          <div class="two-col__card"><p><strong>Incidentes:</strong> 11</p></div>
          <div class="two-col__card"><p><strong>Recuperación total:</strong> 27,5 horas</p></div>
        </div>
        <div data-calc-wrap="calcMttr">${calcHtml("calcMttr")}</div>
        ${
          local.calcMttr.status === "correct"
            ? `
          ${quizHtml("qMttrBetter", STAGE3_Q_MTTR_BETTER)}
          ${ConsultantTip({
            text: "Comparar MTTR solo tiene sentido si se entiende el tipo de incidentes y el servicio analizado.",
          })}
        `
            : ""
        }
      </div>
    </article>
  `;
}

function renderStep3() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">¿Cada cuánto se presentan fallos?</h2>
        <p><strong>MTBF</strong> = Mean Time Between Failures: aproximación al tiempo promedio entre fallos.</p>
        <div class="callout-warn">
          <strong>Importante:</strong> Los casos pueden NO aportar información suficiente para un MTBF perfecto.
          Debes reconocer esa limitación.
        </div>
        <div class="two-col" style="margin-top:1rem;">
          <div class="two-col__card"><p><strong>Periodo:</strong> 720 horas</p></div>
          <div class="two-col__card"><p><strong>Incidentes:</strong> 9</p></div>
        </div>
        <p style="margin-top:1rem;"><strong>¿Podemos simplemente afirmar que MTBF = 720 / 9?</strong></p>
        <p><strong>No necesariamente.</strong> Puede hacer falta: tiempo real de operación, momento de cada fallo,
        qué eventos cuentan como fallos, si corresponden al mismo servicio y periodos de indisponibilidad.</p>
        <p>Para efectos académicos puedes estimar cuando el caso lo permita, <em>explicando la limitación</em>.</p>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · DECIDE</p>
      <div class="stage-block__body">
        ${quizHtml("qMtbf", STAGE3_Q_MTBF)}
        ${ConsultantTip({
          text: "No inventes precisión donde los datos no la permiten.",
        })}
      </div>
    </article>
  `;
}

function renderStep4() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">Una métrica rara vez cuenta toda la historia</h2>
        <div class="metric-tags">
          ${["CPU", "RAM", "ALMACENAMIENTO", "CRECIMIENTO", "LATENCIA", "CONEXIONES", "USUARIOS", "TRANSACCIONES", "MENSAJES"]
            .map((t) => `<span class="metric-tag">${t}</span>`)
            .join("")}
        </div>
        <ul class="plain-list">
          <li><strong>CPU:</strong> capacidad de procesamiento utilizada.</li>
          <li><strong>RAM:</strong> memoria usada por aplicaciones y sistema.</li>
          <li><strong>Almacenamiento:</strong> capacidad usada frente a total.</li>
          <li><strong>Crecimiento:</strong> velocidad a la que aumenta el consumo.</li>
          <li><strong>Latencia:</strong> tiempo de respuesta o retraso.</li>
          <li><strong>Conexiones / demanda:</strong> sesiones, usuarios, transacciones o mensajes.</li>
        </ul>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · OBSERVA</p>
      <div class="stage-block__body">
        <div class="microcase-grid">
          <div class="two-col__card"><p>CPU promedio: <strong>76 %</strong></p></div>
          <div class="two-col__card"><p>CPU pico: <strong>95 %</strong></p></div>
          <div class="two-col__card"><p>RAM: <strong>88 %</strong></p></div>
          <div class="two-col__card"><p>Latencia normal: <strong>140 ms</strong></p></div>
          <div class="two-col__card"><p>Latencia matrícula: <strong>620 ms</strong></p></div>
        </div>
        ${quizHtml("qCap", STAGE3_Q_CAP)}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">3 · DECIDE · Pico vs promedio</p>
      <div class="stage-block__body">
        <h3 class="h3">Promedio y pico cuentan historias diferentes</h3>
        ${MetricComparison({
          left: {
            title: "Servidor A",
            rows: [
              { k: "CPU promedio", v: "45 %" },
              { k: "Pico", v: "96 %" },
              { k: "Duración del pico", v: "20 segundos" },
            ],
          },
          right: {
            title: "Servidor B",
            rows: [
              { k: "CPU promedio", v: "88 %" },
              { k: "Pico", v: "96 %" },
              { k: "Duración del pico", v: "4 horas diarias" },
            ],
          },
        })}
        ${quizHtml("qPeak", STAGE3_Q_PEAK)}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">4 · ALMACENAMIENTO Y CRECIMIENTO</p>
      <div class="stage-block__body">
        <div class="two-col">
          <div class="two-col__card"><p>Capacidad total: <strong>20 TB</strong></p></div>
          <div class="two-col__card"><p>Utilizado: <strong>16,8 TB</strong></p></div>
          <div class="two-col__card"><p>Crecimiento: <strong>420 GB / mes</strong></p></div>
        </div>
        <p style="margin-top:1rem;">Más útil que decir «queda 16 % libre»:</p>
        <ul class="plain-list">
          <li>cuánto crece por mes;</li>
          <li>cuánto tiempo queda antes de un umbral;</li>
          <li>qué datos generan el crecimiento;</li>
          <li>si hay políticas de archivo;</li>
          <li>si todo debe permanecer en almacenamiento de alto costo.</li>
        </ul>
        <p><strong>Con 3,2 TB disponibles y crecimiento de 420 GB/mes…</strong></p>
        <div data-calc-wrap="calcGrowth">${calcHtml("calcGrowth")}</div>
        ${local.calcGrowth.status === "correct" ? quizHtml("qWait", STAGE3_Q_WAIT) : ""}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">5 · LATENCIA</p>
      <div class="stage-block__body">
        <h3 class="h3">No todo fallo produce indisponibilidad</h3>
        <p>Un servicio puede estar técnicamente disponible y ofrecer una experiencia inaceptable.</p>
        <div class="two-col">
          <div class="two-col__card"><p>Responde: <strong>Sí</strong></p><p>Latencia habitual: 120 ms</p></div>
          <div class="two-col__card"><p>Latencia en pico: <strong>1.800 ms</strong></p></div>
        </div>
        <div class="neq-banner" role="note">
          <span>DISPONIBILIDAD</span>
          <span class="neq-banner__sym">≠</span>
          <span>RENDIMIENTO</span>
        </div>
        ${ConsultantTip({
          text: "Un servicio que responde demasiado tarde puede estar disponible técnicamente y fallando desde la perspectiva del usuario.",
        })}
      </div>
    </article>
  `;
}

function renderStep5() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">Busca patrones, no números aislados</h2>
        <div class="pattern-bars" aria-hidden="true">
          <div class="pattern-bar"><span>Usuarios</span><div class="bar"><i style="width:95%"></i></div><em>↑</em></div>
          <div class="pattern-bar"><span>CPU</span><div class="bar"><i style="width:88%"></i></div><em>↑</em></div>
          <div class="pattern-bar"><span>Latencia</span><div class="bar"><i style="width:90%"></i></div><em>↑</em></div>
          <div class="pattern-bar"><span>Errores</span><div class="bar"><i style="width:70%"></i></div><em>↑</em></div>
        </div>
        <p>Conclusión razonable: <strong>existe evidencia de degradación asociada con crecimiento de demanda.</strong></p>
        <p class="meta-line">NO concluir todavía: «Hay que comprar un servidor.»</p>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · DECIDE</p>
      <div class="stage-block__body">
        <div class="microcase-grid" style="margin-bottom:1rem;">
          <div class="two-col__card"><p>Usuarios: <strong>1.500 → 4.000</strong></p></div>
          <div class="two-col__card"><p>CPU: <strong>62 % → 94 %</strong></p></div>
          <div class="two-col__card"><p>Latencia: <strong>180 → 980 ms</strong></p></div>
          <div class="two-col__card"><p>Errores: <strong>0,2 % → 3,8 %</strong></p></div>
        </div>
        ${quizHtml("qJoint", STAGE3_Q_JOINT)}
      </div>
    </article>
  `;
}

function renderStep6() {
  const active = STAGE3_DASHBOARD.find((m) => m.id === local.dashActive);
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">¿Qué nivel de servicio necesitamos?</h2>
        <p><strong>SLA</strong> = Service Level Agreement: compromiso medible sobre el nivel esperado de un servicio.</p>
        <p>Puede incluir disponibilidad, tiempo de respuesta, recuperación, horario, soporte y prioridades.</p>
        <div class="callout-warn"><strong>No reduce a:</strong> «99,9 %» sin contexto.</div>
        ${quizHtml("qSlaDef", STAGE3_Q_SLA_DEF)}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · DECIDE</p>
      <div class="stage-block__body">
        <div class="three-col">
          <div class="two-col__card"><h3>Servicio A</h3><p>Portal informativo</p></div>
          <div class="two-col__card"><h3>Servicio B</h3><p>Motor de pagos</p></div>
          <div class="two-col__card"><h3>Servicio C</h3><p>Reportes internos semanales</p></div>
        </div>
        ${quizHtml("qSlaSame", STAGE3_Q_SLA_SAME)}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">3 · OBSERVA · Mini dashboard</p>
      <div class="stage-block__body">
        <p>Sin semáforos automáticos. Selecciona una métrica y pregunta qué más necesitas saber.</p>
        ${MiniMetricDashboard({
          metrics: STAGE3_DASHBOARD,
          activeId: local.dashActive,
          insight: active?.insight,
        })}
      </div>
    </article>
  `;
}

function renderStep7(state) {
  const checklist = state.stage3?.checklist || {};
  const ckOk = STAGE3_CHECKPOINT.every(
    (ck) => local.checkpoint[ck.id]?.status === "correct" || state.stage3?.checkpoint?.[ck.id]
  );
  return `
    <article class="stage-block">
      <p class="stage-block__label">APLICA A TU CASO</p>
      <div class="stage-block__body">
        <div class="apply-card">
          <h2 class="h2">APLICA A TU CASO</h2>
          <p>Ahora vuelve a la sección <strong>INFORMACIÓN OPERACIONAL</strong> de tu caso.</p>
          <ol class="plain-list numbered">
            <li>¿Cuál es el periodo observado?</li>
            <li>¿Cuánto tiempo estuvo indisponible el servicio?</li>
            <li>¿Cuántos incidentes ocurrieron?</li>
            <li>¿Cuál fue el tiempo total de recuperación?</li>
            <li>¿Qué datos existen de CPU?</li>
            <li>¿Qué datos existen de RAM?</li>
            <li>¿Qué datos existen de almacenamiento?</li>
            <li>¿Existe crecimiento mensual?</li>
            <li>¿Existe información de latencia?</li>
            <li>¿Existen datos de conexiones, usuarios o transacciones?</li>
          </ol>
          <p>Calcula o estima cuando sea posible:</p>
          <ul class="check-list">
            ${STAGE3_APPLY_CHECKS.map(
              (c) => `
              <li>
                <label>
                  <input type="checkbox" data-check3="${c.id}" ${checklist[c.id] ? "checked" : ""} />
                  ${c.label}
                </label>
              </li>`
            ).join("")}
          </ul>
          <div class="callout-warn">
            <strong>Si un dato no existe, NO lo inventes.</strong> Registra «Dato no disponible» como respuesta técnicamente válida.
          </div>
        </div>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">CHECKPOINT · Interpreta, no solo calcules</p>
      <div class="stage-block__body">
        ${STAGE3_CHECKPOINT.map((ck) => {
          const st = local.checkpoint[ck.id];
          return `
            <div class="yesno-card" data-ck="${ck.id}">
              <p><strong>${ck.prompt}</strong></p>
              <div class="btn-row" style="justify-content:flex-start;">
                <button type="button" class="btn btn-secondary ${st.selectedId === "si" ? "is-selected-opt" : ""}" data-ck-ans="si" data-ck-id="${ck.id}" ${st.checked ? "disabled" : ""}>SÍ</button>
                <button type="button" class="btn btn-secondary ${st.selectedId === "no" ? "is-selected-opt" : ""}" data-ck-ans="no" data-ck-id="${ck.id}" ${st.checked ? "disabled" : ""}>NO</button>
              </div>
              ${
                st.checked
                  ? `<div class="feedback-panel is-${st.status}" role="status">
                       <p class="feedback-panel__message">${
                         st.status === "correct"
                           ? "Correcto."
                           : "Revisa: la evidencia no sostiene esa respuesta."
                       }</p>
                       ${
                         st.status !== "correct"
                           ? `<div class="feedback-panel__actions">
                                <button type="button" class="btn btn-secondary" data-ck-retry="${ck.id}">↻ INTENTAR NUEVAMENTE</button>
                              </div>`
                           : ""
                       }
                     </div>`
                  : ""
              }
            </div>`;
        }).join("")}
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">CHECKPOINT FINAL</p>
      <div class="stage-block__body">
        <h3 class="h3">Antes de continuar deberías poder:</h3>
        <ul class="plain-list">
          <li>diferenciar dato de interpretación;</li>
          <li>calcular e interpretar disponibilidad;</li>
          <li>calcular y explicar MTTR;</li>
          <li>estimar MTBF con cautela y reconocer falta de datos;</li>
          <li>analizar CPU, RAM, almacenamiento, crecimiento y latencia;</li>
          <li>relacionar demanda con rendimiento;</li>
          <li>entender el propósito de un SLA.</li>
        </ul>
        ${
          state.stage3Complete
            ? `
          <div class="complete-banner">
            <p class="h2" style="margin:0;">Ya tienes evidencia.</p>
            <p>Ahora necesitas convertirla en hallazgos que puedas defender.</p>
            <p class="meta-line">Etapa 3 de 6 · Completada</p>
            <button type="button" class="btn btn-cta" data-action="go-stage4">ETAPA 4 · DIAGNOSTICAR CON EVIDENCIA</button>
          </div>`
            : `
          <button type="button" class="btn btn-cta" data-action="finish-stage3" ${ckOk ? "" : "disabled"}>
            FINALIZAR ETAPA 3
          </button>
          ${!ckOk ? `<p class="meta-line">Completa el checkpoint de interpretación (cinco preguntas) para finalizar.</p>` : ""}`
        }
      </div>
    </article>
  `;
}

function availBlockReady(state) {
  const s = state.stage3;
  return (
    (local.qAvail.status === "correct" || s.qAvail) &&
    (local.calcAvail.status === "correct" || s.calcAvail) &&
    (local.qMissing.status === "correct" || s.qMissing)
  );
}

function mttrBlockReady(state) {
  const s = state.stage3;
  return (
    (local.qMttr.status === "correct" || s.qMttr) &&
    (local.calcMttr.status === "correct" || s.calcMttr) &&
    (local.qMttrBetter.status === "correct" || s.qMttrBetter)
  );
}

function capBlockReady(state) {
  const s = state.stage3;
  return (
    (local.qCap.status === "correct" || s.qCap) &&
    (local.qPeak.status === "correct" || s.qPeak) &&
    (local.calcGrowth.status === "correct" || s.calcGrowth) &&
    (local.qWait.status === "correct" || s.qWait)
  );
}

function slaBlockReady(state) {
  const s = state.stage3;
  return (
    (local.qSlaDef.status === "correct" || s.qSlaDef) &&
    (local.qSlaSame.status === "correct" || s.qSlaSame) &&
    (local.dashSeen.size >= 1 || s.dashboard)
  );
}

function checkpointReady(state) {
  return STAGE3_CHECKPOINT.every(
    (ck) => local.checkpoint[ck.id]?.status === "correct" || state.stage3?.checkpoint?.[ck.id]
  );
}

function canAdvance(step, state) {
  const gate = STAGE3_STEPS[step].gate;
  if (gate === "classify") return local.classify.status === "correct" || state.stage3.classify;
  if (gate === "availBlock") return availBlockReady(state);
  if (gate === "mttrBlock") return mttrBlockReady(state);
  if (gate === "qMtbf") return local.qMtbf.status === "correct" || state.stage3.qMtbf;
  if (gate === "capBlock") return capBlockReady(state);
  if (gate === "qJoint") return local.qJoint.status === "correct" || state.stage3.qJoint;
  if (gate === "slaBlock") return slaBlockReady(state);
  if (gate === "checkpoint") return checkpointReady(state);
  return true;
}

export function Stage3Page(state) {
  if (!local) resetStage3Local(state);
  const step = Math.min(state.stage3Step || 0, STAGE3_STEPS.length - 1);
  let body = "";
  if (step === 0) body = renderStep0();
  if (step === 1) body = renderStep1();
  if (step === 2) body = renderStep2();
  if (step === 3) body = renderStep3();
  if (step === 4) body = renderStep4();
  if (step === 5) body = renderStep5();
  if (step === 6) body = renderStep6();
  if (step === 7) body = renderStep7(state);

  const isLast = step === STAGE3_STEPS.length - 1;

  return `
    <section class="page stage3" aria-label="Etapa 3 MEDIR">
      <header class="card card-pad">
        <p class="eyebrow">Etapa 3 · MEDIR</p>
        <h1 class="h1" style="font-size:1.55rem;">${STAGE3_STEPS[step].title}</h1>
        <p class="lead">Medir no es acumular números. Es convertir datos técnicos en evidencia.</p>
        ${stepDots(step)}
      </header>
      <div class="stage-layout">${body}</div>
      ${
        state.stage3Complete && isLast
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

export function bindStage3(root, { store, render }) {
  const state = store.getState();
  const step = state.stage3Step || 0;

  const bindQuiz = (key, question, gateName) => {
    bindStandardQuiz({
      root,
      local,
      key,
      question,
      gateName,
      markGate: (g, v) => store.markStage3Gate(g, v),
      render,
      stageId: 3,
      store,
      activityPrefix: "s3",
    });
  };

  const bindCalc = (id, gateName) => {
    const scope = root.querySelector(`[data-calc-wrap="${id}"]`) || root;
    bindCalculationExercise(scope, {
      onInput(calcId, value) {
        if (calcId !== id || local[id].checked) return;
        local[id].value = value;
      },
      onCheck(calcId) {
        if (calcId !== id || local[id].checked) return;
        const c = local[id];
        const attempt = (c.attempt || 0) + 1;
        c.attempt = attempt;
        const result = checkNumericAnswer(c.value, c.expected, c.tolerance, {
          min: 0,
          max: id === "calcAvail" ? 100 : 1e6,
        });
        c.checked = true;
        c.status = result.status;
        if (result.status === "correct") {
          c.message = c.okMsg;
          store.markStage3Gate(gateName, true);
        } else if (result.message) {
          c.message = result.message;
        } else if (attempt <= 1) {
          c.message = c.badMsg;
        } else if (attempt === 2) {
          c.message =
            "Pista: revisa unidades y si usaste coma o punto. " + c.badMsg;
        } else {
          c.message =
            "Revisa el procedimiento paso a paso y vuelve a calcular. " + c.badMsg;
        }
        render();
      },
      onToggleProc(calcId) {
        if (calcId !== id) return;
        local[id].showProcedure = !local[id].showProcedure;
        render();
      },
      onRetry() {
        const prev = local[id];
        local[id] = {
          ...emptyCalc(
            prev.expected,
            prev.tolerance,
            prev.okMsg,
            prev.badMsg,
            prev.procedureHtml
          ),
          attempt: prev.attempt || 0,
        };
        store.markStage3Gate(gateName, false);
        render();
      },
    });
  };

  if (step === 0) {
    const scope = root.querySelector('[data-quiz="classify"]');
    if (scope) {
      bindTripleClassify(scope, {
        onAssign(id, bucket) {
          if (local.classify.checked) return;
          local.classify.assignments = { ...local.classify.assignments, [id]: bucket };
          render();
        },
        onRemove(id) {
          if (local.classify.checked) return;
          const next = { ...local.classify.assignments };
          delete next[id];
          local.classify.assignments = next;
          render();
        },
        onCheck() {
          const result = evaluateTripleClassify(
            STAGE3_CLASSIFY_ITEMS,
            local.classify.assignments
          );
          local.classify.checked = true;
          local.classify.status = result.status;
          local.classify.message = result.message;
          if (result.status === "correct") store.markStage3Gate("classify", true);
          render();
        },
        onRetry() {
          local.classify = {
            assignments: {},
            checked: false,
            status: null,
            message: "",
          };
          store.markStage3Gate("classify", false);
          render();
        },
      });
    }
  }

  if (step === 1) {
    bindQuiz("qAvail", STAGE3_Q_AVAIL, "qAvail");
    bindCalc("calcAvail", "calcAvail");
    if (local.calcAvail.status === "correct") bindQuiz("qMissing", STAGE3_Q_MISSING, "qMissing");
  }

  if (step === 2) {
    bindQuiz("qMttr", STAGE3_Q_MTTR, "qMttr");
    bindCalc("calcMttr", "calcMttr");
    if (local.calcMttr.status === "correct") {
      bindQuiz("qMttrBetter", STAGE3_Q_MTTR_BETTER, "qMttrBetter");
    }
  }

  if (step === 3) bindQuiz("qMtbf", STAGE3_Q_MTBF, "qMtbf");

  if (step === 4) {
    bindQuiz("qCap", STAGE3_Q_CAP, "qCap");
    bindQuiz("qPeak", STAGE3_Q_PEAK, "qPeak");
    bindCalc("calcGrowth", "calcGrowth");
    if (local.calcGrowth.status === "correct") bindQuiz("qWait", STAGE3_Q_WAIT, "qWait");
  }

  if (step === 5) bindQuiz("qJoint", STAGE3_Q_JOINT, "qJoint");

  if (step === 6) {
    bindQuiz("qSlaDef", STAGE3_Q_SLA_DEF, "qSlaDef");
    bindQuiz("qSlaSame", STAGE3_Q_SLA_SAME, "qSlaSame");
    bindMetricDashboard(root, {
      onSelect(id) {
        local.dashActive = id;
        local.dashSeen.add(id);
        if (local.dashSeen.size >= 1) store.markStage3Gate("dashboard", true);
        render();
      },
    });
  }

  if (step === 7) {
    root.querySelectorAll("[data-check3]").forEach((input) => {
      input.addEventListener("change", () => {
        store.setStage3ChecklistItem(input.dataset.check3, input.checked);
      });
    });

    root.querySelectorAll("[data-ck-ans]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.ckId;
        const ans = btn.dataset.ckAns;
        const ck = STAGE3_CHECKPOINT.find((c) => c.id === id);
        if (!ck || local.checkpoint[id].checked) return;
        local.checkpoint[id].selectedId = ans;
        local.checkpoint[id].checked = true;
        local.checkpoint[id].status = ans === ck.correctId ? "correct" : "incorrect";
        if (ans === ck.correctId) store.markStage3Checkpoint(id, true);
        render();
      });
    });

    root.querySelectorAll("[data-ck-retry]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.ckRetry;
        local.checkpoint[id] = { selectedId: null, checked: false, status: null };
        store.markStage3Checkpoint(id, false);
        render();
      });
    });

    root.querySelector('[data-action="finish-stage3"]')?.addEventListener("click", () => {
      if (!checkpointReady(store.getState())) return;
      store.completeStage3();
      render();
    });

    root.querySelector('[data-action="go-stage4"]')?.addEventListener("click", () => {
      store.startStage4();
    });
  }

  bindNavigation(root, {
    onPrev() {
      if (step === 0) store.setView("path");
      else store.setStage3Step(step - 1);
    },
    onNext() {
      if (!canAdvance(step, store.getState())) return;
      if (step < STAGE3_STEPS.length - 1) store.setStage3Step(step + 1);
    },
  });
}
