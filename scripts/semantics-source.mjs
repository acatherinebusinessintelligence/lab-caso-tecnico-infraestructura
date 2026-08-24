/**
 * semantics.json — configuración editable sin volcar todo el currículo.
 * El contenido pedagógico completo vive embebido en la biblioteca (src/data).
 * Aquí se editan identidad, etapas (nombres), assessment, completion y apariencia.
 */
export const SEMANTICS = [
  {
    name: "general",
    type: "group",
    label: "General",
    importance: "high",
    fields: [
      {
        name: "labName",
        type: "text",
        label: "Título del laboratorio",
        default: "GESTIÓN DE LA INFRAESTRUCTURA",
      },
      {
        name: "labSubtitle",
        type: "text",
        label: "Subtítulo",
        default: "Laboratorio de análisis del Caso Técnico",
      },
      {
        name: "welcomeTitle",
        type: "text",
        label: "Título de bienvenida",
        default: "¿Cómo analizar un caso de infraestructura TI?",
      },
      {
        name: "durationHint",
        type: "text",
        label: "Duración aproximada",
        default: "25 - 35 minutos",
      },
    ],
  },
  {
    name: "stages",
    type: "list",
    label: "Etapas (nombres visibles)",
    entity: "etapa",
    importance: "medium",
    optional: true,
    field: {
      name: "stage",
      type: "group",
      label: "Etapa",
      fields: [
        { name: "name", type: "text", label: "Nombre", default: "COMPRENDER" },
        { name: "short", type: "text", label: "Etiqueta corta", optional: true },
        { name: "description", type: "text", label: "Descripción", optional: true },
      ],
    },
  },
  {
    name: "assessment",
    type: "group",
    label: "Evaluación y puntuación",
    importance: "high",
    fields: [
      {
        name: "practiceWeight",
        type: "number",
        label: "Peso de práctica (%)",
        default: 0,
        min: 0,
        max: 100,
      },
      {
        name: "finalAssessmentWeight",
        type: "number",
        label: "Peso evaluación final (%)",
        default: 100,
        min: 0,
        max: 100,
      },
      {
        name: "passingScorePercent",
        type: "number",
        label: "Umbral de aprobación (%)",
        description: "Separado de completion. Completado ≠ aprobado.",
        default: 70,
        min: 0,
        max: 100,
      },
      {
        name: "allowFinalAssessmentRetry",
        type: "boolean",
        label: "Permitir reintento de evaluación final",
        default: true,
      },
      {
        name: "scorePolicy",
        type: "select",
        label: "Política de score en reintentos",
        default: "best",
        options: [
          { value: "best", label: "Mejor resultado (best)" },
          { value: "latest", label: "Último intento (latest)" },
          { value: "first", label: "Primer intento (first)" },
        ],
      },
    ],
  },
  {
    name: "completion",
    type: "group",
    label: "Mensajes de cierre",
    fields: [
      {
        name: "closingTitle",
        type: "text",
        label: "Título final",
        default: "ESTÁS LISTO PARA ANALIZAR TU CASO",
      },
      {
        name: "closingMessage",
        type: "text",
        widget: "textarea",
        label: "Mensaje central",
        default:
          "No necesitas encontrar una respuesta única. Necesitas construir una decisión que puedas defender técnicamente.",
      },
    ],
  },
  {
    name: "appearance",
    type: "group",
    label: "Apariencia",
    fields: [
      {
        name: "debugMode",
        type: "boolean",
        label: "Modo debug (logs técnicos)",
        default: false,
      },
      {
        name: "showDesignReference",
        type: "boolean",
        label: "Mostrar imagen de referencia de diseño",
        description: "Solo para desarrollo. No recomendado en producción.",
        default: false,
      },
    ],
  },
];
