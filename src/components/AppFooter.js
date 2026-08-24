export function AppFooter({ showReset = false }) {
  return `
    <footer class="app-footer" role="contentinfo">
      <p>
        No busques una respuesta única. Busca una decisión que puedas defender técnicamente.
      </p>
      ${
        showReset
          ? `<p class="app-footer__reset">
               <button type="button" class="btn-link" data-action="open-reset">
                 Reiniciar progreso
               </button>
             </p>`
          : ""
      }
    </footer>
  `;
}

export function bindAppFooter(root, { onOpenReset }) {
  root.querySelector('[data-action="open-reset"]')?.addEventListener("click", onOpenReset);
}
