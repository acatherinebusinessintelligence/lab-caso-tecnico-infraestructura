/** Datos base de las 6 etapas (contenido académico completo: fase posterior). */
export const LOGIC_CHAIN = ["PROBLEMA", "EVIDENCIA", "IMPACTO", "DECISIÓN", "MÉTRICA"];

export const STAGES = [
  {
    id: 1,
    key: "comprender",
    name: "COMPRENDER",
    short: "el negocio",
    description: "El negocio y los servicios críticos.",
    icon: "1",
  },
  {
    id: 2,
    key: "representar",
    name: "REPRESENTAR",
    short: "el AS-IS",
    description: "Arquitectura AS-IS, dependencias y SPOF.",
    icon: "2",
  },
  {
    id: 3,
    key: "medir",
    name: "MEDIR",
    short: "la infraestructura",
    description: "Disponibilidad, MTTR, MTBF, capacidad y rendimiento.",
    icon: "3",
  },
  {
    id: 4,
    key: "diagnosticar",
    name: "DIAGNOSTICAR",
    short: "con evidencia",
    description: "Hallazgos, evidencia, impacto y criticidad.",
    icon: "4",
  },
  {
    id: 5,
    key: "gobernar",
    name: "GOBERNAR",
    short: "ITIL · COBIT · ISO",
    description: "ITIL, COBIT e ISO 27001.",
    icon: "5",
  },
  {
    id: 6,
    key: "decidir",
    name: "DECIDIR",
    short: "y sustentar",
    description: "Decisiones tecnológicas sustentadas, CAPEX/OPEX y métricas.",
    icon: "6",
  },
];

/** Contenido demostrativo mínimo para validar StageLayout + pregunta. */
export const DEMO_STAGE = {
  stageId: 1,
  title: "Plantilla de etapa (demostración)",
  concept:
    "AS-IS representa cómo funciona actualmente la infraestructura. No incluye mejoras futuras ni componentes propuestos.",
  observeNodes: ["Usuarios", "Internet", "Firewall", "Aplicación", "Base de datos"],
  tip: "No confundas un componente tecnológico con un servicio de negocio.",
  apply:
    "Identifica el servicio más crítico, la aplicación que lo soporta, la base de datos que utiliza y la conectividad de la que depende.",
  question: {
    id: "demo-q1",
    prompt:
      "Si el caso tiene un solo firewall y el estudiante propone agregar un segundo firewall, ¿debe aparecer el segundo firewall en el AS-IS?",
    options: [
      { id: "a", key: "A", label: "Sí, porque mejora la seguridad." },
      { id: "b", key: "B", label: "Sí, porque siempre debemos proponer mejoras." },
      { id: "c", key: "C", label: "No, el AS-IS representa la situación actual." },
      { id: "d", key: "D", label: "Solo si el caso lo menciona explícitamente." },
    ],
    correctId: "c",
    feedback: {
      correct:
        "Tu respuesta utiliza la información del caso y mantiene la lógica de diagnóstico. El AS-IS describe lo que existe hoy.",
      partial:
        "Vas en la dirección correcta, pero falta relacionar la evidencia con el impacto o la decisión.",
      incorrect:
        "Revisa nuevamente. La respuesta propone una solución sin demostrar primero el problema o la evidencia. El AS-IS no incluye mejoras futuras.",
    },
  },
};
