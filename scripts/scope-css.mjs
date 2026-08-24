/**
 * Prefija selectores CSS bajo .h5p-infrastructure-case-lab
 * para no contaminar Moodle.
 */
export function scopeCss(css, scope = ".h5p-infrastructure-case-lab") {
  // Quitar estilos globales peligrosos de html/body/#app
  let out = css
    .replace(/html\s*,\s*body\s*\{[^}]*\}/gs, "")
    .replace(/html\s*\{[^}]*\}/gs, "")
    .replace(/body\s*\{[^}]*\}/gs, "")
    .replace(/#app\s*\{[^}]*\}/gs, `${scope}{min-height:100%;display:flex;flex-direction:column;}`);

  // :root → scope
  out = out.replace(/:root\s*\{/g, `${scope}{`);

  // Prefijar reglas simples (heurística suficiente para este proyecto)
  const lines = out.split("\n");
  const result = [];
  let inAt = 0;
  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("@keyframes") || trimmed.startsWith("@font-face")) {
      result.push(line);
      if (trimmed.includes("{")) inAt += 1;
      continue;
    }
    if (trimmed.startsWith("@media") || trimmed.startsWith("@supports")) {
      result.push(line);
      continue;
    }
    if (trimmed === "}") {
      result.push(line);
      if (inAt > 0) inAt -= 1;
      continue;
    }
    // selector line ending with {
    if (/[^@][^{]+\{\s*$/.test(trimmed) || (/^[.#\w\[\*:-].*\{\s*$/.test(trimmed) && !trimmed.startsWith("@"))) {
      const open = line.indexOf("{");
      const selectors = line.slice(0, open).split(",").map((s) => s.trim()).filter(Boolean);
      const scoped = selectors
        .map((sel) => {
          if (sel.startsWith(scope)) return sel;
          if (sel === "*" || sel.startsWith("* ")) return `${scope} ${sel}`;
          return `${scope} ${sel}`;
        })
        .join(", ");
      result.push(`${scoped} ${line.slice(open)}`);
      continue;
    }
    result.push(line);
  }
  return `/* Scoped for H5P — do not edit by hand */\n${scope}{font-family:system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;color:#1c2b3a;line-height:1.5;background:#f3f8fc;box-sizing:border-box;}\n${scope} *,${scope} *::before,${scope} *::after{box-sizing:border-box;}\n${result.join("\n")}`;
}
