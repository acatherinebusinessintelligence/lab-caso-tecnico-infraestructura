/**
 * Empaqueta dist/h5p-package como .h5p con ZIP compatible PHP/Moodle.
 * Evita Compress-Archive (Windows), que suele provocar invalid-content-folder.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";
import { H5P_LIBRARY } from "../src/config/h5pMeta.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pkgDir = path.join(root, "dist", "h5p-package");
const outName = "laboratorio-infraestructura-ti-v1.h5p";
const outPath = path.join(root, "dist", outName);

if (!fs.existsSync(path.join(pkgDir, "h5p.json"))) {
  console.error("Falta dist/h5p-package/h5p.json. Ejecuta npm run build:h5p primero.");
  process.exit(1);
}

const libFolder = `${H5P_LIBRARY.machineName}-${H5P_LIBRARY.majorVersion}.${H5P_LIBRARY.minorVersion}`;
const required = [
  "h5p.json",
  "content/content.json",
  `${libFolder}/library.json`,
  `${libFolder}/semantics.json`,
  `${libFolder}/dist/infrastructure-case-lab.js`,
  `${libFolder}/dist/infrastructure-case-lab.css`,
];
for (const rel of required) {
  if (!fs.existsSync(path.join(pkgDir, rel))) {
    console.error("Falta archivo requerido:", rel);
    process.exit(1);
  }
}

for (const rel of [
  "h5p.json",
  "content/content.json",
  `${libFolder}/library.json`,
  `${libFolder}/semantics.json`,
]) {
  JSON.parse(fs.readFileSync(path.join(pkgDir, rel), "utf8"));
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
if (fs.existsSync(outPath)) fs.unlinkSync(outPath);

const py = `
import json, zipfile
from pathlib import Path

pkg = Path(r"""${pkgDir.replace(/\\/g, "/")}""")
out = Path(r"""${outPath.replace(/\\/g, "/")}""")

# Reescribir JSON como UTF-8 estricto (sin BOM)
for rel in ["h5p.json", "content/content.json", "${libFolder}/library.json", "${libFolder}/semantics.json"]:
    p = pkg / rel
    data = json.loads(p.read_text(encoding="utf-8"))
    p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\\n", encoding="utf-8")

skip_names = {".DS_Store", "Thumbs.db"}
with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
    # No añadir entrada "content/" vacía: Moodle la trata como archivo sin extensión
    # y falla con not-in-whitelist. Basta con content/content.json.
    for path in sorted(pkg.rglob("*")):
        if not path.is_file():
            continue
        if path.name in skip_names:
            continue
        arc = path.relative_to(pkg).as_posix()
        zf.write(path, arcname=arc)

# Verificación
with zipfile.ZipFile(out, "r") as zf:
    names = zf.namelist()
    assert "h5p.json" in names, names
    assert "content/content.json" in names, names
    assert "content/" not in names, "no debe haber entrada de directorio content/"
    json.loads(zf.read("content/content.json"))
    json.loads(zf.read("h5p.json"))
print(out)
print("entries:", len(names))
print("namelist:", names)
`;

const r = spawnSync("python", ["-c", py], { encoding: "utf8" });
if (r.status !== 0) {
  console.error(r.stderr || r.stdout);
  process.exit(1);
}
console.log(r.stdout.trim());
console.log("BUILD DE PRUEBA →", outPath);
console.log("ZIP compatible Moodle (content/ + h5p.json en raíz).");
