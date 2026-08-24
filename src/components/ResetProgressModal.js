/**
 * Modal de confirmación para reiniciar progreso (acción secundaria).
 */
export function ResetProgressModal({ open }) {
  if (!open) return "";
  return `
    <div class="reset-modal" role="dialog" aria-modal="true" aria-labelledby="reset-title">
      <div class="reset-modal__backdrop" data-action="reset-cancel"></div>
      <div class="reset-modal__panel card card-pad">
        <h2 class="h2" id="reset-title" style="font-size:1.2rem;">Reiniciar progreso</h2>
        <p>Esta acción eliminará tu progreso guardado en este dispositivo.</p>
        <p class="meta-line">No se envían datos personales. Solo se borra el estado local del laboratorio.</p>
        <div class="btn-row" style="justify-content:flex-end;margin-top:1rem;">
          <button type="button" class="btn btn-secondary" data-action="reset-cancel">CANCELAR</button>
          <button type="button" class="btn btn-primary" data-action="reset-confirm">REINICIAR</button>
        </div>
      </div>
    </div>
  `;
}

export function bindResetProgressModal(root, { onCancel, onConfirm }) {
  root.querySelectorAll('[data-action="reset-cancel"]').forEach((el) => {
    el.addEventListener("click", onCancel);
  });
  root.querySelector('[data-action="reset-confirm"]')?.addEventListener("click", onConfirm);
  const panel = root.querySelector(".reset-modal__panel");
  const confirm = root.querySelector('[data-action="reset-confirm"]');
  if (confirm) {
    requestAnimationFrame(() => confirm.focus());
  } else if (panel) {
    panel.setAttribute("tabindex", "-1");
    requestAnimationFrame(() => panel.focus());
  }
}
