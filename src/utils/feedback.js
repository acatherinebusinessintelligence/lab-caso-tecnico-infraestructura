/**
 * Feedback con progresión de pistas (sin revelar la letra correcta).
 * Intento 1: conceptual | Intento 2: pista | Intento 3+: orientación a revisar la sección.
 */

export function resolveAttemptFeedback(question, status, attempt = 1) {
  const fb = question?.feedback || {};
  if (status === "correct") {
    return fb.correct || "Correcto. Tu razonamiento se sostiene con la evidencia.";
  }
  if (status === "partial" || status === "adequate") {
    return (
      fb.partial ||
      "Vas en la dirección correcta, pero todavía falta relacionar evidencia, impacto o contexto."
    );
  }
  // incorrect / unsupported
  const base =
    fb.incorrect ||
    "Revisa el concepto de esta sección. Evita saltar de la métrica a una solución.";
  if (attempt <= 1) return base;
  if (attempt === 2) {
    return (
      (fb.hint2 ||
        "Pista adicional: identifica qué pregunta responde cada opción (problema, evidencia, impacto o solución prematura).") +
      " " +
      base
    );
  }
  return (
    (fb.full ||
      "Explicación: vuelve a la sección conceptual, descarta opciones que anticipan tecnología o soluciones sin evidencia, y elige la que cierra el razonamiento.") +
    " " +
    base
  );
}
