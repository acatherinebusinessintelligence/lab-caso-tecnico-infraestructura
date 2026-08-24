import { STAGES } from "../data/stages.js";

export function StageMap() {
  return `
    <div class="route-map card card-pad" role="list" aria-label="Mapa de las seis etapas">
      <div class="route-map__track">
        ${STAGES.map(
          (s, i) => `
          <div class="route-map__item" role="listitem">
            <div class="route-map__node" aria-hidden="true">${s.id}</div>
            <h3 class="route-map__name">${s.name}</h3>
            <p class="route-map__desc">${s.short}</p>
            ${i < STAGES.length - 1 ? '<span class="route-map__connector" aria-hidden="true"></span>' : ""}
          </div>
        `
        ).join("")}
      </div>
    </div>
  `;
}
