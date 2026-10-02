# Integración H5P / Moodle

## 1. Arquitectura elegida

**Estrategia A + C:** biblioteca H5P propia (`H5P.InfrastructureCaseLab`) que **monta la aplicación modular existente** (`mountLab`).

| Alternativa | Decisión |
|-------------|---------|
| A. Biblioteca custom | **Elegida** — control total de navegación, score, completion, estado |
| B. Embebido en librería existente | Rechazada — perderíamos control del flujo de 6 etapas |
| C. Wrapper que carga la SPA | **Incluida** — el entry H5P es un wrapper fino sobre `src/app.js` |
| D. Otra | No necesaria |

Motivos: preserva la UX, evita hacks frágiles, permite `getScore` / `getCurrentState` / xAPI, y mantiene UI / pedagogía / estado / tracking separados.

## 2. Estructura del paquete

```
dist/h5p-package/
  h5p.json
  content/
    content.json
  H5P.InfrastructureCaseLab-1.0/
    library.json
    semantics.json
    dist/
      infrastructure-case-lab.js
      infrastructure-case-lab.css
    assets/
```

Paquete ZIP de prueba: `dist/laboratorio-infraestructura-ti-v1.h5p`

## 3. Build

```powershell
cd lab-caso-tecnico
npm install
npm run build:h5p
npm run pack:h5p
```

Desarrollo local (sin Moodle):

```powershell
npm run dev
# http://localhost:5177/
```

## 4. Estado (persistencia)

- `resolvePersistence()` elige adapter.
- **Local:** `LocalStorageAdapter` (clave `lab-infra-caso-tecnico-v7`).
- **H5P:** `H5PStateAdapter` + `getCurrentState()` / `extras.previousState`.
- La UI no escribe en `localStorage` directamente.

## 5. Score

- **Progreso** ≠ **puntuación**.
- Score principal: evaluación final (8 preguntas).
- `practiceWeight` default `0`, `finalAssessmentWeight` default `100`.
- Contrato: `getScore()`, `getMaxScore()`, `h5pScore` en el store.

## 6. Completion

`completed = true` solo si:

1. Las 6 etapas están en `completedStages`.
2. La evaluación final está completa (8 respuestas registradas).
3. Se alcanzó la pantalla final (`labComplete`).

El porcentaje de progreso solo no basta.

## 7. Passed / Failed

- `passed` si `completed` y score% ≥ `passingScorePercent` (default 70).
- `FAILED` puede coexistir con `completed = true`.

## 8. xAPI / tracking

`trackingService` emite eventos internos. En H5P, `xapiBridge` mapea:

| Interno | xAPI (aprox.) |
|---------|----------------|
| LAB_STARTED | initialized |
| ACTIVITY_* | interacted |
| STAGE_COMPLETED | progressed |
| FINAL_ASSESSMENT_COMPLETED | answered |
| LAB_COMPLETED | completed / scored |

Sin PII ni texto del caso del estudiante.

## 9. Semantics

Editable en el editor H5P: `general`, `stages` (nombres), `assessment`, `completion`, `appearance`.

El currículo completo (preguntas/feedback de etapas) permanece embebido en `src/data/*` para no crear un semantics inmanejable. Versiones futuras pueden generar overrides por etapa.

## 10. Pruebas recomendadas en Moodle

1. Subir `laboratorio-infraestructura-ti-v1.h5p` como banco de contenido / actividad H5P.
2. Abrir → bienvenida → iniciar.
3. Completar 2 etapas → salir → reabrir → debe restaurar.
4. Completar 6 etapas **sin** evaluación final → **no** completed.
5. Evaluación 6/8 → score 6/8, passed si umbral 70.
6. Evaluación 4/8 → completed true, passed false (tras finalizar).
7. Reintento con política `best`.

## 11. Limitaciones

- Preguntas académicas aún no son 100 % editables desde semantics (por diseño).
- xAPI depende de que el core H5P/Moodle tenga tracking habilitado.
- Resize usa `trigger('resize')`; validar altura del iframe en el tema Moodle.
- No se sube automáticamente a Moodle en esta fase.

## 12. Instalación de prueba

1. Moodle → plugins H5P / banco de contenido.
2. Subir el `.h5p` generado con `npm run pack:h5p` (ZIP vía Python; no usar Compress-Archive manual).
3. Si Moodle exige librerías firmadas, puede pedir “Trust” / instalación de librería externa (entorno de desarrollo).
4. Crear actividad H5P apuntando al contenido.

Si aparece **invalid-content-folder**: vuelve a generar el paquete con `npm run pack:h5p` y sube el archivo nuevo de `dist/`. No re-zipifiques la carpeta a mano con el Explorador de Windows.
