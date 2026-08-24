/** Contenido académico — solo Etapa 1: COMPRENDER */

export const STAGE1_STEPS = [
  {
    id: "s1-before-tech",
    title: "Antes de mirar la tecnología",
    gate: "q1",
  },
  {
    id: "s1-business",
    title: "¿Qué protege realmente TI?",
    gate: null,
  },
  {
    id: "s1-service",
    title: "No confundas un servicio con un componente",
    gate: "classify",
  },
  {
    id: "s1-criticality",
    title: "¿Qué hace crítico a un servicio?",
    gate: "q2",
  },
  {
    id: "s1-apply",
    title: "Restricciones y aplica a tu caso",
    gate: "q3",
  },
];

export const STAGE1_Q1 = {
  id: "s1-q1",
  prompt:
    "Una clínica reporta lentitud en su infraestructura. ¿Cuál debería ser la primera pregunta del equipo consultor?",
  options: [
    { id: "a", key: "A", label: "¿Qué servidor deberíamos comprar?" },
    {
      id: "b",
      key: "B",
      label: "¿Qué servicios clínicos están siendo afectados y qué impacto tiene la lentitud?",
    },
    { id: "c", key: "C", label: "¿Qué proveedor cloud tiene menor precio?" },
    { id: "d", key: "D", label: "¿Cuál es la marca del firewall?" },
  ],
  correctId: "b",
  feedback: {
    correct:
      "Correcto. Antes de elegir una solución debes identificar qué servicio está siendo afectado y cuál es el impacto sobre la operación.",
    incorrect:
      "Estás comenzando por la tecnología. Primero necesitas comprender qué servicio del negocio está afectado.",
  },
};

export const STAGE1_Q2 = {
  id: "s1-q2",
  prompt:
    "Durante el periodo de matrícula, ¿cuál debería analizarse como especialmente crítico?",
  options: [
    { id: "a", key: "A", label: "Portal institucional." },
    { id: "b", key: "B", label: "Sistema de matrículas." },
    {
      id: "c",
      key: "C",
      label: "Todos tienen exactamente la misma criticidad porque operan 24/7.",
    },
    { id: "d", key: "D", label: "No se puede analizar criticidad." },
  ],
  correctId: "b",
  feedback: {
    correct:
      "Correcto. La criticidad depende del impacto sobre el proceso de negocio y puede cambiar según el contexto.",
    incorrect:
      "Revisa el impacto sobre el proceso principal. La disponibilidad 24/7 no es el único criterio de criticidad.",
  },
};

export const STAGE1_Q3 = {
  id: "s1-q3",
  prompt: "¿Cuál de estas conclusiones es más adecuada en esta etapa?",
  options: [
    { id: "a", key: "A", label: "Comprar inmediatamente un servidor nuevo." },
    { id: "b", key: "B", label: "Migrar todo a cloud." },
    {
      id: "c",
      key: "C",
      label:
        "Registrar el servicio como crítico, documentar la evidencia y continuar el análisis antes de definir una solución.",
    },
    {
      id: "d",
      key: "D",
      label: "Ignorar el problema porque el servidor todavía funciona.",
    },
  ],
  correctId: "c",
  feedback: {
    correct:
      "Correcto. En esta etapa estás construyendo contexto y evidencia, todavía no seleccionando una solución.",
    incorrect:
      "La respuesta salta directamente a una solución. Todavía debes completar el diagnóstico.",
  },
};

export const STAGE1_CLASSIFY_ITEMS = [
  { id: "moodle", label: "Moodle", bucket: "servicio" },
  { id: "firewall", label: "Firewall", bucket: "componente" },
  { id: "pagos", label: "Motor de pagos", bucket: "servicio" },
  { id: "bd", label: "Base de datos", bucket: "componente" },
  { id: "hce", label: "Historia Clínica Electrónica", bucket: "servicio" },
  { id: "switch", label: "Switch", bucket: "componente" },
  { id: "portal", label: "Portal ciudadano", bucket: "servicio" },
  { id: "appsrv", label: "Servidor de aplicaciones", bucket: "componente" },
];

export const STAGE1_APPLY_CHECKS = [
  { id: "org", label: "Comprendí qué hace la organización." },
  { id: "users", label: "Identifiqué los usuarios." },
  { id: "services", label: "Identifiqué los servicios principales." },
  { id: "critical", label: "Prioricé el servicio crítico." },
  { id: "constraints", label: "Identifiqué restricciones." },
];
