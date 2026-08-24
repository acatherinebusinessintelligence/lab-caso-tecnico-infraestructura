/** Contenido académico — Etapa 2: REPRESENTAR */

export const STAGE2_STEPS = [
  { id: "s2-asis", title: "¿Qué significa AS-IS?", gate: "qAsis" },
  { id: "s2-chain", title: "De servicio a infraestructura", gate: "order" },
  { id: "s2-include", title: "No dibujes por dibujar", gate: "qInclude" },
  { id: "s2-deps", title: "Una dependencia puede convertirse en riesgo", gate: null },
  { id: "s2-spof", title: "Identificar Single Points of Failure", gate: "spofBlock" },
  { id: "s2-apply", title: "Aplica a tu caso", gate: null },
];

export const STAGE2_Q_ASIS = {
  id: "s2-q-asis",
  prompt:
    "Si el caso indica que existe un solo firewall y el estudiante considera que debería existir un segundo firewall, ¿qué debe dibujar en el AS-IS?",
  options: [
    { id: "a", key: "A", label: "Dos firewalls porque sería la arquitectura correcta." },
    { id: "b", key: "B", label: "Solo el firewall que actualmente existe." },
    { id: "c", key: "C", label: "Ningún firewall hasta definir el TO-BE." },
    { id: "d", key: "D", label: "Dos firewalls, pero uno con línea punteada." },
  ],
  correctId: "b",
  feedback: {
    correct:
      "Correcto. El AS-IS representa el estado actual, incluso cuando ese estado tiene debilidades.",
    incorrect:
      "Estás incorporando una mejora antes de terminar el diagnóstico. Primero representa exactamente lo que existe.",
  },
};

export const STAGE2_Q_INCLUDE = {
  id: "s2-q-include",
  prompt: "¿Cuál elemento probablemente NO necesita aparecer en el AS-IS del servicio de pagos?",
  options: [
    { id: "a", key: "A", label: "Firewall." },
    { id: "b", key: "B", label: "Base de datos." },
    { id: "c", key: "C", label: "Proveedor de pagos." },
    { id: "d", key: "D", label: "Impresora administrativa." },
  ],
  correctId: "d",
  feedback: {
    correct: "Correcto. El AS-IS debe concentrarse en componentes relevantes para el servicio analizado.",
    incorrect:
      "Revisa la relevancia. Incluye lo que el servicio de pagos necesita; omite elementos administrativos ajenos al flujo.",
  },
};

export const STAGE2_Q_SPOF1 = {
  id: "s2-q-spof1",
  prompt: "¿Cuál tiene mayor evidencia de SPOF?",
  options: [
    { id: "a", key: "A", label: "APP-SRV01." },
    { id: "b", key: "B", label: "APP-SRV02." },
    { id: "c", key: "C", label: "AUTH-SRV01." },
    { id: "d", key: "D", label: "Ambos APP individualmente." },
  ],
  correctId: "c",
  feedback: {
    correct:
      "Correcto. La autenticación depende de una única instancia. La falla puede impedir nuevos accesos al servicio.",
    incorrect:
      "Revisa dónde existe realmente una alternativa funcional. APP-SRV01 y APP-SRV02 comparten la carga.",
  },
};

export const STAGE2_Q_SPOF2 = {
  id: "s2-q-spof2",
  prompt: "¿Debe clasificarse automáticamente como SPOF crítico?",
  options: [
    { id: "a", key: "A", label: "Sí, porque solo existe uno." },
    {
      id: "b",
      key: "B",
      label: "No necesariamente; debe analizarse el impacto sobre el servicio.",
    },
    { id: "c", key: "C", label: "Sí, porque todo servidor único es SPOF." },
    { id: "d", key: "D", label: "Sí, porque es infraestructura." },
  ],
  correctId: "b",
  feedback: {
    correct: "Correcto. Ser único no basta. Debes demostrar el impacto sobre el servicio.",
    incorrect:
      "Revisa la definición: único ≠ SPOF automáticamente. Primero analiza dependencia e impacto.",
  },
};

export const STAGE2_Q_EXTERNAL = {
  id: "s2-q-ext",
  prompt:
    "Una fintech tiene servidores redundantes, pero utiliza un único proveedor de autenticación externo. ¿Puede existir una dependencia crítica aunque los servidores propios tengan redundancia?",
  options: [
    { id: "a", key: "A", label: "Sí." },
    { id: "b", key: "B", label: "No." },
  ],
  correctId: "a",
  feedback: {
    correct:
      "Correcto. La disponibilidad real del servicio depende también de componentes externos.",
    incorrect:
      "La redundancia interna no elimina dependencias externas críticas. Revisa el proveedor único de autenticación.",
  },
};

export const STAGE2_ORDER_ITEMS = [
  { id: "users", label: "Usuarios" },
  { id: "inet", label: "Internet" },
  { id: "fw", label: "Firewall" },
  { id: "app", label: "Aplicación" },
  { id: "db", label: "Base de datos" },
];

export const STAGE2_ORDER_CORRECT = ["users", "inet", "fw", "app", "db"];

export const STAGE2_SPOF_NODES = [
  { id: "users", label: "Usuarios", role: "ignore" },
  { id: "inet", label: "Internet", role: "optional" },
  { id: "firewall", label: "Firewall", role: "must" },
  { id: "lb", label: "Balanceador", role: "optional" },
  { id: "app01", label: "APP01", role: "avoid" },
  { id: "app02", label: "APP02", role: "avoid" },
  { id: "db01", label: "DB01", role: "must" },
  { id: "nas", label: "NAS", role: "optional" },
  { id: "backup", label: "Backup", role: "optional" },
];

export const STAGE2_APPLY_CHECKS = [
  { id: "asis-only", label: "Dibujé únicamente el estado actual." },
  { id: "users", label: "Incluí usuarios." },
  { id: "conn", label: "Incluí conectividad." },
  { id: "sec", label: "Incluí seguridad." },
  { id: "apps", label: "Incluí aplicaciones." },
  { id: "data", label: "Incluí datos." },
  { id: "storage", label: "Incluí almacenamiento." },
  { id: "backup", label: "Incluí backup." },
  { id: "ext", label: "Incluí proveedores o sedes cuando aplica." },
  { id: "spof", label: "Justifiqué posibles SPOF." },
];
