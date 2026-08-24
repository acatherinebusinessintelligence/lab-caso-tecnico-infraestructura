/** Utilidades numéricas para ejercicios de cálculo. */

export function parseLocaleNumber(input) {
  if (input == null) return NaN;
  let s = String(input).trim().replace(/\s+/g, "");
  if (!s) return NaN;
  // 97,81 o 97.81; también 1.234,56 → 1234.56
  if (s.includes(",") && s.includes(".")) {
    if (s.lastIndexOf(",") > s.lastIndexOf(".")) {
      s = s.replace(/\./g, "").replace(",", ".");
    } else {
      s = s.replace(/,/g, "");
    }
  } else if (s.includes(",")) {
    s = s.replace(",", ".");
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

export function nearlyEqual(value, expected, tolerance = 0.05) {
  if (!Number.isFinite(value) || !Number.isFinite(expected)) return false;
  return Math.abs(value - expected) <= tolerance;
}

/**
 * Valida entrada numérica de estudiante (coma/punto, vacíos, NaN, rango).
 * @returns {{ ok: boolean, value: number, message?: string }}
 */
export function validateNumericInput(raw, { min = -Infinity, max = Infinity, allowEmpty = false } = {}) {
  if (raw == null || String(raw).trim() === "") {
    return {
      ok: false,
      value: NaN,
      message: allowEmpty ? "" : "Ingresa un valor numérico. Puedes usar coma o punto decimal (ej. 97,81).",
    };
  }
  const value = parseLocaleNumber(raw);
  if (!Number.isFinite(value)) {
    return {
      ok: false,
      value: NaN,
      message: "El valor no es numérico válido. Revisa signos, letras o símbolos.",
    };
  }
  if (value < min || value > max) {
    return {
      ok: false,
      value,
      message: `El valor está fuera del rango esperado (${min} a ${max}).`,
    };
  }
  return { ok: true, value };
}

export function formatPercent(n, digits = 2) {
  return `${n.toFixed(digits).replace(".", ",")}%`;
}
