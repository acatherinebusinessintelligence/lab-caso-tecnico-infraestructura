/** Contenido académico — Etapa 5: GOBERNAR */

export const STAGE5_STEPS = [
  { id: "s5-perspectivas", title: "Tres preguntas, tres perspectivas", gate: "classifyFw" },
  { id: "s5-itil", title: "ITIL: gestionar el servicio", gate: "itilBlock" },
  { id: "s5-cobit", title: "COBIT: gobernar y controlar", gate: "cobitBlock" },
  { id: "s5-iso", title: "ISO 27001: analizar riesgos", gate: "isoBlock" },
  { id: "s5-compare", title: "Comparar los tres marcos", gate: "compareBlock" },
  { id: "s5-mini", title: "Caso integrador", gate: "miniBlock" },
  { id: "s5-apply", title: "Aplica a tu caso", gate: "checkpoint" },
];

export const STAGE5_FW_CARDS = [
  {
    id: "itil",
    name: "ITIL",
    theme: "fw-itil",
    icon: "⚙",
    question: "¿Cómo gestionamos mejor el servicio?",
    keywords: [
      "incidentes",
      "problemas",
      "cambios",
      "monitoreo",
      "niveles de servicio",
      "continuidad de la operación",
    ],
  },
  {
    id: "cobit",
    name: "COBIT",
    theme: "fw-cobit",
    icon: "⚖",
    question: "¿Quién decide y cómo se gobierna?",
    keywords: [
      "responsabilidades",
      "decisiones",
      "riesgo",
      "control",
      "prioridades",
      "desempeño",
      "alineación con el negocio",
    ],
  },
  {
    id: "iso",
    name: "ISO 27001",
    theme: "fw-iso",
    icon: "🛡",
    question: "¿Qué riesgo afecta la información y cómo lo tratamos?",
    keywords: [
      "activos",
      "amenazas",
      "vulnerabilidades",
      "impacto",
      "controles",
      "seguridad de la información",
    ],
  },
];

export const STAGE5_FW_CATS = [
  { id: "itil", label: "ITIL" },
  { id: "cobit", label: "COBIT" },
  { id: "iso", label: "ISO 27001" },
];

export const STAGE5_FW_ITEMS = [
  {
    id: "f1",
    label:
      "Los incidentes se reciben por correo, teléfono y WhatsApp y no siempre quedan registrados.",
    bucket: "itil",
  },
  {
    id: "f2",
    label: "No existe claridad sobre quién aprueba inversiones de infraestructura.",
    bucket: "cobit",
  },
  {
    id: "f3",
    label: "Existen cuentas de antiguos empleados todavía activas.",
    bucket: "iso",
  },
  {
    id: "f4",
    label: "Un cambio en producción no tenía plan de reversa.",
    bucket: "itil",
  },
  {
    id: "f5",
    label:
      "No existe un responsable formal del nivel de servicio de una aplicación crítica.",
    bucket: "cobit",
  },
  {
    id: "f6",
    label: "Usuarios comparten credenciales.",
    bucket: "iso",
  },
];

export const STAGE5_INC_PROB_CATS = [
  { id: "incidente", label: "INCIDENTE" },
  { id: "problema", label: "PROBLEMA" },
];

export const STAGE5_INC_PROB_ITEMS = [
  {
    id: "ip1",
    label: "El portal estuvo fuera de servicio durante 45 minutos.",
    bucket: "incidente",
  },
  {
    id: "ip2",
    label: "El portal falla todos los lunes después de una tarea programada.",
    bucket: "problema",
  },
  {
    id: "ip3",
    label: "El firewall dejó de responder.",
    bucket: "incidente",
  },
  {
    id: "ip4",
    label: "Se identifican fallas recurrentes asociadas con la misma configuración.",
    bucket: "problema",
  },
];

export const STAGE5_Q_CHANGE = {
  id: "s5-q-change",
  prompt: "Una actualización en horario productivo genera errores sin evaluación de riesgo, pruebas ni plan de reversa. ¿Qué práctica resulta especialmente pertinente?",
  options: [
    { id: "a", key: "A", label: "Gestión de incidentes únicamente." },
    { id: "b", key: "B", label: "Habilitación del cambio." },
    { id: "c", key: "C", label: "Gestión financiera." },
    { id: "d", key: "D", label: "Gestión de proveedores." },
  ],
  correctId: "b",
  feedback: {
    correct:
      "Correcto. El objetivo no es impedir cambios, sino aumentar la probabilidad de que produzcan el resultado esperado.",
    incorrect:
      "La situación apunta a habilitación del cambio: riesgo, pruebas, autorización, validación y reversa.",
  },
};

export const STAGE5_Q_ALERTS = {
  id: "s5-q-alerts",
  prompt:
    "Una organización tiene 1.400 alertas en una noche, pero solo 23 requieren intervención. ¿Qué análisis es más pertinente?",
  options: [
    { id: "a", key: "A", label: "Comprar más servidores." },
    {
      id: "b",
      key: "B",
      label:
        "Revisar monitoreo y gestión de eventos para reducir ruido y priorizar alertas relevantes.",
    },
    { id: "c", key: "C", label: "Eliminar todas las alertas." },
    { id: "d", key: "D", label: "Migrar a cloud." },
  ],
  correctId: "b",
  feedback: {
    correct:
      "Correcto. El problema es de señal vs ruido en monitoreo y eventos, no de comprar infraestructura.",
    incorrect:
      "Más servidores o migrar no resuelve el ruido de alertas. Revisa monitoreo y priorización.",
  },
};

export const STAGE5_ITIL_BUILDER = {
  theme: "fw-itil",
  title: "Constructor ITIL",
  context: "Incidentes reportados por múltiples canales sin registro único.",
  cardTitle: "ANÁLISIS ITIL",
  steps: [
    {
      id: "situacion",
      title: "1. Situación identificada",
      prompt: "¿Qué situación de servicio estás analizando?",
      correctId: "s1",
      options: [
        {
          id: "s1",
          label: "Incidentes reportados por múltiples canales y sin registro consistente.",
        },
        { id: "s2", label: "Hay que comprar un servidor nuevo." },
      ],
      partialId: "s2",
      partialMessage:
        "Incorrecto / riesgoso. Estás saltando a una solución tecnológica sin analizar la gestión del servicio.",
    },
    {
      id: "practica",
      title: "2. Práctica aplicable",
      prompt: "¿Qué práctica ITIL aporta más claridad?",
      correctId: "p1",
      options: [
        { id: "p1", label: "Gestión de incidentes." },
        { id: "p2", label: "Gestión financiera." },
      ],
      altCorrectId: null,
      softWrongId: "p2",
    },
    {
      id: "accion",
      title: "3. Acción propuesta",
      prompt: "¿Qué acción concreta propones?",
      correctId: "a1",
      options: [
        {
          id: "a1",
          label: "Centralizar el registro en una mesa de servicios.",
        },
        { id: "a2", label: "Aplicar ITIL." },
      ],
      partialId: "a2",
      partialMessage:
        "Parcial. «Aplicar ITIL» no basta: necesitas una acción concreta vinculada a la situación.",
      partialStatus: "partial",
    },
    {
      id: "beneficio",
      title: "4. Beneficio esperado",
      prompt: "¿Qué beneficio observable esperas?",
      correctId: "b1",
      options: [
        {
          id: "b1",
          label: "Mayor trazabilidad y posibilidad de medir tiempos e incidentes.",
        },
        { id: "b2", label: "Cumplir una moda de marcos." },
      ],
    },
  ],
};

export const STAGE5_GOV_MGMT_CATS = [
  { id: "gobierno", label: "GOBIERNO" },
  { id: "gestion", label: "GESTIÓN" },
];

export const STAGE5_GOV_MGMT_ITEMS = [
  { id: "gm1", label: "Reiniciar un servidor.", bucket: "gestion" },
  {
    id: "gm2",
    label: "Definir el nivel de disponibilidad esperado para un servicio crítico.",
    bucket: "gobierno",
  },
  { id: "gm3", label: "Instalar una actualización.", bucket: "gestion" },
  {
    id: "gm4",
    label: "Definir quién aprueba cambios de alto riesgo.",
    bucket: "gobierno",
  },
  { id: "gm5", label: "Atender un ticket.", bucket: "gestion" },
  {
    id: "gm6",
    label: "Priorizar inversiones de infraestructura.",
    bucket: "gobierno",
  },
];

export const STAGE5_Q_COBIT = {
  id: "s5-q-cobit",
  prompt:
    "Cinco áreas solicitan inversiones de TI. No existe un criterio común para decidir cuál ejecutar primero. ¿Cuál sería el análisis más apropiado?",
  options: [
    {
      id: "a",
      key: "A",
      label: "Comprar lo solicitado por el área que insistió primero.",
    },
    {
      id: "b",
      key: "B",
      label: "Crear criterios de priorización alineados con riesgo, valor y criticidad.",
    },
    { id: "c", key: "C", label: "Dejar que cada administrador decida." },
    {
      id: "d",
      key: "D",
      label: "Comprar infraestructura para todas las áreas.",
    },
  ],
  correctId: "b",
  feedback: {
    correct:
      "Correcto. El problema requiere una decisión de gobierno, no solamente una acción técnica.",
    incorrect:
      "El problema no se resuelve comprando más: necesita criterios de priorización de gobierno.",
  },
};

export const STAGE5_COBIT_BUILDER = {
  theme: "fw-cobit",
  title: "Constructor COBIT",
  context: "No existe SLA para el servicio crítico.",
  cardTitle: "ANÁLISIS COBIT",
  steps: [
    {
      id: "problema",
      title: "1. Problema",
      prompt: "¿Cuál es el problema de gobierno?",
      correctId: "cp1",
      options: [
        { id: "cp1", label: "No existe SLA para el servicio crítico." },
        { id: "cp2", label: "El cable de red es corto." },
      ],
    },
    {
      id: "decision",
      title: "2. Decisión de gobierno",
      prompt: "¿Qué decisión debe tomarse?",
      correctId: "cd1",
      options: [
        { id: "cd1", label: "Definir y aprobar un nivel de servicio." },
        { id: "cd2", label: "Reiniciar el servidor todas las noches." },
      ],
    },
    {
      id: "responsable",
      title: "3. Responsable",
      prompt: "¿Quién debería involucrarse?",
      correctId: "cr1",
      options: [
        {
          id: "cr1",
          label: "Dirección de TI + dueño del servicio.",
        },
        { id: "cr2", label: "Solo el CIO, de todo." },
      ],
      partialId: "cr2",
      partialMessage:
        "Parcial. No pongas al CIO como responsable de todo. Identifica dueño del servicio e instancias de gobierno.",
      partialStatus: "partial",
    },
    {
      id: "indicador",
      title: "4. Indicador",
      prompt: "¿Qué indicador permite monitorear?",
      correctId: "ci1",
      options: [
        { id: "ci1", label: "Porcentaje de cumplimiento del SLA." },
        { id: "ci2", label: "Color del logo." },
      ],
    },
  ],
};

export const STAGE5_THREAT_CATS = [
  { id: "amenaza", label: "AMENAZA" },
  { id: "vulnerabilidad", label: "VULNERABILIDAD" },
];

export const STAGE5_THREAT_ITEMS = [
  { id: "tv1", label: "Contraseña compartida", bucket: "vulnerabilidad" },
  { id: "tv2", label: "Acceso no autorizado", bucket: "amenaza" },
  { id: "tv3", label: "Servidor sin parches", bucket: "vulnerabilidad" },
  { id: "tv4", label: "Malware", bucket: "amenaza" },
  { id: "tv5", label: "Cuenta de ejemploado activa", bucket: "vulnerabilidad" },
  {
    id: "tv6",
    label: "Robo de información",
    bucket: "amenaza",
    note: "Según contexto puede verse también como impacto potencial.",
  },
];

export const STAGE5_Q_VULN = {
  id: "s5-q-vuln",
  prompt:
    "Una empresa tiene cuentas de antiguos empleados todavía activas. ¿Cuál opción representa mejor la vulnerabilidad?",
  options: [
    { id: "a", key: "A", label: "Acceso no autorizado." },
    {
      id: "b",
      key: "B",
      label: "Cuentas que no fueron deshabilitadas oportunamente.",
    },
    { id: "c", key: "C", label: "Pérdida financiera." },
    { id: "d", key: "D", label: "Firewall." },
  ],
  correctId: "b",
  feedback: {
    correct:
      "Correcto. La vulnerabilidad es la debilidad: cuentas no deshabilitadas. La amenaza asociada sería el acceso no autorizado.",
    incorrect:
      "La falta de baja oportuna de cuentas es la vulnerabilidad. «Acceso no autorizado» es la amenaza.",
  },
};

export const STAGE5_Q_THREAT = {
  id: "s5-q-threat",
  prompt: "Para el mismo caso (cuentas antiguas activas), ¿cuál sería una amenaza asociada?",
  options: [
    { id: "a", key: "A", label: "Acceso no autorizado." },
    { id: "b", key: "B", label: "Cuentas no deshabilitadas." },
    { id: "c", key: "C", label: "El color del servidor." },
    { id: "d", key: "D", label: "Instalar más discos." },
  ],
  correctId: "a",
  feedback: {
    correct: "Correcto. La amenaza es el evento/agente: acceso no autorizado.",
    incorrect:
      "La amenaza es el evento potencial (acceso no autorizado), no la debilidad ni una solución.",
  },
};

export const STAGE5_ISO_BUILDER = {
  theme: "fw-iso",
  title: "Constructor de riesgo ISO 27001",
  context: "Usuarios comparten credenciales en un servicio clínico.",
  cardTitle: "ANÁLISIS ISO 27001",
  steps: [
    {
      id: "activo",
      title: "1. Activo",
      prompt: "¿Qué activo proteges?",
      correctId: "ia1",
      options: [
        { id: "ia1", label: "Historia Clínica Electrónica / información clínica." },
        { id: "ia2", label: "El color del monitor." },
      ],
    },
    {
      id: "amenaza",
      title: "2. Amenaza",
      prompt: "¿Qué amenaza podría materializarse?",
      correctId: "im1",
      options: [
        { id: "im1", label: "Acceso no autorizado." },
        { id: "im2", label: "Usuarios comparten credenciales." },
      ],
      partialId: "im2",
      partialMessage:
        "Revisa. Compartir credenciales es una vulnerabilidad. La amenaza puede ser el acceso no autorizado.",
      partialStatus: "partial",
    },
    {
      id: "vulnerabilidad",
      title: "3. Vulnerabilidad",
      prompt: "¿Qué debilidad facilita la amenaza?",
      correctId: "iv1",
      options: [
        { id: "iv1", label: "Usuarios comparten credenciales." },
        { id: "iv2", label: "Acceso no autorizado." },
      ],
      partialId: "iv2",
      partialMessage:
        "Revisa. Acceso no autorizado es amenaza; la vulnerabilidad es la debilidad (credenciales compartidas).",
      partialStatus: "partial",
    },
    {
      id: "impacto",
      title: "4. Impacto",
      prompt: "¿Qué consecuencia tendría?",
      correctId: "ii1",
      options: [
        {
          id: "ii1",
          label: "Exposición o modificación de información clínica.",
        },
        { id: "ii2", label: "El rack está lleno." },
      ],
    },
    {
      id: "control",
      title: "5. Control",
      prompt: "¿Qué control reduce el riesgo?",
      correctId: "ic1",
      options: [
        {
          id: "ic1",
          label: "Cuentas individuales + autenticación + revisión de permisos.",
        },
        { id: "ic2", label: "Ignorar el riesgo." },
      ],
    },
  ],
};

export const STAGE5_COMPARE_ROWS = [
  { q: "¿Cómo gestionamos un incidente?", fw: "ITIL" },
  { q: "¿Quién debe aprobar un SLA?", fw: "COBIT" },
  { q: "¿Qué riesgo existe por cuentas compartidas?", fw: "ISO 27001" },
  { q: "¿Cómo reducir cambios fallidos?", fw: "ITIL" },
  { q: "¿Quién prioriza una inversión?", fw: "COBIT" },
  { q: "¿Qué activo puede verse comprometido?", fw: "ISO 27001" },
];

export const STAGE5_CHOOSE_ITEMS = [
  {
    id: "ch1",
    label: "Una actualización sin rollback produjo una interrupción.",
    bucket: "itil",
  },
  {
    id: "ch2",
    label: "Nadie sabe quién es responsable del servicio.",
    bucket: "cobit",
  },
  {
    id: "ch3",
    label: "El acceso remoto no utiliza MFA.",
    bucket: "iso",
  },
  {
    id: "ch4",
    label: "Los incidentes recurrentes no tienen análisis de causa.",
    bucket: "itil",
  },
  {
    id: "ch5",
    label: "Las inversiones se aprueban sin indicadores de beneficio.",
    bucket: "cobit",
  },
  {
    id: "ch6",
    label: "Los secretos se rotan manualmente y con poca frecuencia.",
    bucket: "iso",
  },
];

export const STAGE5_MINI_ITIL = {
  theme: "fw-itil",
  title: "ITIL · Mini caso",
  context: "Backup fallando 3 días sin ticket automático.",
  cardTitle: "ANÁLISIS ITIL",
  steps: [
    {
      id: "situacion",
      title: "1. Situación",
      prompt: "Selecciona la situación ITIL del microcaso.",
      correctId: "ms1",
      options: [
        {
          id: "ms1",
          label: "Backup fallando sin detección ni ticket automático.",
        },
        { id: "ms2", label: "Cuentas de antiguos empleados activas." },
      ],
    },
    {
      id: "practica",
      title: "2. Práctica",
      prompt: "¿Qué práctica es más precisa?",
      correctId: "mp1",
      options: [
        { id: "mp1", label: "Monitoreo y gestión de eventos." },
        { id: "mp2", label: "Gestión de incidentes únicamente." },
      ],
      partialId: "mp2",
      partialMessage:
        "Parcial. También hay un problema de detección. Monitoreo y gestión de eventos aporta una perspectiva más precisa.",
      partialStatus: "partial",
    },
    {
      id: "accion",
      title: "3. Acción",
      prompt: "¿Qué acción propones?",
      correctId: "ma1",
      options: [
        { id: "ma1", label: "Generar alerta y ticket automáticamente." },
        { id: "ma2", label: "Aplicar ITIL." },
      ],
      partialId: "ma2",
      partialMessage: "Parcial. Necesitas una acción concreta, no solo el nombre del marco.",
      partialStatus: "partial",
    },
    {
      id: "beneficio",
      title: "4. Beneficio",
      prompt: "¿Qué beneficio esperas?",
      correctId: "mb1",
      options: [
        { id: "mb1", label: "Reducir el tiempo de detección del fallo." },
        { id: "mb2", label: "Tener más PowerPoint." },
      ],
    },
  ],
};

export const STAGE5_MINI_COBIT = {
  theme: "fw-cobit",
  title: "COBIT · Mini caso",
  context: "No está claro quién aprueba inversiones de continuidad / no hay SLA.",
  cardTitle: "ANÁLISIS COBIT",
  steps: [
    {
      id: "problema",
      title: "1. Problema",
      prompt: "Selecciona el problema de gobierno.",
      correctId: "mcp1",
      options: [
        {
          id: "mcp1",
          label: "No hay claridad sobre quién aprueba continuidad / no existe SLA.",
        },
        { id: "mcp2", label: "El backup falló tres días." },
      ],
    },
    {
      id: "decision",
      title: "2. Decisión",
      prompt: "¿Qué decisión de gobierno corresponde?",
      correctId: "mcd1",
      options: [
        {
          id: "mcd1",
          label: "Definir derechos de decisión y/o nivel de servicio.",
        },
        { id: "mcd2", label: "Reiniciar el servidor." },
      ],
    },
    {
      id: "responsable",
      title: "3. Responsable",
      prompt: "¿Quién debe involucrarse?",
      correctId: "mcr1",
      options: [
        {
          id: "mcr1",
          label: "Dirección / comité correspondiente (no «solo el CIO de todo»).",
        },
        { id: "mcr2", label: "Cualquier técnico de turno." },
      ],
    },
    {
      id: "indicador",
      title: "4. Indicador",
      prompt: "¿Qué indicador usarías?",
      correctId: "mci1",
      options: [
        {
          id: "mci1",
          label: "Porcentaje de decisiones con responsable definido / cumplimiento de SLA.",
        },
        { id: "mci2", label: "Número de cafés en la oficina." },
      ],
    },
  ],
};

export const STAGE5_MINI_ISO = {
  theme: "fw-iso",
  title: "ISO 27001 · Mini caso",
  context: "Cuentas de antiguos empleados todavía activas.",
  cardTitle: "ANÁLISIS ISO 27001",
  steps: [
    {
      id: "activo",
      title: "1. Activo",
      prompt: "¿Qué activo está en riesgo?",
      correctId: "mia1",
      options: [
        { id: "mia1", label: "Información corporativa / accesos a sistemas." },
        { id: "mia2", label: "El plan de cambio informal." },
      ],
    },
    {
      id: "amenaza",
      title: "2. Amenaza",
      prompt: "¿Amenaza asociada?",
      correctId: "mim1",
      options: [
        { id: "mim1", label: "Acceso no autorizado." },
        { id: "mim2", label: "Cuentas antiguas activas." },
      ],
      partialId: "mim2",
      partialMessage:
        "Revisa. Las cuentas antiguas son la vulnerabilidad; la amenaza es el acceso no autorizado.",
      partialStatus: "partial",
    },
    {
      id: "vulnerabilidad",
      title: "3. Vulnerabilidad",
      prompt: "¿Vulnerabilidad?",
      correctId: "miv1",
      options: [
        { id: "miv1", label: "Cuentas antiguas todavía activas." },
        { id: "miv2", label: "Acceso no autorizado." },
      ],
      partialId: "miv2",
      partialMessage:
        "Revisa. Acceso no autorizado es amenaza; la vulnerabilidad es la cuenta no dada de baja.",
      partialStatus: "partial",
    },
    {
      id: "impacto",
      title: "4. Impacto",
      prompt: "¿Impacto?",
      correctId: "mii1",
      options: [
        { id: "mii1", label: "Compromiso o exposición de información." },
        { id: "mii2", label: "Más alertas de backup." },
      ],
    },
    {
      id: "control",
      title: "5. Control",
      prompt: "¿Control?",
      correctId: "mic1",
      options: [
        {
          id: "mic1",
          label: "Proceso de baja y revisión periódica de cuentas.",
        },
        { id: "mic2", label: "Comprar otro firewall sin análisis." },
      ],
    },
  ],
};

export const STAGE5_CHECKPOINT = [
  {
    id: "ck1",
    prompt: "¿Quién debe aprobar este nivel de servicio?",
    correctId: "cobit",
  },
  {
    id: "ck2",
    prompt: "¿Cómo debemos gestionar incidentes recurrentes?",
    correctId: "itil",
  },
  {
    id: "ck3",
    prompt: "¿Qué riesgo generan cuentas compartidas?",
    correctId: "iso",
  },
  {
    id: "ck4",
    prompt: "¿Quién debe priorizar inversiones?",
    correctId: "cobit",
  },
  {
    id: "ck5",
    prompt: "¿Cómo reducir cambios fallidos?",
    correctId: "itil",
  },
  {
    id: "ck6",
    prompt: "¿Qué vulnerabilidad facilita acceso no autorizado?",
    correctId: "iso",
  },
];

export const STAGE5_APPLY_ITIL = [
  { id: "i1", label: "No escribí solamente el nombre de ITIL." },
  { id: "i2", label: "Relacioné la práctica con un problema concreto." },
  { id: "i3", label: "La acción responde a la situación." },
  { id: "i4", label: "Definí un beneficio observable." },
];

export const STAGE5_APPLY_COBIT = [
  { id: "c1", label: "Diferencié gobierno de gestión." },
  { id: "c2", label: "Identifiqué quién debe decidir." },
  { id: "c3", label: "No asigné automáticamente todo al CIO." },
  { id: "c4", label: "Propuse un indicador." },
];

export const STAGE5_APPLY_ISO = [
  { id: "s1", label: "Diferencié amenaza y vulnerabilidad." },
  { id: "s2", label: "Identifiqué un activo." },
  { id: "s3", label: "Expliqué el impacto." },
  { id: "s4", label: "Propuse un control relacionado con el riesgo." },
];
