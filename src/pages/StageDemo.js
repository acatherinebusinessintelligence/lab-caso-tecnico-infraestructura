import { DEMO_STAGE } from "../data/stages.js";
import {
  StageLayout,
  NavigationButtons,
  bindNavigation,
} from "../components/StageLayout.js";
import {
  QuestionCard,
  evaluateSingleChoice,
  bindQuestionCard,
} from "../components/QuestionCard.js";

let local = {
  selectedId: null,
  checked: false,
  feedbackStatus: null,
  feedbackMessage: "",
};

export function resetStageDemoLocal(fromStore) {
  local = {
    selectedId: null,
    checked: Boolean(fromStore?.demoAnswered && fromStore?.demoCorrect),
    feedbackStatus: fromStore?.demoCorrect ? "correct" : null,
    feedbackMessage: fromStore?.demoCorrect ? DEMO_STAGE.question.feedback.correct : "",
  };
}

export function StageDemoPage(state) {
  const qHtml = QuestionCard({
    question: DEMO_STAGE.question,
    selectedId: local.selectedId,
    checked: local.checked,
    feedbackStatus: local.feedbackStatus,
    feedbackMessage: local.feedbackMessage,
  });

  const canContinue = local.checked && local.feedbackStatus === "correct";

  return `
    <section class="page" aria-label="Etapa demostrativa">
      ${StageLayout({
        stageTitle: DEMO_STAGE.title,
        concept: DEMO_STAGE.concept,
        observeNodes: DEMO_STAGE.observeNodes,
        tip: DEMO_STAGE.tip,
        apply: DEMO_STAGE.apply,
        questionSlotHtml: qHtml,
      })}
      ${NavigationButtons({
        canGoPrev: true,
        canGoNext: canContinue,
        prevLabel: "ANTERIOR",
        nextLabel: "CONTINUAR",
      })}
      <p class="meta-line">
        En esta fase, CONTINUAR solo se habilita tras una respuesta correcta a la actividad demostrativa.
      </p>
    </section>
  `;
}

export function bindStageDemo(root, { store, render }) {
  const syncFromStore = () => {
    // keep local selection during interaction
  };

  bindQuestionCard(root, {
    onSelect(id) {
      if (local.checked) return;
      local.selectedId = id;
      render();
    },
    onCheck() {
      const result = evaluateSingleChoice(DEMO_STAGE.question, local.selectedId);
      local.checked = true;
      local.feedbackStatus = result.status;
      local.feedbackMessage = result.message;
      store.markDemoComplete(result.status === "correct");
      render();
    },
    onRetry() {
      local.selectedId = null;
      local.checked = false;
      local.feedbackStatus = null;
      local.feedbackMessage = "";
      store.resetDemoAnswer();
      render();
    },
  });

  bindNavigation(root, {
    onPrev() {
      store.setView("path");
    },
    onNext() {
      if (!(local.checked && local.feedbackStatus === "correct")) return;
      // Fase 1: no hay etapa 2 académica todavía.
      alert(
        "Base validada. Las etapas académicas 1–6 se construirán después de tu aprobación visual."
      );
    },
  });

  syncFromStore();
}
