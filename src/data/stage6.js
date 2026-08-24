/** Contenido académico — Etapa 6: DECIDIR Y SUSTENTAR */

export const STAGE6_STEPS = [
  { id: "s6-tech-later", title: "La tecnología viene después", gate: "startBlock" },
  { id: "s6-models", title: "On-premise y cloud", gate: "modelsBlock" },
  { id: "s6-hybrid-edge", title: "Híbrido y edge", gate: "hybridEdgeBlock" },
  { id: "s6-compare", title: "Comparar y gestionar riesgo", gate: "compareBlock" },
  { id: "s6-finance", title: "CAPEX, OPEX y métricas", gate: "financeBlock" },
  { id: "s6-priority", title: "Priorizar y construir decisiones", gate: "decisionBlock" },
  { id: "s6-apply", title: "Aplica, checkpoint y cierre", gate: "finalBlock" },
];

export const STAGE6_Q_CPU = {
  id: "s6-q-cpu",
  prompt:
    "Un servidor presenta CPU de 95 % durante periodos de alta demanda. ¿Cuál es la conclusión más adecuada?",
  options: [
    { id: "a", key: "A", label: "Migrar inmediatamente a cloud." },
    { id: "b", key: "B", label: "Comprar un servidor nuevo." },
    {
      id: "c",
      key: "C",
      label:
        "Analizar el problema de capacidad, su impacto y las alternativas antes de seleccionar una solución.",
    },
    { id: "d", key: "D", label: "Implementar Kubernetes." },
  ],
  correctId: "c",
  feedback: {
    correct:
      "Correcto. La evidencia demuestra un comportamiento que requiere análisis, no una tecnología específica.",
    incorrect: "Estás saltando directamente de la métrica a una solución.",
  },
};

export const STAGE6_Q_WEAK = {
  id: "s6-q-weak",
  prompt: "¿Cuál es la recomendación mejor sustentada?",
  options: [
    {
      id: "a",
      key: "A",
      label: "Implementar cloud porque es más moderno.",
    },
    {
      id: "b",
      key: "B",
      label:
        "Evaluar capacidad elástica para atender picos de demanda que actualmente elevan CPU y latencia, comparando costo, riesgo y operación frente a ampliar permanentemente infraestructura.",
    },
  ],
  correctId: "b",
  feedback: {
    correct:
      "Correcto. La recomendación B identifica el problema que intenta resolver y no presenta la tecnología como un fin.",
    incorrect:
      "«Más moderno» no es evidencia. La recomendación debe partir del problema, impacto y comparación de alternativas.",
  },
};

export const STAGE6_Q_ONPREM = {
  id: "s6-q-onprem",
  prompt:
    "Una fábrica requiere que determinada operación continúe incluso si pierde conectividad externa. ¿Mantener parte del procesamiento local puede ser razonable?",
  options: [
    { id: "a", key: "A", label: "Sí." },
    { id: "b", key: "B", label: "No; todo debe estar en cloud." },
  ],
  correctId: "a",
  feedback: {
    correct:
      "Correcto. La decisión depende de continuidad, latencia y dependencia de conectividad.",
    incorrect:
      "On-premise o procesamiento local puede ser razonable cuando la continuidad no depende de conectividad externa.",
  },
};

export const STAGE6_Q_CLOUD = {
  id: "s6-q-cloud",
  prompt:
    "Una universidad tiene picos de demanda muy altos únicamente en periodos de matrícula. ¿Debe comprar necesariamente infraestructura permanente para soportar el máximo pico del año?",
  options: [
    { id: "a", key: "A", label: "Sí." },
    {
      id: "b",
      key: "B",
      label:
        "No necesariamente; debe comparar elasticidad, costo y riesgo frente a capacidad permanente.",
    },
    { id: "c", key: "C", label: "Debe migrar toda la universidad a cloud." },
    { id: "d", key: "D", label: "Debe ignorar los picos." },
  ],
  correctId: "b",
  feedback: {
    correct:
      "Correcto. Cloud no significa automáticamente menor costo; hay que comparar alternativas con evidencia.",
    incorrect:
      "No asumas infraestructura permanente ni migración total sin comparar elasticidad, costo y riesgo.",
  },
};

export const STAGE6_Q_HYBRID = {
  id: "s6-q-hybrid",
  prompt:
    "Un banco mantiene su core bancario estable on-premise, pero su portal web experimenta demanda variable. ¿Cuál enfoque merece análisis?",
  options: [
    { id: "a", key: "A", label: "Migrar absolutamente todo a cloud." },
    { id: "b", key: "B", label: "Mantener absolutamente todo local." },
    {
      id: "c",
      key: "C",
      label:
        "Evaluar un modelo híbrido donde cada componente se ubique según criticidad, elasticidad, riesgo e integración.",
    },
    { id: "d", key: "D", label: "Duplicar toda la infraestructura." },
  ],
  correctId: "c",
  feedback: {
    correct:
      "Correcto. Híbrido no es «mitad y mitad»: cada componente se ubica según razón técnica u operativa.",
    incorrect:
      "Evita extremos absolutos. Pregunta qué componente debe estar dónde y por qué.",
  },
};

export const STAGE6_Q_EDGE = {
  id: "s6-q-edge",
  prompt:
    "Una tienda debe seguir registrando ventas durante una interrupción temporal de Internet. ¿Qué capacidad podría justificar procesamiento local/edge?",
  options: [
    {
      id: "a",
      key: "A",
      label:
        "Procesar y almacenar temporalmente determinadas transacciones para sincronizarlas después.",
    },
    { id: "b", key: "B", label: "Migrar el correo a edge." },
    {
      id: "c",
      key: "C",
      label: "Ejecutar todas las aplicaciones corporativas en cada caja.",
    },
    { id: "d", key: "D", label: "Ninguna función local." },
  ],
  correctId: "a",
  feedback: {
    correct:
      "Correcto. Edge tiene sentido cuando se necesita continuidad o baja latencia local, no por moda.",
    incorrect:
      "No propongas edge para todo. Aquí la continuidad de transacciones locales es el argumento.",
  },
};

export const STAGE6_COMPARE_CRITERIA = [
  {
    criterio: "Problema típico",
    onprem: "Control local, cargas estables, continuidad sin enlace",
    cloud: "Demanda variable, aprovisionamiento rápido",
    hybrid: "Componentes con requisitos distintos",
    edge: "Latencia/operación cerca del evento",
  },
  {
    criterio: "Costo",
    onprem: "CAPEX alto; ociosidad posible",
    cloud: "OPEX variable; riesgo de gasto",
    hybrid: "Combinación; complejidad de costo",
    edge: "CAPEX/OPEX distribuido",
  },
  {
    criterio: "Elasticidad",
    onprem: "Limitada / más lenta",
    cloud: "Alta si está bien diseñada",
    hybrid: "Selectiva por componente",
    edge: "Local; no siempre elástica",
  },
  {
    criterio: "Disponibilidad / latencia",
    onprem: "Depende del diseño local",
    cloud: "Depende de región y conectividad",
    hybrid: "Diseño por componente",
    edge: "Baja latencia local posible",
  },
  {
    criterio: "Dependencia / operación",
    onprem: "Personal e infraestructura propias",
    cloud: "Proveedor + gobierno de consumo",
    hybrid: "Mayor complejidad operativa",
    edge: "Muchos nodos que operar",
  },
];

export const STAGE6_Q_BEST = {
  id: "s6-q-best",
  prompt: "¿Cuál de estas tecnologías es siempre la mejor opción?",
  options: [
    { id: "a", key: "A", label: "Cloud." },
    { id: "b", key: "B", label: "On-premise." },
    { id: "c", key: "C", label: "Híbrida." },
    { id: "d", key: "D", label: "Edge." },
    { id: "e", key: "E", label: "Ninguna." },
  ],
  correctId: "e",
  feedback: {
    correct:
      "Correcto. La decisión depende del problema, contexto, restricciones, costo y riesgo. No existe un ganador universal.",
    incorrect: "Ninguna tecnología es siempre la mejor. Parte del problema y compara.",
  },
};

export const STAGE6_Q_RISK = {
  id: "s6-q-risk",
  prompt:
    "Se decide agregar un segundo centro de procesamiento. ¿Cuál podría ser un riesgo nuevo?",
  options: [
    { id: "a", key: "A", label: "Mayor complejidad y costo operativo." },
    {
      id: "b",
      key: "B",
      label: "Ninguno; la redundancia elimina todo riesgo.",
    },
    {
      id: "c",
      key: "C",
      label: "La infraestructura deja de necesitar monitoreo.",
    },
    { id: "d", key: "D", label: "Los incidentes desaparecen." },
  ],
  correctId: "a",
  feedback: {
    correct:
      "Correcto. Toda decisión introduce beneficios y nuevos riesgos (complejidad, costo, operación).",
    incorrect: "La redundancia no elimina todos los riesgos; suele añadir complejidad operativa.",
  },
};

export const STAGE6_CAPEX_CATS = [
  { id: "capex", label: "CAPEX" },
  { id: "opex", label: "OPEX" },
];

export const STAGE6_CAPEX_ITEMS = [
  { id: "co1", label: "Comprar servidor físico", bucket: "capex" },
  { id: "co2", label: "Consumir máquinas virtuales por mes", bucket: "opex" },
  { id: "co3", label: "Comprar cabina de almacenamiento", bucket: "capex" },
  { id: "co4", label: "Suscripción de monitoreo SaaS", bucket: "opex" },
  { id: "co5", label: "Contratar soporte anual", bucket: "opex" },
  { id: "co6", label: "Comprar firewall físico", bucket: "capex" },
];

export const STAGE6_Q_CAPEX_PEAK = {
  id: "s6-q-capex-peak",
  prompt:
    "Picos de demanda 3 veces al año. Alternativa A: comprar para el máximo pico (CAPEX alto + ociosidad). Alternativa B: capacidad elástica (OPEX variable + control de consumo). ¿Cuál es mejor?",
  options: [
    { id: "a", key: "A", label: "Siempre A." },
    { id: "b", key: "B", label: "Siempre B." },
    {
      id: "c",
      key: "C",
      label:
        "No puede determinarse sin analizar costo total, frecuencia, riesgo y operación.",
    },
  ],
  correctId: "c",
  feedback: {
    correct:
      "Correcto. CAPEX/OPEX no eligen solos: hay que analizar costo total, frecuencia, riesgo y operación.",
    incorrect: "No hay ganador automático. Analiza costo total, frecuencia, riesgo y operación.",
  },
};

export const STAGE6_Q_METRIC = {
  id: "s6-q-metric",
  prompt:
    "Se implementa una mejora para reducir el tiempo de recuperación de incidentes. ¿Cuál métrica debería mejorar?",
  options: [
    { id: "a", key: "A", label: "CAPEX." },
    { id: "b", key: "B", label: "MTTR." },
    { id: "c", key: "C", label: "Número de empleados." },
    { id: "d", key: "D", label: "Cantidad de servidores." },
  ],
  correctId: "b",
  feedback: {
    correct: "Correcto. Si el objetivo es recuperar más rápido, MTTR es la métrica natural.",
    incorrect: "La métrica debe validar el objetivo de la decisión: aquí, el tiempo de recuperación (MTTR).",
  },
};

export const STAGE6_Q_PRIORITY = {
  id: "s6-q-priority",
  prompt: "¿Cuál parece tener mayor prioridad inmediata?",
  options: [
    {
      id: "a",
      key: "A",
      label:
        "Configurar alerta de backup que puede fallar días sin detección (alto impacto, bajo esfuerzo).",
    },
    {
      id: "b",
      key: "B",
      label: "Reemplazar todos los servidores (impacto no demostrado, esfuerzo muy alto).",
    },
    {
      id: "c",
      key: "C",
      label: "Documentar dependencias críticas (impacto medio/alto, esfuerzo medio).",
    },
  ],
  correctId: "a",
  feedback: {
    correct:
      "Correcto. Existe evidencia clara, riesgo importante y una acción relativamente factible.",
    incorrect:
      "Prioriza alto impacto con esfuerzo factible y evidencia clara. Reemplazar todo sin diagnóstico no es prioridad inmediata.",
  },
};

export const STAGE6_DECISION_BUILDER = {
  theme: "dec-theme",
  title: "DecisionBuilder · Ejemplo guiado",
  context: "Backups fallan sin ser detectados.",
  cardTitle: "DECISIÓN COMPLETA",
  steps: [
    {
      id: "problema",
      title: "1. Problema",
      prompt: "¿Qué problema estás resolviendo?",
      correctId: "p1",
      options: [
        { id: "p1", label: "Backups fallan sin ser detectados." },
        { id: "p2", label: "Cloud es más moderno." },
      ],
      partialId: "p2",
      partialMessage:
        "Incorrecto / riesgoso. Estás partiendo de una tecnología, no del problema.",
      partialStatus: "incorrect",
    },
    {
      id: "evidencia",
      title: "2. Evidencia",
      prompt: "¿Qué evidencia lo sustenta?",
      correctId: "e1",
      options: [
        { id: "e1", label: "Dos fallos de backup superiores a 24 h sin detección." },
        { id: "e2", label: "El rack es azul." },
      ],
    },
    {
      id: "impacto",
      title: "3. Impacto",
      prompt: "¿Qué impacto tiene?",
      correctId: "i1",
      options: [
        { id: "i1", label: "Riesgo sobre recuperabilidad de la información." },
        { id: "i2", label: "Hay que comprar Kubernetes." },
      ],
    },
    {
      id: "decision",
      title: "4. Decisión",
      prompt: "¿Qué decisión propones?",
      correctId: "d1",
      options: [
        {
          id: "d1",
          label: "Implementar monitoreo automático y alertamiento de backups.",
        },
        { id: "d2", label: "Migrar todo a cloud porque es escalable." },
      ],
      partialId: "d2",
      partialMessage:
        "Incorrecto / riesgoso. Has seleccionado una tecnología sin relacionarla con el problema, evidencia e impacto de este caso.",
      partialStatus: "incorrect",
    },
    {
      id: "beneficio",
      title: "5. Beneficio",
      prompt: "¿Qué beneficio esperas?",
      correctId: "b1",
      options: [
        { id: "b1", label: "Detección temprana de fallos de backup." },
        { id: "b2", label: "Parecer innovadores." },
      ],
    },
    {
      id: "riesgo",
      title: "6. Riesgo introducido",
      prompt: "¿Qué riesgo nuevo introduce?",
      correctId: "r1",
      options: [
        {
          id: "r1",
          label: "Ruido de alertas si se configura incorrectamente.",
        },
        { id: "r2", label: "Ningún riesgo; las alertas siempre son perfectas." },
      ],
    },
    {
      id: "finanza",
      title: "7. CAPEX / OPEX",
      prompt: "¿Cómo se financia principalmente?",
      correctId: "f1",
      options: [
        {
          id: "f1",
          label: "Principalmente OPEX / esfuerzo operativo, según herramienta.",
        },
        { id: "f2", label: "Solo CAPEX de comprar un data center nuevo." },
      ],
    },
    {
      id: "metrica",
      title: "8. Métrica",
      prompt: "¿Cómo sabrás que funcionó?",
      correctId: "m1",
      options: [
        {
          id: "m1",
          label: "% de backups exitosos + tiempo de detección.",
        },
        { id: "m2", label: "Cantidad de presentaciones PowerPoint." },
      ],
    },
    {
      id: "prioridad",
      title: "9. Prioridad",
      prompt: "¿Qué prioridad asignas?",
      correctId: "pr1",
      options: [
        { id: "pr1", label: "Alta (evidencia clara, riesgo importante, factible)." },
        { id: "pr2", label: "Baja; se puede ignorar." },
      ],
    },
  ],
};

export const STAGE6_CHAIN_ITEMS = [
  { id: "problema", label: "Existe degradación de rendimiento bajo alta demanda." },
  { id: "evidencia", label: "Latencia promedio 900 ms en pico." },
  { id: "impacto", label: "Usuarios no completan transacciones oportunamente." },
  {
    id: "decision",
    label: "Evaluar capacidad y estrategia de escalamiento.",
  },
  {
    id: "metrica",
    label: "Latencia p95 inferior a un objetivo definido.",
  },
];

export const STAGE6_CHAIN_CORRECT = [
  "problema",
  "evidencia",
  "impacto",
  "decision",
  "metrica",
];

/** Mini caso: tres builders. Acepta decisiones sustentadas (correctId). */
export const STAGE6_MINI_CAP = {
  theme: "dec-theme",
  title: "Mini caso · Capacidad",
  context: "CPU 93 % en alta demanda · latencia 850 ms · demanda +40 % · presupuesto limitado.",
  cardTitle: "RECOMENDACIÓN DE CAPACIDAD",
  steps: [
    {
      id: "problema",
      title: "1. Problema",
      prompt: "¿Problema de capacidad?",
      correctId: "pc1",
      options: [
        {
          id: "pc1",
          label: "Riesgo de degradación bajo demanda creciente (+40 %) con CPU/latencia elevados en pico.",
        },
        { id: "pc2", label: "Cloud porque es escalable." },
      ],
      partialId: "pc2",
      partialMessage:
        "Incorrecto / riesgoso. Has seleccionado una tecnología; falta relacionarla con evidencia e impacto.",
      partialStatus: "incorrect",
    },
    {
      id: "decision",
      title: "2. Decisión",
      prompt: "¿Qué decisión sustentada propones?",
      correctId: "dc1",
      altCorrectId: "dc2",
      options: [
        {
          id: "dc1",
          label:
            "Evaluar escalamiento elástico / capacidad adicional según costo, riesgo y operación (sin asumir cloud por defecto).",
        },
        {
          id: "dc2",
          label:
            "Comparar ampliar capacidad permanente vs elasticidad, con presupuesto limitado y métricas de CPU/latencia.",
        },
        { id: "dc3", label: "Comprar todo cloud mañana sin análisis." },
      ],
      partialId: "dc3",
      partialMessage:
        "Incorrecto / riesgoso. Falta evidencia, impacto, alternativas y métrica.",
      partialStatus: "incorrect",
    },
    {
      id: "metrica",
      title: "3. Métrica",
      prompt: "¿Qué medirías?",
      correctId: "mc1",
      options: [
        {
          id: "mc1",
          label: "CPU en pico, latencia (p95) y tasa de errores bajo demanda.",
        },
        { id: "mc2", label: "Número de logos en la presentación." },
      ],
    },
  ],
};

export const STAGE6_MINI_AVAIL = {
  theme: "dec-theme",
  title: "Mini caso · Disponibilidad",
  context: "Disponibilidad 98,4 % · MTTR 3,8 h · autenticación en una sola instancia · 24/7.",
  cardTitle: "RECOMENDACIÓN DE DISPONIBILIDAD",
  steps: [
    {
      id: "problema",
      title: "1. Problema",
      prompt: "¿Problema de disponibilidad?",
      correctId: "pa1",
      options: [
        {
          id: "pa1",
          label:
            "Disponibilidad/MTTR y SPOF de autenticación comprometen un servicio 24/7.",
        },
        { id: "pa2", label: "Kubernetes siempre." },
      ],
      partialId: "pa2",
      partialMessage: "Incorrecto / riesgoso. Parte del diagnóstico, no de la tecnología.",
      partialStatus: "incorrect",
    },
    {
      id: "decision",
      title: "2. Decisión",
      prompt: "¿Decisión sustentada?",
      correctId: "da1",
      altCorrectId: "da2",
      options: [
        {
          id: "da1",
          label:
            "Reducir SPOF de autenticación y mejorar recuperación (redundancia/procedimientos), midiendo disponibilidad y MTTR.",
        },
        {
          id: "da2",
          label:
            "Priorizar resiliencia del acceso y reducción de MTTR con evidencia de 98,4 % y 3,8 h.",
        },
        { id: "da3", label: "Ignorar el SPOF." },
      ],
      partialId: "da3",
      partialMessage: "Incorrecto / riesgoso. El SPOF de autenticación es evidencia relevante.",
      partialStatus: "incorrect",
    },
    {
      id: "metrica",
      title: "3. Métrica",
      prompt: "¿Métrica?",
      correctId: "ma1",
      options: [
        { id: "ma1", label: "Disponibilidad % y MTTR (y fallos de autenticación)." },
        { id: "ma2", label: "Cantidad de servidores comprados." },
      ],
    },
  ],
};

export const STAGE6_MINI_MON = {
  theme: "dec-theme",
  title: "Mini caso · Monitoreo",
  context: "Backup presenta fallos no detectados.",
  cardTitle: "RECOMENDACIÓN DE MONITOREO",
  steps: [
    {
      id: "problema",
      title: "1. Problema",
      prompt: "¿Problema?",
      correctId: "pm1",
      options: [
        { id: "pm1", label: "Fallos de backup sin detección oportuna." },
        { id: "pm2", label: "Edge computing en todas las sedes." },
      ],
      partialId: "pm2",
      partialMessage: "Incorrecto / riesgoso. Edge no responde a este hallazgo.",
      partialStatus: "incorrect",
    },
    {
      id: "decision",
      title: "2. Decisión",
      prompt: "¿Decisión?",
      correctId: "dm1",
      options: [
        {
          id: "dm1",
          label:
            "Monitoreo automático + alertas/tickets de backup, controlando ruido de alertas.",
        },
        {
          id: "dm2",
          label: "Cloud porque es escalable.",
        },
      ],
      partialId: "dm2",
      partialMessage:
        "Incorrecto / riesgoso. Falta relacionar con evidencia, impacto y métrica del backup.",
      partialStatus: "incorrect",
    },
    {
      id: "metrica",
      title: "3. Métrica",
      prompt: "¿Métrica?",
      correctId: "mm1",
      options: [
        {
          id: "mm1",
          label: "% backups exitosos + tiempo de detección de fallo.",
        },
        { id: "mm2", label: "CAPEX." },
      ],
    },
  ],
};

export const STAGE6_Q_BEFORE_TECH = {
  id: "s6-q-before",
  prompt: "¿Qué debe ocurrir antes de seleccionar una tecnología?",
  options: [
    { id: "a", key: "A", label: "Construir y sustentar el diagnóstico." },
    { id: "b", key: "B", label: "Elegir el proveedor más famoso." },
    { id: "c", key: "C", label: "Comprar la tendencia del mercado." },
    { id: "d", key: "D", label: "Migrar todo a cloud." },
  ],
  correctId: "a",
  feedback: {
    correct: "Correcto. Primero diagnóstico sustentado; después alternativas y decisión.",
    incorrect: "Antes de la tecnología: construir y sustentar el diagnóstico.",
  },
};

export const STAGE6_KNOWLEDGE = [
  {
    id: "k1",
    prompt: "¿Qué representa AS-IS?",
    options: [
      { id: "a", key: "A", label: "Cómo funciona actualmente la infraestructura." },
      { id: "b", key: "B", label: "El diseño futuro ideal." },
      { id: "c", key: "C", label: "Solo el presupuesto." },
    ],
    correctId: "a",
    feedback: {
      correct: "Correcto. AS-IS describe lo que existe hoy.",
      incorrect: "AS-IS es el estado actual, no el TO-BE.",
    },
  },
  {
    id: "k2",
    prompt: "¿Qué caracteriza un SPOF?",
    options: [
      {
        id: "a",
        key: "A",
        label: "Un componente único cuya falla puede detener el servicio.",
      },
      { id: "b", key: "B", label: "Cualquier servidor." },
      { id: "c", key: "C", label: "Un indicador financiero." },
    ],
    correctId: "a",
    feedback: {
      correct: "Correcto. SPOF = punto único de falla.",
      incorrect: "SPOF es un punto único cuya falla impacta el servicio.",
    },
  },
  {
    id: "k3",
    prompt: "¿Qué significa MTTR?",
    options: [
      {
        id: "a",
        key: "A",
        label: "Tiempo promedio de recuperación / reparación.",
      },
      { id: "b", key: "B", label: "Tiempo entre fallos." },
      { id: "c", key: "C", label: "Disponibilidad porcentual." },
    ],
    correctId: "a",
    feedback: {
      correct: "Correcto. MTTR es el tiempo medio de recuperación.",
      incorrect: "MTBF es entre fallos; disponibilidad es otra métrica. MTTR = recuperación.",
    },
  },
  {
    id: "k4",
    prompt: "¿CPU 95 % demuestra automáticamente saturación permanente?",
    options: [
      { id: "a", key: "A", label: "No." },
      { id: "b", key: "B", label: "Sí." },
    ],
    correctId: "a",
    feedback: {
      correct: "Correcto. Necesitas duración, demanda, latencia y contexto.",
      incorrect: "Un pico breve no demuestra saturación permanente.",
    },
  },
  {
    id: "k5",
    prompt: "¿Qué diferencia ITIL y COBIT en este laboratorio?",
    options: [
      {
        id: "a",
        key: "A",
        label: "ITIL gestiona el servicio; COBIT governa y controla decisiones.",
      },
      { id: "b", key: "B", label: "Son exactamente lo mismo." },
      { id: "c", key: "C", label: "Solo sirven para auditar impresoras." },
    ],
    correctId: "a",
    feedback: {
      correct: "Correcto. Preguntas distintas: gestionar vs gobernar.",
      incorrect: "ITIL ≠ COBIT: servicio vs gobierno/control.",
    },
  },
  {
    id: "k6",
    prompt: "¿Falta de MFA es amenaza o vulnerabilidad?",
    options: [
      { id: "a", key: "A", label: "Vulnerabilidad." },
      { id: "b", key: "B", label: "Amenaza." },
    ],
    correctId: "a",
    feedback: {
      correct: "Correcto. Es una debilidad; la amenaza puede ser acceso no autorizado.",
      incorrect: "La falta de MFA es vulnerabilidad (debilidad).",
    },
  },
  {
    id: "k7",
    prompt: "¿Cloud es siempre OPEX menor?",
    options: [
      { id: "a", key: "A", label: "No." },
      { id: "b", key: "B", label: "Sí, siempre." },
    ],
    correctId: "a",
    feedback: {
      correct: "Correcto. Elasticidad sin gobierno puede elevar el gasto.",
      incorrect: "Cloud no garantiza menor costo.",
    },
  },
  {
    id: "k8",
    prompt: "¿Qué secuencia debe seguir una recomendación?",
    options: [
      {
        id: "a",
        key: "A",
        label: "Problema → Evidencia → Impacto → Decisión → Métrica.",
      },
      {
        id: "b",
        key: "B",
        label: "Tecnología → Problema inventado → Compra.",
      },
      { id: "c", key: "C", label: "Solo el logo del proveedor." },
    ],
    correctId: "a",
    feedback: {
      correct: "Correcto. Esa es la cadena de decisión del laboratorio.",
      incorrect: "No empieces por la tecnología.",
    },
  },
];

export const STAGE6_APPLY_CHECKS = [
  { id: "a1", label: "Cada recomendación responde a un hallazgo." },
  { id: "a2", label: "No recomendé tecnología solo por tendencia." },
  { id: "a3", label: "Comparé alternativas." },
  { id: "a4", label: "Consideré restricciones." },
  { id: "a5", label: "Identifiqué riesgos nuevos." },
  { id: "a6", label: "Analicé CAPEX/OPEX." },
  { id: "a7", label: "Definí una métrica." },
  { id: "a8", label: "Prioricé las recomendaciones." },
];

export const STAGE6_FINAL_CHECKS = [
  { id: "f1", label: "Comprendo el negocio." },
  { id: "f2", label: "Identifico servicios críticos." },
  { id: "f3", label: "Construyo un AS-IS." },
  { id: "f4", label: "Identifico dependencias y SPOF." },
  { id: "f5", label: "Interpreto disponibilidad." },
  { id: "f6", label: "Interpreto MTTR y MTBF." },
  { id: "f7", label: "Analizo capacidad." },
  { id: "f8", label: "Construyo hallazgos." },
  { id: "f9", label: "Diferencio ITIL, COBIT e ISO 27001." },
  { id: "f10", label: "Comparo alternativas tecnológicas." },
  { id: "f11", label: "Analizo CAPEX/OPEX." },
  { id: "f12", label: "Sustento decisiones con evidencia." },
];
