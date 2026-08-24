export function ConsultantTip({ text }) {
  return `
    <aside class="consultant-tip" aria-label="Consejo del consultor">
      <div class="consultant-tip__avatar" aria-hidden="true">
        <span class="consultant-tip__avatar-inner">C</span>
      </div>
      <div>
        <p class="consultant-tip__title">Consejo del consultor</p>
        <p class="consultant-tip__text">${text}</p>
      </div>
    </aside>
  `;
}
