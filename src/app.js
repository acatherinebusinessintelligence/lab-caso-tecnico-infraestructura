import { LAB_CONFIG, applyH5PParams } from "./config/labConfig.js";
import { createStore } from "./state/progress.js";
import { HeaderProgress, bindHeaderProgress } from "./components/HeaderProgress.js";
import { AppFooter, bindAppFooter } from "./components/AppFooter.js";
import {
  ResetProgressModal,
  bindResetProgressModal,
} from "./components/ResetProgressModal.js";
import { WelcomePage, bindWelcome } from "./pages/Welcome.js";
import { LearningPathPage, bindLearningPath } from "./pages/LearningPath.js";
import {
  Stage1Page,
  bindStage1,
  resetStage1Local,
} from "./pages/Stage1.js";
import {
  Stage2Page,
  bindStage2,
  resetStage2Local,
} from "./pages/Stage2.js";
import {
  Stage3Page,
  bindStage3,
  resetStage3Local,
} from "./pages/Stage3.js";
import {
  Stage4Page,
  bindStage4,
  resetStage4Local,
} from "./pages/Stage4.js";
import {
  Stage5Page,
  bindStage5,
  resetStage5Local,
} from "./pages/Stage5.js";
import {
  Stage6Page,
  bindStage6,
  resetStage6Local,
} from "./pages/Stage6.js";
import { onTrack } from "./services/trackingService.js";
import { attachXapiBridge } from "./services/xapiBridge.js";
import { resolvePersistence } from "./services/persistence/index.js";
import { STAGES } from "./data/stages.js";

/**
 * Monta el laboratorio en un contenedor (standalone o H5P).
 * @param {HTMLElement} root
 * @param {object} [options]
 */
export function mountLab(root, options = {}) {
  if (!root) throw new Error("mountLab: root requerido");

  if (options.params) applyH5PParams(options.params);
  applyStageNameOverrides(options.params?.stages);

  root.classList.add("h5p-infrastructure-case-lab", "icl-root");
  root.setAttribute("data-icl-root", "1");

  const persistence =
    options.persistence ||
    resolvePersistence({
      preferH5P: Boolean(options.preferH5P),
      previousState: options.previousState ?? null,
      storageKey: LAB_CONFIG.storageKey,
    });

  let stage1Ready = false;
  let stage2Ready = false;
  let stage3Ready = false;
  let stage4Ready = false;
  let stage5Ready = false;
  let stage6Ready = false;
  let resetOpen = false;
  let destroyed = false;

  const store = createStore(() => {
    if (!destroyed) render();
    options.onStateChange?.(store.getState());
  }, {
    persistence,
    previousState: options.previousState,
    preferH5P: options.preferH5P,
  });

  const detachXapi =
    options.h5pInstance
      ? onTrack(
          attachXapiBridge(options.h5pInstance, () => {
            const s = store.getState();
            return {
              ...s.h5pScore,
              progressPercent: s.progressPercent,
            };
          })
        )
      : () => {};

  function focusMain() {
    requestAnimationFrame(() => {
      const main = root.querySelector("#main-content");
      if (main) main.focus({ preventScroll: true });
    });
  }

  function notifyResize() {
    options.onResize?.();
  }

  function render() {
    try {
      const state = store.getState();
      const showHeader =
        state.view === "stage" ||
        state.view === "stage2" ||
        state.view === "stage3" ||
        state.view === "stage4" ||
        state.view === "stage5" ||
        state.view === "stage6";

      if (state.view === "stage" && !stage1Ready) {
        resetStage1Local(state);
        stage1Ready = true;
      }
      if (state.view !== "stage") stage1Ready = false;

      if (state.view === "stage2" && !stage2Ready) {
        resetStage2Local(state);
        stage2Ready = true;
      }
      if (state.view !== "stage2") stage2Ready = false;

      if (state.view === "stage3" && !stage3Ready) {
        resetStage3Local(state);
        stage3Ready = true;
      }
      if (state.view !== "stage3") stage3Ready = false;

      if (state.view === "stage4" && !stage4Ready) {
        resetStage4Local(state);
        stage4Ready = true;
      }
      if (state.view !== "stage4") stage4Ready = false;

      if (state.view === "stage5" && !stage5Ready) {
        resetStage5Local(state);
        stage5Ready = true;
      }
      if (state.view !== "stage5") stage5Ready = false;

      if (state.view === "stage6" && !stage6Ready) {
        resetStage6Local(state);
        stage6Ready = true;
      }
      if (state.view !== "stage6") stage6Ready = false;

      let pageHtml = "";
      if (state.view === "welcome") pageHtml = WelcomePage();
      else if (state.view === "path") pageHtml = LearningPathPage(state);
      else if (state.view === "stage") pageHtml = Stage1Page(state);
      else if (state.view === "stage2") pageHtml = Stage2Page(state);
      else if (state.view === "stage3") pageHtml = Stage3Page(state);
      else if (state.view === "stage4") pageHtml = Stage4Page(state);
      else if (state.view === "stage5") pageHtml = Stage5Page(state);
      else if (state.view === "stage6") pageHtml = Stage6Page(state);
      else pageHtml = LearningPathPage(state);

      const showReset =
        state.view === "path" || state.view === "welcome" || state.labComplete;

      root.innerHTML = `
        <div class="app-shell">
          ${showHeader ? HeaderProgress({ state }) : ""}
          <main class="app-main" id="main-content" tabindex="-1">
            ${pageHtml}
          </main>
          ${AppFooter({ showReset })}
          ${ResetProgressModal({ open: resetOpen })}
        </div>
      `;

      if (showHeader) {
        bindHeaderProgress(root, {
          onGoStage(id) {
            stage1Ready = false;
            stage2Ready = false;
            stage3Ready = false;
            stage4Ready = false;
            stage5Ready = false;
            stage6Ready = false;
            store.goToStage(id);
          },
        });
      }

      bindAppFooter(root, {
        onOpenReset() {
          resetOpen = true;
          render();
        },
      });

      bindResetProgressModal(root, {
        onCancel() {
          resetOpen = false;
          render();
        },
        onConfirm() {
          resetOpen = false;
          stage1Ready = false;
          stage2Ready = false;
          stage3Ready = false;
          stage4Ready = false;
          stage5Ready = false;
          stage6Ready = false;
          store.resetAll();
          store.setView("welcome");
        },
      });

      if (state.view === "welcome") {
        bindWelcome(root, { onStart: () => store.startPath() });
      }

      if (state.view === "path") {
        bindLearningPath(root, {
          onBack: () => store.setView("welcome"),
          onStartStage1: () => {
            stage1Ready = false;
            store.startStage1();
          },
          onStartStage2: () => {
            stage2Ready = false;
            store.startStage2();
          },
          onStartStage3: () => {
            stage3Ready = false;
            store.startStage3();
          },
          onStartStage4: () => {
            stage4Ready = false;
            store.startStage4();
          },
          onStartStage5: () => {
            stage5Ready = false;
            store.startStage5();
          },
          onStartStage6: () => {
            stage6Ready = false;
            store.startStage6();
          },
          onOpenReset: () => {
            resetOpen = true;
            render();
          },
        });
      }

      if (state.view === "stage") bindStage1(root, { store, render });
      if (state.view === "stage2") bindStage2(root, { store, render });
      if (state.view === "stage3") bindStage3(root, { store, render });
      if (state.view === "stage4") bindStage4(root, { store, render });
      if (state.view === "stage5") bindStage5(root, { store, render });
      if (state.view === "stage6") bindStage6(root, { store, render });

      focusMain();
      requestAnimationFrame(notifyResize);
    } catch (err) {
      if (LAB_CONFIG.debug) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
      root.innerHTML = `
        <div class="page card card-pad" role="alert">
          <h1 class="h1" style="font-size:1.35rem;">No se pudo cargar el laboratorio</h1>
          <p>Ocurrió un error inesperado. Puedes reiniciar el progreso e intentar de nuevo.</p>
          <p class="meta-line">No fue posible recuperar tu progreso anterior. Puedes continuar desde el inicio.</p>
          <button type="button" class="btn btn-primary" data-action="recover-lab">Reiniciar y volver al inicio</button>
        </div>
      `;
      root.querySelector('[data-action="recover-lab"]')?.addEventListener("click", () => {
        try {
          store.resetAll();
          store.setView("welcome");
        } catch {
          persistence.remove?.();
          render();
        }
      });
    }
  }

  render();

  const ro =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => notifyResize())
      : null;
  if (ro) ro.observe(root);

  return {
    store,
    destroy() {
      destroyed = true;
      detachXapi();
      ro?.disconnect();
      root.innerHTML = "";
    },
    getCurrentState() {
      return store.getSerializableState();
    },
    getScoreContract() {
      return store.getState().h5pScore;
    },
    rerender: render,
  };
}

function applyStageNameOverrides(stagesParam) {
  if (!Array.isArray(stagesParam)) return;
  stagesParam.forEach((s, i) => {
    const target = STAGES[i];
    if (!target || !s) return;
    if (s.name) target.name = s.name;
    if (s.short) target.short = s.short;
    if (s.description) target.description = s.description;
  });
}
