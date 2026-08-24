# Publicación en GitHub Pages (sin admin de Moodle)

## URL del laboratorio

Tras activar Pages:

`https://acatherinebusinessintelligence.github.io/lab-caso-tecnico-infraestructura/`

(Confirma la URL exacta en el repo → Settings → Pages.)

## Cómo usarlo en Moodle (docente, sin H5P custom)

### Opción A — Recurso URL
1. Añadir actividad → **URL**
2. Pegar la URL de GitHub Pages
3. Abrir en ventana nueva o embeber si el tema lo permite

### Opción B — Página con iframe
1. Añadir actividad → **Página**
2. En HTML (modo código), pegar:

```html
<iframe
  src="https://acatherinebusinessintelligence.github.io/lab-caso-tecnico-infraestructura/"
  title="Laboratorio Gestión de la Infraestructura"
  width="100%"
  height="900"
  style="border:0;min-height:80vh;"
  allowfullscreen
  loading="lazy"
></iframe>
```

### Limitaciones de este modo
- **No** usa la librería H5P custom (no hace falta admin).
- El progreso se guarda en el **navegador del estudiante** (`localStorage`), no en Moodle.
- Moodle **no** recibe score/completion automático de H5P.
- Si más adelante un admin instala `H5P.InfrastructureCaseLab`, se puede migrar al `.h5p`.

## Actualizar el sitio

```powershell
cd lab-caso-tecnico
git add -A
git commit -m "Actualiza laboratorio"
git push
```

GitHub Pages se actualiza en 1–2 minutos.
