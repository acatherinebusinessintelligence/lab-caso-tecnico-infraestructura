/** Contenido académico — Etapa 4: DIAGNOSTICAR */

export const STAGE4_STEPS = [
  { id: "s4-hallazgo", title: "De métricas a diagnóstico", gate: "classify" },
  { id: "s4-evidencia", title: "De dato a evidencia", gate: "evidence" },
  { id: "s4-estructura", title: "Cómo construir un hallazgo", gate: "structBlock" },
  { id: "s4-impacto", title: "Impacto", gate: "qImpact" },
  { id: "s4-criticidad", title: "Criticidad y categorías", gate: "critBlock" },
  { id: "s4-falta", title: "Cuando falta evidencia", gate: "qInsufficient" },
  { id: "s4-matriz", title: "Matriz y constructor", gate: "builderBlock" },
  { id: "s4-apply", title: "Aplica a tu caso", gate: "checkpoint" },
];

export const STAGE4_CLASSIFY_CATS = [
  { id: "dato", label: "DATO" },
  { id: "hallazgo", label: "HALLAZGO" },
];

export const STAGE4_CLASSIFY_ITEMS = [
  { id: "d1", label: "RAM promedio 91 %.", bucket: "dato" },
  {
    id: "d2",
    label: "Posible saturación de recursos durante la jornada crítica.",
    bucket: "hallazgo",
  },
  { id: "d3", label: "El NAS está utilizado al 86 %.", bucket: "dato" },
  {
    id: "d4",
    label:
      "Existe riesgo de capacidad de almacenamiento debido al uso actual y crecimiento sostenido.",
    bucket: "hallazgo",
  },
  { id: "d5", label: "Se presentaron 11 incidentes.", bucket: "dato" },
  {
    id: "d6",
    label:
      "La frecuencia de incidentes evidencia una necesidad de analizar estabilidad y causas recurrentes.",
    bucket: "hallazgo",
  },
];

export const STAGE4_EVIDENCE_OPTS = [
  { id: "a", label: "CPU promedio 45 %.", relevant: false },
  { id: "b", label: "CPU en matrícula 95 %.", relevant: true },
  { id: "c", label: "Latencia normal 140 ms.", relevant: true },
  { id: "d", label: "Latencia en matrícula 620 ms.", relevant: true },
  { id: "e", label: "El servidor es de color negro.", relevant: false },
  { id: "f", label: "3.400 conexiones simultáneas.", relevant: true },
];

export const STAGE4_FINDING_COMPLETE = {
  hallazgo: {
    correctId: "h1",
    options: [
      {
        id: "h1",
        label: "Existe riesgo de agotamiento progresivo de capacidad de almacenamiento.",
      },
      { id: "h2", label: "El NAS está dañado." },
      { id: "h3", label: "Hay que comprar 20 TB más de inmediato." },
    ],
  },
  evidencia: {
    correctId: "e1",
    options: [
      {
        id: "e1",
        label: "16,8 TB utilizados de 20 TB y crecimiento de 420 GB mensuales.",
      },
      { id: "e2", label: "El NAS es de color gris." },
      { id: "e3", label: "Alguien dijo que el disco está lleno." },
    ],
  },
  impacto: {
    correctId: "i1",
    options: [
      {
        id: "i1",
        label: "Posibles restricciones para almacenar nuevos contenidos o respaldos.",
      },
      { id: "i2", label: "El cable de red es corto." },
      { id: "i3", label: "El personal de TI no tiene café." },
    ],
  },
  criticidad: {
    correctId: "c1",
    options: [
      {
        id: "c1",
        label: "Alta, si el crecimiento continúa y soporta servicios relevantes.",
      },
      { id: "c2", label: "Baja siempre, porque el almacenamiento no importa." },
      { id: "c3", label: "Crítica automáticamente por ser un número alto." },
    ],
  },
};

export const STAGE4_Q_STRONG = {
  id: "s4-q-strong",
  prompt: "¿Cuál es el hallazgo mejor sustentado?",
  options: [
    { id: "a", key: "A", label: "El servidor está lento." },
    { id: "b", key: "B", label: "El servidor debe reemplazarse." },
    {
      id: "c",
      key: "C",
      label:
        "Durante los periodos de alta demanda, el servidor presenta CPU de 95 %, RAM de 88 % y aumento de latencia de 140 ms a 620 ms, lo que evidencia degradación de rendimiento bajo carga.",
    },
  ],
  correctId: "c",
  feedback: {
    correct:
      "Correcto. El hallazgo conecta situación, evidencia y comportamiento observable sin anticipar una solución.",
    incorrect:
      "Un hallazgo débil es vago o salta a la solución. Busca el que conecta evidencia y comportamiento.",
  },
};

export const STAGE4_Q_IMPACT = {
  id: "s4-q-impact",
  prompt: "Una universidad pierde conectividad con su sistema académico durante matrícula. ¿Cuál representa mejor el impacto?",
  options: [
    { id: "a", key: "A", label: "El switch utiliza tecnología antigua." },
    {
      id: "b",
      key: "B",
      label: "Los estudiantes no pueden completar oportunamente su matrícula.",
    },
    { id: "c", key: "C", label: "La CPU del servidor es de 80 %." },
    { id: "d", key: "D", label: "El administrador debe revisar los logs." },
  ],
  correctId: "b",
  feedback: {
    correct:
      "Correcto. El impacto debe expresar la consecuencia sobre el servicio o negocio, no repetir la causa técnica.",
    incorrect:
      "El impacto expresa la consecuencia sobre el servicio o negocio, no la causa técnica ni la tarea operativa.",
  },
};

export const STAGE4_CRIT_ITEMS = [
  {
    id: "b",
    label:
      "Hallazgo B: Servicio de autenticación único. Una falla impide nuevos accesos a plataforma 24/7.",
  },
  {
    id: "a",
    label:
      "Hallazgo A: Servidor de reportes internos con lentitud. Los reportes pueden generarse al día siguiente.",
  },
  {
    id: "c",
    label:
      "Hallazgo C: Archivo administrativo compartido alcanza 70 % de almacenamiento.",
  },
];

/** B primero; A y C en cualquier orden → correcto. */
export const STAGE4_CRIT_MUST_FIRST = "b";

export const STAGE4_CAT_CATS = [
  { id: "capacidad", label: "CAPACIDAD" },
  { id: "disponibilidad", label: "DISPONIBILIDAD" },
  { id: "seguridad", label: "SEGURIDAD" },
  { id: "monitoreo", label: "MONITOREO" },
  { id: "operacion", label: "OPERACIÓN" },
  { id: "gobierno", label: "GOBIERNO" },
  { id: "dependencia", label: "DEPENDENCIA" },
];

export const STAGE4_CAT_ITEMS = [
  { id: "k1", label: "Backup falló 7 días sin alerta.", bucket: "monitoreo" },
  { id: "k2", label: "DB alcanza 96 % de almacenamiento.", bucket: "capacidad" },
  { id: "k3", label: "No existe MFA para acceso remoto.", bucket: "seguridad" },
  {
    id: "k4",
    label:
      "Los incidentes se atienden por múltiples canales y no siempre quedan registrados.",
    bucket: "operacion",
  },
  { id: "k5", label: "No existe SLA para el servicio crítico.", bucket: "gobierno" },
  {
    id: "k6",
    label: "Una única instancia de autenticación soporta todo el acceso.",
    bucket: "dependencia",
  },
];

export const STAGE4_Q_INSUFFICIENT = {
  id: "s4-q-insuf",
  prompt:
    "Los usuarios reportan caídas frecuentes, pero no existe historial de disponibilidad ni registro completo de incidentes. ¿Cuál es la conclusión más adecuada?",
  options: [
    { id: "a", key: "A", label: "El servidor debe reemplazarse." },
    { id: "b", key: "B", label: "El servicio tiene disponibilidad inferior a 95 %." },
    {
      id: "c",
      key: "C",
      label:
        "No existe evidencia suficiente para cuantificar la disponibilidad y debe mejorarse la medición.",
    },
    { id: "d", key: "D", label: "La red es el problema." },
  ],
  correctId: "c",
  feedback: {
    correct:
      "Correcto. Sin historial no puedes cuantificar disponibilidad; la limitación de medición es un hallazgo válido.",
    incorrect:
      "No inventes métricas ni causas. Si faltan datos, documenta la limitación y mejora la medición.",
  },
};

export const STAGE4_BUILDER = {
  context: "CPU 96 % · Latencia 900 ms · Demanda ×3",
  steps: [
    {
      id: "hallazgo",
      title: "1. Hallazgo",
      prompt: "¿Qué está ocurriendo?",
      correctId: "bh",
      options: [
        { id: "bx", label: "El servidor debe reemplazarse." },
        {
          id: "bh",
          label:
            "Existe degradación de rendimiento durante periodos de demanda elevada.",
        },
      ],
      partialId: "bx",
      partialMessage:
        "Estás proponiendo una solución antes de construir el diagnóstico.",
    },
    {
      id: "evidencia",
      title: "2. Evidencia",
      prompt: "¿Qué datos lo demuestran?",
      correctId: "be",
      options: [
        {
          id: "be",
          label: "CPU 96 %, latencia 900 ms y demanda multiplicada por 3.",
        },
        { id: "bz", label: "El rack es azul." },
      ],
    },
    {
      id: "impacto",
      title: "3. Impacto",
      prompt: "¿Qué consecuencia tiene sobre el servicio?",
      correctId: "bi",
      options: [
        {
          id: "bi",
          label: "Los usuarios experimentan lentitud o fallos en operaciones críticas.",
        },
        { id: "by", label: "Hay que migrar a cloud mañana." },
      ],
      partialId: "by",
      partialMessage:
        "Eso es una decisión prematura, no el impacto del hallazgo.",
    },
    {
      id: "criticidad",
      title: "4. Criticidad",
      prompt: "¿Qué tan urgente/importante es?",
      correctId: "bc",
      options: [
        {
          id: "bc",
          label: "Alta: afecta rendimiento bajo demanda y requiere atención prioritaria.",
        },
        { id: "bw", label: "Baja: no afecta a nadie." },
      ],
    },
  ],
};

export const STAGE4_Q_GAP = {
  id: "s4-q-gap",
  prompt: "CPU 95 % → Migrar a cloud. ¿Qué falta entre la evidencia y la decisión?",
  options: [
    { id: "a", key: "A", label: "Nada." },
    { id: "b", key: "B", label: "Impacto y diagnóstico." },
    { id: "c", key: "C", label: "Marca del servidor." },
    { id: "d", key: "D", label: "Presupuesto únicamente." },
  ],
  correctId: "b",
  feedback: {
    correct:
      "Correcto. No saltes de la métrica a la solución: falta impacto y diagnóstico sustentado.",
    incorrect: "Entre la evidencia y la decisión faltan impacto y diagnóstico.",
  },
};

export const STAGE4_MINI_FINDINGS = [
  {
    id: "m1",
    label: "Riesgo de degradación de capacidad durante alta demanda.",
    correct: true,
  },
  {
    id: "m2",
    label: "Riesgo de capacidad en almacenamiento de base de datos.",
    correct: true,
  },
  {
    id: "m3",
    label: "Debilidad de monitoreo de respaldos (fallas sin alerta).",
    correct: true,
  },
  {
    id: "m4",
    label: "Hay que comprar un servidor nuevo de inmediato.",
    correct: false,
  },
  {
    id: "m5",
    label: "Migrar todo a cloud sin más análisis.",
    correct: false,
  },
  {
    id: "m6",
    label: "Disponibilidad observada ≈ 98,9 % (8 h de 720), a contrastar con SLA.",
    correct: true,
  },
];

export const STAGE4_CHAIN_ITEMS = [
  { id: "dato", label: 'DATO — "CPU 95 %"' },
  {
    id: "evidencia",
    label: 'EVIDENCIA — "CPU elevada + aumento de latencia durante alta demanda"',
  },
  {
    id: "hallazgo",
    label: 'HALLAZGO — "Posible degradación por presión de capacidad"',
  },
  {
    id: "impacto",
    label: 'IMPACTO — "El servicio responde lentamente a usuarios"',
  },
  { id: "criticidad", label: 'CRITICIDAD — "Alta"' },
];

export const STAGE4_CHAIN_CORRECT = [
  "dato",
  "evidencia",
  "hallazgo",
  "impacto",
  "criticidad",
];

export const STAGE4_APPLY_CHECKS = [
  { id: "eight", label: "Tengo mínimo 8 hallazgos." },
  { id: "ev", label: "Todos tienen evidencia." },
  { id: "vague", label: "No utilicé afirmaciones vagas." },
  { id: "dato", label: "No confundí dato con hallazgo." },
  { id: "svc", label: "Relacioné el hallazgo con el servicio." },
  { id: "crit", label: "Justifiqué la criticidad." },
  { id: "invent", label: "No inventé datos faltantes." },
  { id: "falta", label: "Identifiqué cuando falta evidencia." },
  { id: "sol", label: "Todavía no salté directamente a la solución." },
];
