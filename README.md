# Laboratorio de análisis del Caso Técnico

**GESTIÓN DE LA INFRAESTRUCTURA** — guía para analizar (no resolver) el caso técnico.

## GitHub Pages (uso en Moodle sin admin H5P)

Sitio publicado:

**https://acatherinebusinessintelligence.github.io/lab-caso-tecnico-infraestructura/**

Instrucciones para embeber en Moodle: [docs/GITHUB-PAGES.md](docs/GITHUB-PAGES.md)

## Ejecutar en local

```powershell
npm install
npm run dev
```

Abrir: http://localhost:5177/

## Tests

```powershell
npm run test:smoke
```

## Build H5P (requiere admin Moodle para instalar la librería)

```powershell
npm install
npm run build:h5p
npm run pack:h5p
```

Salida: `dist/laboratorio-infraestructura-ti-v1.h5p`

Docs: [docs/H5P-INTEGRATION.md](docs/H5P-INTEGRATION.md)

## Nota pedagógica

El laboratorio enseña **cómo** abordar el caso. **No** resuelve el caso asignado al estudiante.
