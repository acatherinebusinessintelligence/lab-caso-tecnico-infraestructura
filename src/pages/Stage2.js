import { ConsultantTip } from "../components/ConsultantTip.js";
import {
  QuestionCard,
  evaluateSingleChoice,
  bindQuestionCard,
} from "../components/QuestionCard.js";
import { bindStandardQuiz, emptyQuizState, quizFromGate } from "../utils/quizHelpers.js";
import {
  OrderChain,
  evaluateOrder,
  shuffleIds,
  bindOrderChain,
} from "../components/OrderChain.js";
import {
  SpofPicker,
  evaluateSpofSelection,
  bindSpofPicker,
} from "../components/SpofPicker.js";
import { NavigationButtons, bindNavigation } from "../components/StageLayout.js";
import {
  STAGE2_STEPS,
  STAGE2_Q_ASIS,
  STAGE2_Q_INCLUDE,
  STAGE2_Q_SPOF1,
  STAGE2_Q_SPOF2,
  STAGE2_Q_EXTERNAL,
  STAGE2_ORDER_ITEMS,
  STAGE2_ORDER_CORRECT,
  STAGE2_SPOF_NODES,
  STAGE2_APPLY_CHECKS,
} from "../data/stage2.js";

let local = null;

function emptyQuiz() {
  return { selectedId: null, checked: false, status: null, message: "", attempt: 0 };
}

export function resetStage2Local(state) {
  const s2 = state.stage2 || {};
  local = {
    qAsis: {
      ...emptyQuiz(),
      checked: Boolean(s2.qAsis),
      status: s2.qAsis ? "correct" : null,
      message: s2.qAsis ? STAGE2_Q_ASIS.feedback.correct : "",
    },
    qInclude: {
      ...emptyQuiz(),
      checked: Boolean(s2.qInclude),
      status: s2.qInclude ? "correct" : null,
      message: s2.qInclude ? STAGE2_Q_INCLUDE.feedback.correct : "",
    },
    qSpof1: {
      ...emptyQuiz(),
      checked: Boolean(s2.qSpof1),
      status: s2.qSpof1 ? "correct" : null,
      message: s2.qSpof1 ? STAGE2_Q_SPOF1.feedback.correct : "",
    },
    qSpof2: {
      ...emptyQuiz(),
      checked: Boolean(s2.qSpof2),
      status: s2.qSpof2 ? "correct" : null,
      message: s2.qSpof2 ? STAGE2_Q_SPOF2.feedback.correct : "",
    },
    qExternal: {
      ...emptyQuiz(),
      checked: Boolean(s2.qExternal),
      status: s2.qExternal ? "correct" : null,
      message: s2.qExternal ? STAGE2_Q_EXTERNAL.feedback.correct : "",
    },
    order: {
      order: s2.order ? [...STAGE2_ORDER_CORRECT] : shuffleIds(STAGE2_ORDER_CORRECT),
      checked: Boolean(s2.order),
      status: s2.order ? "correct" : null,
      message: s2.order
        ? "Correcto. Ahora puedes visualizar cómo un usuario depende progresivamente de distintos componentes."
        : "",
    },
    spof: {
      selected: s2.spofPicker ? ["firewall", "db01"] : [],
      checked: Boolean(s2.spofPicker),
      status: s2.spofPicker ? "correct" : null,
      message: s2.spofPicker
        ? "Correcto. Firewall y DB01 son los principales puntos únicos."
        : "",
    },
  };
}

function stepDots(step) {
  return `
    <div class="step-dots" aria-label="Progreso dentro de la Etapa 2">
      ${STAGE2_STEPS.map(
        (_, i) => `
        <span class="step-dot ${i === step ? "is-active" : ""} ${i < step ? "is-done" : ""}"></span>
      `
      ).join("")}
      <span class="step-dots__label">Paso ${step + 1} de ${STAGE2_STEPS.length}</span>
    </div>
  `;
}

function renderStep0() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">Representar el AS-IS</h2>
        <p><strong>AS-IS</strong> significa: cómo funciona <em>actualmente</em> la infraestructura.</p>
        <p>Debe mostrar: componentes existentes, relaciones, conectividad, dependencias, ubicación lógica/física cuando sea relevante y servicios que soporta.</p>
        <div class="callout-warn"><strong>Advertencia:</strong> En esta etapa NO construyas todavía el TO-BE.</div>
        <p class="meta-line" style="margin-top:0.75rem;"><strong>Representa primero lo que existe. No dibujes todavía lo que quieres mejorar.</strong></p>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · OBSERVA</p>
      <div class="stage-block__body">
        <div class="two-col">
          <div class="two-col__card">
            <h3>AS-IS · Lo que existe hoy</h3>
            <div class="flow-diagram">
              <span class="flow-node">Usuarios</span><span class="flow-sep">↓</span>
              <span class="flow-node">Internet</span><span class="flow-sep">↓</span>
              <span class="flow-node">Firewall</span><span class="flow-sep">↓</span>
              <span class="flow-node">APP-SRV01</span><span class="flow-sep">↓</span>
              <span class="flow-node">DB-SRV01</span>
            </div>
          </div>
          <div class="two-col__card">
            <h3>TO-BE · Lo que propondríamos después</h3>
            <div class="flow-diagram">
              <span class="flow-node">Usuarios</span><span class="flow-sep">↓</span>
              <span class="flow-node">Internet redundante</span><span class="flow-sep">↓</span>
              <span class="flow-node">Firewall HA</span><span class="flow-sep">↓</span>
              <span class="flow-node">Balanceador</span><span class="flow-sep">↓</span>
              <span class="flow-node">APP01 + APP02</span><span class="flow-sep">↓</span>
              <span class="flow-node">DB Cluster</span>
            </div>
          </div>
        </div>
      </div>
    </article>

    ${ConsultantTip({
      text: "Un AS-IS útil no tiene que ser un diagrama arquitectónico perfecto. Debe permitir entender de qué depende un servicio y dónde podrían existir riesgos.",
    })}

    <article class="stage-block">
      <p class="stage-block__label">3 · DECIDE</p>
      <div class="stage-block__body" data-quiz="qAsis">
        ${QuestionCard({
          question: STAGE2_Q_ASIS,
          selectedId: local.qAsis.selectedId,
          checked: local.qAsis.checked,
          feedbackStatus: local.qAsis.status,
          feedbackMessage: local.qAsis.message,
          attempt: local.qAsis.attempt || 1,
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
        <h2 class="h2">De servicio a infraestructura</h2>
        <p>Una arquitectura AS-IS no debe ser solamente una lista de servidores. Debe mostrar <strong>relaciones</strong>.</p>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · OBSERVA</p>
      <div class="stage-block__body">
        <p><strong>Guía de flujo</strong> (adaptable al caso):</p>
        <div class="flow-diagram">
          ${["USUARIOS","CONECTIVIDAD","SEGURIDAD","APLICACIÓN","DATOS","ALMACENAMIENTO","BACKUP"]
            .map((n, i, arr) => `<span class="flow-node">${n}</span>${i < arr.length - 1 ? '<span class="flow-sep">↓</span>' : ""}`)
            .join("")}
        </div>
        <div class="microcase-grid" style="margin-top:1rem;">
          <div class="two-col__card"><strong>Distribuido</strong><br/>Sucursal → Internet → VPN → Firewall → App central → BD</div>
          <div class="two-col__card"><strong>Cloud</strong><br/>Usuario → Internet → WAF → Balanceador → Apps → BD administrada</div>
          <div class="two-col__card"><strong>IoT</strong><br/>Sensor → Gateway → Red → Plataforma IoT → BD → Analítica</div>
        </div>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">3 · DECIDE</p>
      <div class="stage-block__body" data-quiz="order">
        ${OrderChain({
          items: STAGE2_ORDER_ITEMS,
          order: local.order.order,
          checked: local.order.checked,
          feedbackStatus: local.order.status,
          feedbackMessage: local.order.message,
          attempt: local.order.attempt || 1,
        })}
      </div>
    </article>
  `;
}

function renderStep2() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">No dibujes por dibujar</h2>
        <p>Incluye solo elementos relevantes para comprender el servicio. No todos los casos tendrán todos los elementos.</p>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · OBSERVA</p>
      <div class="stage-block__body">
        <div class="category-grid">
          <div class="two-col__card"><h3>Usuarios</h3><p>clientes, empleados, estudiantes, médicos, operadores, dispositivos</p></div>
          <div class="two-col__card"><h3>Conectividad</h3><p>Internet, enlaces, VPN, Wi-Fi, redes internas</p></div>
          <div class="two-col__card"><h3>Seguridad</h3><p>firewall, WAF, autenticación, segmentación</p></div>
          <div class="two-col__card"><h3>Computación</h3><p>servidores, VMs, cloud, aplicaciones</p></div>
          <div class="two-col__card"><h3>Datos</h3><p>bases de datos, almacenamiento, NAS, cloud storage</p></div>
          <div class="two-col__card"><h3>Continuidad</h3><p>backups, réplicas, sitios alternos</p></div>
          <div class="two-col__card"><h3>Dependencias externas</h3><p>proveedores, API, pasarelas, identidad, redes externas</p></div>
        </div>
        <p class="meta-line" style="margin-top:0.85rem;"><strong>Microcaso:</strong> portal web, firewall, servidor de aplicaciones, base de datos, proveedor externo de pagos… y también una impresora administrativa.</p>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">3 · DECIDE</p>
      <div class="stage-block__body" data-quiz="qInclude">
        ${QuestionCard({
          question: STAGE2_Q_INCLUDE,
          selectedId: local.qInclude.selectedId,
          checked: local.qInclude.checked,
          feedbackStatus: local.qInclude.status,
          feedbackMessage: local.qInclude.message,
          attempt: local.qInclude.attempt || 1,
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
        <h2 class="h2">Una dependencia puede convertirse en riesgo</h2>
        <p>Alta disponibilidad debe analizarse <strong>de extremo a extremo</strong>.</p>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · OBSERVA</p>
      <div class="stage-block__body">
        <div class="flow-diagram">
          <span class="flow-node">Usuarios</span><span class="flow-sep">↓</span>
          <span class="flow-node">Internet</span><span class="flow-sep">↓</span>
          <span class="flow-node">Firewall</span><span class="flow-sep">↓</span>
          <span class="flow-node">Balanceador</span><span class="flow-sep">↓</span>
          <span class="flow-node">APP-SRV01</span><span class="flow-sep">↘</span>
          <span class="flow-node">APP-SRV02</span><span class="flow-sep">↓</span>
          <span class="flow-node">DB-SRV01</span>
        </div>
        <ul style="margin-top:1rem;">
          <li>Existen dos servidores de aplicación.</li>
          <li>Ambos dependen del mismo balanceador.</li>
          <li>Ambos dependen de la misma base de datos.</li>
          <li>La existencia de dos APP no significa que toda la arquitectura sea redundante.</li>
        </ul>
      </div>
    </article>

    ${ConsultantTip({
      text: "Dos servidores no significan automáticamente alta disponibilidad.",
    })}
  `;
}

function renderStep4() {
  return `
    <article class="stage-block">
      <p class="stage-block__label">1 · CONCEPTO</p>
      <div class="stage-block__body">
        <h2 class="h2">Identificar Single Points of Failure</h2>
        <p><strong>SPOF:</strong> componente cuya falla puede interrumpir un servicio porque no existe una alternativa funcional que mantenga la operación.</p>
        <div class="callout-warn"><strong>Advertencia:</strong> No todo componente único es automáticamente un SPOF.</div>
        <p>Analiza: dependencia, alternativa, redundancia real, failover, impacto y cuánto servicio se pierde.</p>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">2 · OBSERVA</p>
      <div class="stage-block__body">
        <div class="flow-diagram">
          <span class="flow-node">Servicio</span><span class="flow-sep">↓</span>
          <span class="flow-node">Firewall único</span><span class="flow-sep">↓</span>
          <span class="flow-node">Apps redundantes</span><span class="flow-sep">↓</span>
          <span class="flow-node">Base de datos única</span>
        </div>
        <p class="meta-line">Candidatos típicos: firewall único y base de datos única — siempre con evidencia de impacto.</p>

        <div class="spof-matrix" style="margin-top:1rem;">
          <h3 class="h2" style="font-size:1.05rem;">Matriz de SPOF (plantilla)</h3>
          <div class="mini-table-wrap">
            <table class="mini-table">
              <thead>
                <tr><th>Componente</th><th>¿Por qué podría ser SPOF?</th><th>Impacto</th><th>Criticidad</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>DB-SRV01</td>
                  <td>Única BD productiva</td>
                  <td>Apps no consultan ni registran</td>
                  <td>Alta / Crítica según servicio</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="meta-line">Este ejemplo NO debe copiarse automáticamente al caso.</p>
        </div>
      </div>
    </article>

    <article class="stage-block">
      <p class="stage-block__label">3 · DECIDE</p>
      <div class="stage-block__body">
        <p><strong>Ejercicio SPOF 1:</strong> APP-SRV01, APP-SRV02, balanceador, AUTH-SRV01 (única), DB-SRV01. Apps balanceadas.</p>
        <div data-quiz="qSpof1" style="margin-bottom:1.25rem;">
          ${QuestionCard({
            question: STAGE2_Q_SPOF1,
            selectedId: local.qSpof1.selectedId,
            checked: local.qSpof1.checked,
            feedbackStatus: local.qSpof1.status,
            feedbackMessage: local.qSpof1.message,
          attempt: local.qSpof1.attempt || 1,
          })}
        </div>

        <p><strong>Ejercicio SPOF 2:</strong> servidor de reportes internos en horario laboral; si falla, reportes al día siguiente.</p>
        <div data-quiz="qSpof2" style="margin-bottom:1.25rem;">
          ${QuestionCard({
            question: STAGE2_Q_SPOF2,
            selectedId: local.qSpof2.selectedId,
            checked: local.qSpof2.checked,
            feedbackStatus: local.qSpof2.status,
            feedbackMessage: local.qSpof2.message,
          attempt: local.qSpof2.attempt || 1,
          })}
        </div>

        <p><strong>Dependencias externas:</strong> el SPOF puede estar fuera de tu infraestructura (Internet, cloud, pagos, identidad, API, enlaces).</p>
        <div data-quiz="qExternal" style="margin-bottom:1.25rem;">
          ${QuestionCard({
            question: STAGE2_Q_EXTERNAL,
            selectedId: local.qExternal.selectedId,
            checked: local.qExternal.checked,
            feedbackStatus: local.qExternal.status,
            feedbackMessage: local.qExternal.message,
          attempt: local.qExternal.attempt || 1,
          })}
        </div>

        <div data-quiz="spofPicker">
          ${SpofPicker({
            nodes: STAGE2_SPOF_NODES,
            selected: local.spof.selected,
            checked: local.spof.checked,
            feedbackStatus: local.spof.status,
            feedbackMessage: local.spof.message,
          attempt: local.spof.attempt || 1,
          })}
        </div>
      </div>
    </article>
  `;
}

function renderStep5(state) {
  const checks = STAGE2_APPLY_CHECKS.map((c) => {
    const on = Boolean(state.stage2.checklist?.[c.id]);
    return `
      <label class="check-item">
        <input type="checkbox" data-check2="${c.id}" ${on ? "checked" : ""} />
        <span>${c.label}</span>
      </label>
    `;
  }).join("");

  return `
    <article class="stage-block">
      <p class="stage-block__label">4 · APLICA A TU CASO</p>
      <div class="stage-block__body">
        <div class="callout-warn">
          <strong>Ahora vuelve al caso asignado a tu equipo.</strong>
          Este bloque orienta el AS-IS; no entregues aquí el diagrama final.
        </div>
        <ol>
          <li>¿Quién consume el servicio crítico?</li>
          <li>¿Cómo llega al servicio?</li>
          <li>¿Qué conexión necesita?</li>
          <li>¿Qué mecanismo de seguridad atraviesa?</li>
          <li>¿Qué aplicación lo soporta?</li>
          <li>¿Dónde están los datos?</li>
          <li>¿Dónde se almacenan?</li>
          <li>¿Cómo se respaldan?</li>
          <li>¿Existen sedes o proveedores externos?</li>
          <li>¿Qué componentes podrían ser SPOF?</li>
        </ol>
        <div class="checklist">${checks}</div>
      </div>
    </article>

    ${
      state.stage2Complete
        ? `
      <article class="stage-block">
        <div class="stage-block__body">
          <div class="closure-card">
            <h2 class="h2">Etapa 2 completada</h2>
            <p>Ya sabes cómo funciona la infraestructura.</p>
            <p>Ahora necesitamos saber cómo se está comportando.</p>
            <p class="meta-line"><strong>Siguiente etapa:</strong> MEDIR LA INFRAESTRUCTURA</p>
            <div class="btn-row" style="justify-content:flex-start;">
              <button type="button" class="btn btn-cta" data-action="go-stage3">CONTINUAR A ETAPA 3</button>
            </div>
          </div>
        </div>
      </article>`
        : `
      <article class="stage-block">
        <div class="stage-block__body">
          <h3 class="h2" style="font-size:1.1rem;">Antes de continuar deberías poder explicar tu arquitectura sin mirar el diagrama.</h3>
          <ul>
            <li>¿Cómo llega un usuario al servicio?</li>
            <li>¿Qué componentes necesita?</li>
            <li>¿Dónde están los datos?</li>
            <li>¿Qué ocurre si falla un componente?</li>
            <li>¿Dónde existen dependencias únicas?</li>
          </ul>
          <button type="button" class="btn btn-cta" data-action="finish-stage2" ${
            spofBlockReady(state) ? "" : "disabled"
          }>
            FINALIZAR ETAPA 2
          </button>
        </div>
      </article>`
    }
  `;
}

function spofBlockReady(state) {
  const s = state.stage2;
  const pickerOk =
    local.spof.status === "correct" ||
    local.spof.status === "partial" ||
    s.spofPicker;
  return (
    (local.qSpof1.status === "correct" || s.qSpof1) &&
    (local.qSpof2.status === "correct" || s.qSpof2) &&
    (local.qExternal.status === "correct" || s.qExternal) &&
    pickerOk
  );
}

function canAdvance(step, state) {
  const gate = STAGE2_STEPS[step].gate;
  if (!gate) return true;
  if (gate === "qAsis") return local.qAsis.status === "correct" || state.stage2.qAsis;
  if (gate === "order") return local.order.status === "correct" || state.stage2.order;
  if (gate === "qInclude") return local.qInclude.status === "correct" || state.stage2.qInclude;
  if (gate === "spofBlock") return spofBlockReady(state);
  return true;
}

export function Stage2Page(state) {
  if (!local) resetStage2Local(state);
  const step = Math.min(state.stage2Step || 0, STAGE2_STEPS.length - 1);
  let body = "";
  if (step === 0) body = renderStep0();
  if (step === 1) body = renderStep1();
  if (step === 2) body = renderStep2();
  if (step === 3) body = renderStep3();
  if (step === 4) body = renderStep4();
  if (step === 5) body = renderStep5(state);

  const isLast = step === STAGE2_STEPS.length - 1;

  return `
    <section class="page stage2" aria-label="Etapa 2 REPRESENTAR">
      <header class="card card-pad">
        <p class="eyebrow">Etapa 2 · REPRESENTAR</p>
        <h1 class="h1" style="font-size:1.55rem;">${STAGE2_STEPS[step].title}</h1>
        <p class="lead">Representa primero lo que existe. No dibujes todavía lo que quieres mejorar.</p>
        ${stepDots(step)}
      </header>
      <div class="stage-layout">${body}</div>
      ${
        state.stage2Complete && isLast
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

export function bindStage2(root, { store, render }) {
  const state = store.getState();
  const step = state.stage2Step || 0;

  const bindQuiz = (key, question, gateName) => {
    bindStandardQuiz({
      root,
      local,
      key,
      question,
      gateName,
      markGate: (g, v) => store.markStage2Gate(g, v),
      render,
      stageId: 2,
      store,
      activityPrefix: "s2",
    });
  };

  if (step === 0) bindQuiz("qAsis", STAGE2_Q_ASIS, "qAsis");
  if (step === 2) bindQuiz("qInclude", STAGE2_Q_INCLUDE, "qInclude");
  if (step === 4) {
    bindQuiz("qSpof1", STAGE2_Q_SPOF1, "qSpof1");
    bindQuiz("qSpof2", STAGE2_Q_SPOF2, "qSpof2");
    bindQuiz("qExternal", STAGE2_Q_EXTERNAL, "qExternal");

    const scope = root.querySelector('[data-quiz="spofPicker"]');
    if (scope) {
      bindSpofPicker(scope, {
        onToggle(id) {
          if (local.spof.checked) return;
          const set = new Set(local.spof.selected);
          if (set.has(id)) set.delete(id);
          else set.add(id);
          local.spof.selected = [...set];
          render();
        },
        onCheck() {
          const result = evaluateSpofSelection(STAGE2_SPOF_NODES, local.spof.selected);
          local.spof.checked = true;
          local.spof.status = result.status;
          local.spof.message = result.message;
          if (result.status === "correct" || result.status === "partial") {
            store.markStage2Gate("spofPicker", true);
          }
          render();
        },
        onRetry() {
          local.spof = { selected: [], checked: false, status: null, message: "" };
          store.markStage2Gate("spofPicker", false);
          render();
        },
      });
    }
  }

  if (step === 1) {
    const scope = root.querySelector('[data-quiz="order"]');
    if (scope) {
      bindOrderChain(scope, {
        onMove(id, dir) {
          if (local.order.checked) return;
          const arr = [...local.order.order];
          const i = arr.indexOf(id);
          const j = dir === "up" ? i - 1 : i + 1;
          if (j < 0 || j >= arr.length) return;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          local.order.order = arr;
          render();
        },
        onCheck() {
          const result = evaluateOrder(local.order.order, STAGE2_ORDER_CORRECT);
          local.order.checked = true;
          local.order.status = result.status;
          local.order.message = result.message;
          if (result.status === "correct") store.markStage2Gate("order", true);
          render();
        },
        onRetry() {
          local.order = {
            order: shuffleIds(STAGE2_ORDER_CORRECT),
            checked: false,
            status: null,
            message: "",
          };
          store.markStage2Gate("order", false);
          render();
        },
      });
    }
  }

  if (step === 5) {
    root.querySelectorAll("[data-check2]").forEach((input) => {
      input.addEventListener("change", () => {
        store.setStage2ChecklistItem(input.dataset.check2, input.checked);
      });
    });
    root.querySelector('[data-action="finish-stage2"]')?.addEventListener("click", () => {
      if (!spofBlockReady(store.getState())) return;
      store.completeStage2();
      render();
    });
    root.querySelector('[data-action="go-stage3"]')?.addEventListener("click", () => {
      store.startStage3();
    });
  }

  bindNavigation(root, {
    onPrev() {
      if (step === 0) store.setView("path");
      else store.setStage2Step(step - 1);
    },
    onNext() {
      if (!canAdvance(step, store.getState())) return;
      if (step < STAGE2_STEPS.length - 1) store.setStage2Step(step + 1);
    },
  });
}
