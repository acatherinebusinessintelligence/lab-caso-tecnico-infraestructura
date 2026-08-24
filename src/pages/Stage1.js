import { ConsultantTip } from "../components/ConsultantTip.js";
import {
  QuestionCard,
  evaluateSingleChoice,
  bindQuestionCard,
} from "../components/QuestionCard.js";
import { bindStandardQuiz, emptyQuizState, quizFromGate } from "../utils/quizHelpers.js";
import {
  ClassifyBoard,
  evaluateClassify,
  bindClassifyBoard,
} from "../components/ClassifyBoard.js";
import { NavigationButtons, bindNavigation } from "../components/StageLayout.js";
import {
  STAGE1_STEPS,
  STAGE1_Q1,
  STAGE1_Q2,
  STAGE1_Q3,
  STAGE1_CLASSIFY_ITEMS,
  STAGE1_APPLY_CHECKS,
} from "../data/stage1.js";

/** Estado local de interacción (se reinicia al entrar a la etapa). */
let local = {
  q1: { selectedId: null, checked: false, status: null, message: "", attempt: 0 },
  q2: { selectedId: null, checked: false, status: null, message: "", attempt: 0 },
  q3: { selectedId: null, checked: false, status: null, message: "", attempt: 0 },
  classify: { assignments: {}, checked: false, status: null, message: "" },
};

export function resetStage1Local(state) {
  const act = state.activities || {};
  local = {
    q1: quizFromGate(state.stage1?.q1, STAGE1_Q1.feedback.correct, act["s1.q1"]),
    q2: quizFromGate(state.stage1?.q2, STAGE1_Q2.feedback.correct, act["s1.q2"]),
    q3: quizFromGate(state.stage1?.q3, STAGE1_Q3.feedback.correct, act["s1.q3"]),
    classify: {
      assignments: state.stage1?.classify
        ? Object.fromEntries(STAGE1_CLASSIFY_ITEMS.map((i) => [i.id, i.bucket]))
        : {},
      checked: Boolean(state.stage1?.classify),
      status: state.stage1?.classify ? "correct" : null,
      message: state.stage1?.classify
        ? "Correcto. Ya puedes diferenciar lo que el negocio consume de los componentes que permiten prestarlo."
        : "",
    },
  };
}

function stepDots(step) {
  return `
    <div class="step-dots" aria-label="Progreso dentro de la Etapa 1">
      ${STAGE1_STEPS.map(
        (s, i) => `
        <span class="step-dot ${i === step ? "is-active" : ""} ${i < step ? "is-done" : ""}" title="${s.title}"></span>
      `
      ).join("")}
      <span class="step-dots__label">Paso ${step + 1} de ${STAGE1_STEPS.length}</span>
    </div>
  `;
}

function renderStep0() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">Antes de mirar la tecnología</h2>
        <div class="callout-warn">
          <strong>Idea central:</strong>
          La infraestructura no existe por sí sola. Existe para soportar servicios del negocio.
        </div>
        <p>Cuando recibes un caso técnico, <strong>no</strong> debes comenzar preguntando:</p>
        <ul>
          <li>¿qué servidor comprar?</li>
          <li>¿qué nube usar?</li>
          <li>¿qué firewall instalar?</li>
        </ul>
        <p>Primero debes preguntar:</p>
        <ul>
          <li>¿qué hace la organización?</li>
          <li>¿quién utiliza el servicio?</li>
          <li>¿qué proceso depende de la tecnología?</li>
          <li>¿qué ocurre si el servicio falla?</li>
          <li>¿cuánto tiempo puede estar indisponible?</li>
        </ul>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · OBSERVA</p>
      <div class="stage-block__body">
        <div class="flow-diagram" aria-label="Cadena negocio-servicios-tecnología">
          <span class="flow-node">NEGOCIO</span>
          <span class="flow-sep" aria-hidden="true">↓</span>
          <span class="flow-node">SERVICIOS</span>
          <span class="flow-sep" aria-hidden="true">↓</span>
          <span class="flow-node">TECNOLOGÍA</span>
        </div>
        <p class="meta-line" style="margin-top:0.85rem;">
          <strong>Primero comprende el negocio. Después analiza la tecnología.</strong>
        </p>
      </div>
    </article>

    ${ConsultantTip({
      text: "Una decisión técnicamente correcta puede ser una mala decisión si no responde a una necesidad del negocio.",
    })}

    <article class="stage-block">
      <p class="stage-block__label">3 · DECIDE</p>
      <div class="stage-block__body" data-quiz="q1">
        ${QuestionCard({
          question: STAGE1_Q1,
          selectedId: local.q1.selectedId,
          checked: local.q1.checked,
          feedbackStatus: local.q1.status,
          feedbackMessage: local.q1.message,
          attempt: local.q1.attempt || 1,
        })}
      </div>
    </article>
  `;
}

function renderStep1() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">¿Qué protege realmente TI?</h2>
        <p>La criticidad debe analizarse desde el <strong>servicio y su impacto</strong>, no solamente desde el componente.</p>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · OBSERVA</p>
      <div class="stage-block__body">
        <div class="two-col">
          <div class="two-col__card">
            <h3>NEGOCIO</h3>
            <ul>
              <li>atender pacientes</li>
              <li>realizar matrículas</li>
              <li>procesar pagos</li>
              <li>vender productos</li>
              <li>despachar pedidos</li>
            </ul>
          </div>
          <div class="two-col__card">
            <h3>TECNOLOGÍA</h3>
            <ul>
              <li>aplicaciones</li>
              <li>servidores</li>
              <li>redes</li>
              <li>bases de datos</li>
              <li>almacenamiento</li>
            </ul>
          </div>
        </div>

        <p style="margin:1rem 0 0.5rem;"><strong>Relación:</strong></p>
        <div class="flow-diagram">
          <span class="flow-node">Negocio</span>
          <span class="flow-sep" aria-hidden="true">↓</span>
          <span class="flow-node">Servicio tecnológico</span>
          <span class="flow-sep" aria-hidden="true">↓</span>
          <span class="flow-node">Componentes</span>
        </div>

        <div class="example-chain card-pad" style="margin-top:1rem;background:var(--blue-tint);border-radius:12px;">
          <p style="margin:0 0 0.4rem;"><strong>Ejemplo</strong></p>
          <div class="flow-diagram">
            <span class="flow-node">Atender pacientes</span>
            <span class="flow-sep" aria-hidden="true">↓</span>
            <span class="flow-node">Historia Clínica Electrónica</span>
            <span class="flow-sep" aria-hidden="true">↓</span>
            <span class="flow-node">App + BD + Red + Almacenamiento</span>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderStep2() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">No confundas un servicio con un componente</h2>
        <div class="two-col">
          <div class="two-col__card">
            <h3>SERVICIO TECNOLÓGICO</h3>
            <p>Capacidad tecnológica que entrega valor a un usuario o proceso.</p>
          </div>
          <div class="two-col__card">
            <h3>COMPONENTE</h3>
            <p>Elemento técnico que permite prestar ese servicio.</p>
          </div>
        </div>
        <div class="pair-grid" style="margin-top:1rem;">
          <div><strong>Historia Clínica Electrónica</strong> = Servicio</div>
          <div><strong>APP-SRV01</strong> = Componente</div>
          <div><strong>Moodle</strong> = Servicio</div>
          <div><strong>LMS-SRV01</strong> = Componente</div>
          <div><strong>Motor de pagos</strong> = Servicio</div>
          <div><strong>PAY-SRV01</strong> = Componente</div>
          <div><strong>Portal ciudadano</strong> = Servicio</div>
          <div><strong>Firewall</strong> = Componente</div>
        </div>
      </div>
    </article>

    ${ConsultantTip({
      text: "No preguntes primero cuál servidor es más crítico. Pregunta primero cuál servicio es más crítico y después identifica de qué componentes depende.",
    })}

    <article class="stage-block">
      <p class="stage-block__label">3 · DECIDE</p>
      <div class="stage-block__body" data-quiz="classify">
        ${ClassifyBoard({
          items: STAGE1_CLASSIFY_ITEMS,
          assignments: local.classify.assignments,
          checked: local.classify.checked,
          feedbackStatus: local.classify.status,
          feedbackMessage: local.classify.message,
          attempt: local.classify.attempt || 1,
        })}
      </div>
    </article>
  `;
}

function renderStep3() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">¿Qué hace crítico a un servicio?</h2>
        <p>La criticidad puede depender de:</p>
        <ul>
          <li>cantidad y tipo de usuarios afectados</li>
          <li>impacto operativo</li>
          <li>impacto financiero</li>
          <li>impacto sobre seguridad</li>
          <li>impacto legal o regulatorio</li>
          <li>impacto reputacional</li>
          <li>horario requerido</li>
          <li>dependencia de otros procesos</li>
        </ul>
        <div class="callout-warn">
          <strong>Aclaración:</strong>
          24/7 no significa automáticamente que todos los servicios tengan la misma criticidad.
        </div>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · OBSERVA</p>
      <div class="stage-block__body">
        <p><strong>Microcaso — Universidad</strong></p>
        <div class="microcase-grid">
          <div class="two-col__card"><strong>A. Moodle</strong><br/>Estudiantes y docentes. Opera 24/7.</div>
          <div class="two-col__card"><strong>B. Portal institucional</strong><br/>Noticias e información. Opera 24/7.</div>
          <div class="two-col__card"><strong>C. Sistema de matrículas</strong><br/>Durante matrícula: inscripción y pago.</div>
        </div>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">3 · DECIDE</p>
      <div class="stage-block__body" data-quiz="q2">
        ${QuestionCard({
          question: STAGE1_Q2,
          selectedId: local.q2.selectedId,
          checked: local.q2.checked,
          feedbackStatus: local.q2.status,
          feedbackMessage: local.q2.message,
          attempt: local.q2.attempt || 1,
        })}
      </div>
    </article>
  `;
}

function renderStep4(state) {
  const checks = STAGE1_APPLY_CHECKS.map((c) => {
    const on = Boolean(state.stage1.checklist?.[c.id]);
    return `
      <label class="check-item">
        <input type="checkbox" data-check="${c.id}" ${on ? "checked" : ""} />
        <span>${c.label}</span>
      </label>
    `;
  }).join("");

  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">Las restricciones también forman parte del diagnóstico</h2>
        <p>Antes de recomendar una solución debes identificar condiciones como:</p>
        <ul>
          <li>presupuesto limitado</li>
          <li>servicios que no pueden reemplazarse</li>
          <li>operación 24/7</li>
          <li>regulación y sensibilidad de la información</li>
          <li>contratos existentes</li>
          <li>falta de personal especializado</li>
          <li>crecimiento esperado y restricciones de tiempo</li>
        </ul>
        <div class="example-chain card-pad" style="background:var(--blue-tint);border-radius:12px;">
          <p style="margin:0;"><strong>Ejemplo:</strong> almacenamiento cercano al límite + no se puede reemplazar de inmediato la plataforma principal → la recomendación debe respetar ambas condiciones.</p>
        </div>
      </div>
    </article>

    ${ConsultantTip({
      text: "Una buena recomendación no ignora las restricciones del caso; trabaja dentro de ellas.",
    })}

    <article class="stage-block">
      <p class="stage-block__label">3 · DECIDE</p>
      <div class="stage-block__body">
        <p><strong>Microcaso:</strong> servicio crítico 24/7 · CPU al 92 % · presupuesto parcialmente comprometido.</p>
        <div data-quiz="q3">
          ${QuestionCard({
            question: STAGE1_Q3,
            selectedId: local.q3.selectedId,
            checked: local.q3.checked,
            feedbackStatus: local.q3.status,
            feedbackMessage: local.q3.message,
          attempt: local.q3.attempt || 1,
          })}
        </div>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">4 · APLICA A TU CASO</p>
      <div class="stage-block__body">
        <div class="callout-warn">
          <strong>Ahora abre el caso asignado a tu equipo.</strong>
          Este bloque orienta qué revisar; no entregues aquí la solución completa.
        </div>
        <ol>
          <li>¿Qué hace la organización?</li>
          <li>¿Quiénes son sus usuarios principales?</li>
          <li>¿Cuáles son los tres servicios tecnológicos más importantes?</li>
          <li>¿Cuál consideras el servicio más crítico?</li>
          <li>¿Por qué?</li>
          <li>¿Qué ocurriría si ese servicio estuviera indisponible?</li>
          <li>¿Qué restricciones pueden condicionar decisiones posteriores?</li>
        </ol>

        <div class="mini-table-wrap" role="region" aria-label="Tabla orientadora">
          <table class="mini-table">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Usuarios</th>
                <th>Operación requerida</th>
                <th>Impacto si falla</th>
                <th>Criticidad</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>
              <tr><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>
              <tr><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>
            </tbody>
          </table>
        </div>

        <div class="checklist" aria-label="Checklist de comprensión">
          ${checks}
        </div>
      </div>
    </article>

    ${
      state.stage1Complete
        ? `
      <article class="stage-block">
        <div class="stage-block__body">
          <div class="closure-card">
            <h2 class="h2">Etapa 1 completada</h2>
            <p>Ya sabes qué necesita proteger la infraestructura.</p>
            <p>Ahora vamos a representar cómo funciona actualmente.</p>
            <p class="meta-line"><strong>Siguiente etapa:</strong> REPRESENTAR EL AS-IS</p>
            <div class="btn-row" style="justify-content:flex-start;">
              <button type="button" class="btn btn-cta" data-action="go-stage2">
                CONTINUAR A ETAPA 2
              </button>
            </div>
          </div>
        </div>
      </article>
    `
        : `
      <article class="stage-block">
        <div class="stage-block__body">
          <h3 class="h2" style="font-size:1.1rem;">Antes de continuar, deberías poder responder:</h3>
          <ul>
            <li>¿Cuál es la diferencia entre servicio y componente?</li>
            <li>¿Qué hace crítico a un servicio?</li>
            <li>¿Qué impacto tendría su indisponibilidad?</li>
            <li>¿Qué restricciones tiene la organización?</li>
          </ul>
          <button type="button" class="btn btn-cta" data-action="finish-stage1" ${
            local.q3.status === "correct" ? "" : "disabled"
          }>
            FINALIZAR ETAPA 1
          </button>
        </div>
      </article>
    `
    }
  `;
}

function canAdvance(step, state) {
  const gate = STAGE1_STEPS[step].gate;
  if (!gate) return true;
  if (gate === "q1") return local.q1.status === "correct" || state.stage1.q1;
  if (gate === "classify") return local.classify.status === "correct" || state.stage1.classify;
  if (gate === "q2") return local.q2.status === "correct" || state.stage1.q2;
  if (gate === "q3") return local.q3.status === "correct" || state.stage1.q3;
  return true;
}

export function Stage1Page(state) {
  const step = Math.min(state.stage1Step || 0, STAGE1_STEPS.length - 1);
  const title = STAGE1_STEPS[step].title;
  let body = "";
  if (step === 0) body = renderStep0();
  if (step === 1) body = renderStep1();
  if (step === 2) body = renderStep2();
  if (step === 3) body = renderStep3();
  if (step === 4) body = renderStep4(state);

  const isLast = step === STAGE1_STEPS.length - 1;
  const canNext = !isLast && canAdvance(step, state);

  return `
    <section class="page stage1" aria-label="Etapa 1 COMPRENDER">
      <header class="card card-pad">
        <p class="eyebrow">Etapa 1 · COMPRENDER</p>
        <h1 class="h1" style="font-size:1.55rem;">${title}</h1>
        <p class="lead">Primero comprende el negocio. Después analiza la tecnología.</p>
        ${stepDots(step)}
      </header>

      <div class="stage-layout">
        ${body}
      </div>

      ${
        state.stage1Complete && isLast
          ? ""
          : NavigationButtons({
              canGoPrev: true,
              canGoNext: canNext,
              prevLabel: step === 0 ? "VOLVER AL MAPA" : "ANTERIOR",
              nextLabel: "CONTINUAR",
            })
      }
    </section>
  `;
}

export function bindStage1(root, { store, render }) {
  const state = store.getState();
  const step = state.stage1Step || 0;

  const bindQuiz = (key, question, gateName) => {
    bindStandardQuiz({
      root,
      local,
      key,
      question,
      gateName,
      markGate: (g, v) => store.markStage1Gate(g, v),
      render,
      stageId: 1,
      store,
      activityPrefix: "s1",
    });
  };

  if (step === 0) bindQuiz("q1", STAGE1_Q1, "q1");
  if (step === 3) bindQuiz("q2", STAGE1_Q2, "q2");
  if (step === 4) bindQuiz("q3", STAGE1_Q3, "q3");

  if (step === 2) {
    const scope = root.querySelector('[data-quiz="classify"]');
    if (scope) {
      bindClassifyBoard(scope, {
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
          const result = evaluateClassify(STAGE1_CLASSIFY_ITEMS, local.classify.assignments);
          local.classify.checked = true;
          local.classify.status = result.status;
          local.classify.message = result.message;
          if (result.status === "correct") store.markStage1Gate("classify", true);
          render();
        },
        onRetry() {
          local.classify = { assignments: {}, checked: false, status: null, message: "" };
          store.markStage1Gate("classify", false);
          render();
        },
      });
    }
  }

  if (step === 4) {
    root.querySelectorAll("[data-check]").forEach((input) => {
      input.addEventListener("change", () => {
        store.setChecklistItem(input.dataset.check, input.checked);
      });
    });
    root.querySelector('[data-action="finish-stage1"]')?.addEventListener("click", () => {
      if (local.q3.status !== "correct" && !state.stage1.q3) return;
      store.completeStage1();
      render();
    });
    root.querySelector('[data-action="go-stage2"]')?.addEventListener("click", () => {
      store.startStage2();
    });
  }

  bindNavigation(root, {
    onPrev() {
      if (step === 0) store.setView("path");
      else store.setStage1Step(step - 1);
    },
    onNext() {
      if (!canAdvance(step, store.getState())) return;
      if (step < STAGE1_STEPS.length - 1) store.setStage1Step(step + 1);
    },
  });
}

export function Stage2SoonPage(state) {
  return `
    <section class="page card card-pad">
      <p class="eyebrow">Etapa 2</p>
      <h1 class="h1" style="font-size:1.5rem;">REPRESENTAR EL AS-IS</h1>
      <p class="lead">Esta etapa ya está disponible. Continúa desde el mapa o el botón de la Etapa 1.</p>
      <div class="btn-row" style="justify-content:flex-start;">
        <button type="button" class="btn btn-cta" data-action="open-stage2">ABRIR ETAPA 2</button>
        <button type="button" class="btn btn-secondary" data-action="back-path">VER MAPA</button>
      </div>
    </section>
  `;
}

export function bindStage2Soon(root, { store }) {
  root.querySelector('[data-action="open-stage2"]')?.addEventListener("click", () => store.startStage2());
  root.querySelector('[data-action="back-path"]')?.addEventListener("click", () => store.setView("path"));
}
