import { mountLab } from "../app.js";
import { LAB_CONFIG } from "../config/labConfig.js";
import { H5P_LIBRARY } from "../config/h5pMeta.js";

/**
 * Factory del content type H5P.InfrastructureCaseLab
 * @param {typeof globalThis.H5P} H5P
 */
export function createInfrastructureCaseLab(H5P) {
  const $ = H5P.jQuery;

  function InfrastructureCaseLab(params, contentId, extras) {
    const self = this;
    H5P.EventDispatcher.call(self);

    self.contentId = contentId;
    self.params = H5P.jQuery.extend(true, {}, defaultParams(), params || {});
    self.extras = extras || {};
    self.$wrapper = null;
    self.lab = null;

    /**
     * @param {jQuery} $container
     */
    self.attach = function ($container) {
      $container.addClass("h5p-infrastructure-case-lab");
      if (!self.$wrapper) {
        self.$wrapper = $("<div/>", {
          class: "icl-h5p-host",
          css: { width: "100%", minHeight: "320px" },
        });
        const host = self.$wrapper.get(0);
        try {
          self.lab = mountLab(host, {
            preferH5P: true,
            previousState: self.extras.previousState || null,
            params: self.params,
            h5pInstance: self,
            onResize() {
              self.trigger("resize");
            },
            onStateChange() {
              /* H5P polling getCurrentState */
            },
          });
        } catch (err) {
          host.innerHTML = `
            <div class="card card-pad" role="alert" style="padding:1rem;">
              <p><strong>No fue posible iniciar el laboratorio.</strong></p>
              <p>Intenta recargar la actividad. Si el problema continúa, contacta al administrador.</p>
            </div>`;
          if (LAB_CONFIG.debug) {
            // eslint-disable-next-line no-console
            console.error(err);
          }
        }
      }
      $container.html("").append(self.$wrapper);
      self.trigger("resize");
    };

    self.getScore = function () {
      return self.lab?.getScoreContract()?.score ?? 0;
    };

    self.getMaxScore = function () {
      return (
        self.lab?.getScoreContract()?.maxScore ??
        LAB_CONFIG.assessment.finalQuestionCount
      );
    };

    self.getAnswerGiven = function () {
      const c = self.lab?.getScoreContract();
      return Boolean(c && (c.completed || c.resultStatus !== "NOT_STARTED"));
    };

    self.showSolutions = function () {
      /* El laboratorio no revela soluciones del caso asignado. */
    };

    self.resetTask = function () {
      if (self.lab?.store) {
        self.lab.store.resetAll();
        self.lab.store.setView("welcome");
      }
    };

    self.getCurrentState = function () {
      return self.lab?.getCurrentState() || {};
    };

    self.getXAPIData = function () {
      const contract = self.lab?.getScoreContract() || {
        score: 0,
        maxScore: LAB_CONFIG.assessment.finalQuestionCount,
        completed: false,
        passed: false,
      };
      const xAPIEvent = self.createXAPIEventTemplate("answered");
      const statement = xAPIEvent.data.statement;
      statement.result = {
        score: {
          min: 0,
          max: contract.maxScore,
          raw: contract.score,
          scaled:
            contract.maxScore > 0 ? contract.score / contract.maxScore : 0,
        },
        completion: Boolean(contract.completed),
        success: Boolean(contract.passed),
      };
      if (statement.object?.definition) {
        statement.object.definition.interactionType = "other";
        statement.object.definition.name = {
          "es-ES":
            self.params.general?.labSubtitle || H5P_LIBRARY.visibleTitle,
          en: H5P_LIBRARY.title,
        };
      }
      return { statement };
    };
  }

  InfrastructureCaseLab.prototype = Object.create(H5P.EventDispatcher.prototype);
  InfrastructureCaseLab.prototype.constructor = InfrastructureCaseLab;

  return InfrastructureCaseLab;
}

function defaultParams() {
  return {
    general: {
      labName: LAB_CONFIG.labName,
      labSubtitle: LAB_CONFIG.labSubtitle,
      welcomeTitle: LAB_CONFIG.welcomeTitle,
      durationHint: LAB_CONFIG.durationHint,
    },
    assessment: {
      practiceWeight: LAB_CONFIG.assessment.practiceWeight,
      finalAssessmentWeight: LAB_CONFIG.assessment.finalAssessmentWeight,
      passingScorePercent: LAB_CONFIG.assessment.passingScorePercent,
      allowFinalAssessmentRetry: LAB_CONFIG.assessment.allowFinalAssessmentRetry,
      scorePolicy: LAB_CONFIG.assessment.scorePolicy,
    },
    completion: {
      closingTitle: LAB_CONFIG.completion.closingTitle,
      closingMessage: LAB_CONFIG.completion.closingMessage,
    },
    appearance: {
      debugMode: false,
      showDesignReference: false,
    },
  };
}
