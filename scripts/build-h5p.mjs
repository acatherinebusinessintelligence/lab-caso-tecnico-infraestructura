import * as esbuild from "esbuild";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { scopeCss } from "./scope-css.mjs";
import { SEMANTICS } from "./semantics-source.mjs";
import { H5P_LIBRARY } from "../src/config/h5pMeta.js";
import { LAB_CONFIG } from "../src/config/labConfig.js";
import { STAGES } from "../src/data/stages.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const libFolder = `${H5P_LIBRARY.machineName}-${H5P_LIBRARY.majorVersion}.${H5P_LIBRARY.minorVersion}`;
const outLib = path.join(root, "dist", "h5p-package", libFolder);
const outContent = path.join(root, "dist", "h5p-package", "content");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

async function bundleJs() {
  ensureDir(path.join(outLib, "dist"));
  await esbuild.build({
    entryPoints: [path.join(root, "src/h5p/entry.js")],
    bundle: true,
    outfile: path.join(outLib, "dist", "infrastructure-case-lab.js"),
    format: "iife",
    platform: "browser",
    target: ["es2018"],
    minify: false,
    legalComments: "none",
    // H5P y jQuery los aporta el core
    external: [],
    define: {
      "process.env.NODE_ENV": '"production"',
    },
  });
}

function bundleCss() {
  const files = ["tokens.css", "layout.css", "components.css"].map((f) =>
    fs.readFileSync(path.join(root, "src/styles", f), "utf8")
  );
  const scoped = scopeCss(files.join("\n\n"));
  fs.writeFileSync(path.join(outLib, "dist", "infrastructure-case-lab.css"), scoped, "utf8");
}

function writeLibraryJson() {
  writeJson(path.join(outLib, "library.json"), {
    title: H5P_LIBRARY.title,
    description:
      "Laboratorio guiado de análisis de infraestructura TI (método, no resolución del caso).",
    majorVersion: H5P_LIBRARY.majorVersion,
    minorVersion: H5P_LIBRARY.minorVersion,
    patchVersion: H5P_LIBRARY.patchVersion,
    runnable: 1,
    fullscreen: 0,
    embedTypes: ["iframe"],
    author: "UNIMINUTO / Laboratorio Gestión de la Infraestructura",
    license: "U",
    machineName: H5P_LIBRARY.machineName,
    coreApi: {
      majorVersion: 1,
      minorVersion: 27,
    },
    preloadedJs: [{ path: "dist/infrastructure-case-lab.js" }],
    preloadedCss: [{ path: "dist/infrastructure-case-lab.css" }],
  });
}

function writeSemantics() {
  writeJson(path.join(outLib, "semantics.json"), SEMANTICS);
}

function writeContentAndH5pJson() {
  ensureDir(outContent);
  const content = {
    general: {
      labName: LAB_CONFIG.labName,
      labSubtitle: LAB_CONFIG.labSubtitle,
      welcomeTitle: LAB_CONFIG.welcomeTitle,
      durationHint: LAB_CONFIG.durationHint,
    },
    stages: STAGES.map((s) => ({
      name: s.name,
      short: s.short,
      description: s.description,
    })),
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
  writeJson(path.join(outContent, "content.json"), content);

  writeJson(path.join(root, "dist", "h5p-package", "h5p.json"), {
    title: H5P_LIBRARY.visibleTitle,
    language: "es",
    mainLibrary: H5P_LIBRARY.machineName,
    embedTypes: ["div", "iframe"],
    license: "U",
    authors: [
      {
        name: "UNIMINUTO",
        role: "Author",
      },
    ],
    preloadedDependencies: [
      {
        machineName: H5P_LIBRARY.machineName,
        majorVersion: H5P_LIBRARY.majorVersion,
        minorVersion: H5P_LIBRARY.minorVersion,
      },
    ],
  });
}

function copyAssets() {
  const assetsOut = path.join(outLib, "assets");
  ensureDir(assetsOut);
  // Placeholder readme — imagen de diseño NO se incluye para el estudiante
  fs.writeFileSync(
    path.join(assetsOut, "README.txt"),
    "Assets de la biblioteca. La imagen de referencia de diseño no se empaqueta para el estudiante.\n",
    "utf8"
  );
}

console.log("Building H5P library…");
ensureDir(outLib);
await bundleJs();
bundleCss();
writeLibraryJson();
writeSemantics();
writeContentAndH5pJson();
copyAssets();
console.log(`OK → dist/h5p-package/ (${libFolder})`);
