/** Contenido académico — Etapa 3: MEDIR */

export const STAGE3_STEPS = [
  { id: "s3-dato", title: "Un número no es todavía un diagnóstico", gate: "classify" },
  { id: "s3-avail", title: "Disponibilidad", gate: "availBlock" },
  { id: "s3-mttr", title: "MTTR", gate: "mttrBlock" },
  { id: "s3-mtbf", title: "MTBF y limitaciones", gate: "qMtbf" },
  { id: "s3-cap", title: "Capacidad y rendimiento", gate: "capBlock" },
  { id: "s3-joint", title: "Analizar métricas en conjunto", gate: "qJoint" },
  { id: "s3-sla", title: "SLA y dashboard", gate: "slaBlock" },
  { id: "s3-apply", title: "Aplica a tu caso", gate: "checkpoint" },
];

export const STAGE3_CLASSIFY_CATS = [
  { id: "hecho", label: "HECHO" },
  { id: "interp", label: "INTERPRETACIÓN" },
  { id: "supo", label: "SUPOSICIÓN" },
];

export const STAGE3_CLASSIFY_ITEMS = [
  { id: "c1", label: "CPU promedio 84 %.", bucket: "hecho" },
  { id: "c2", label: "El servidor presenta posible presión de capacidad.", bucket: "interp" },
  { id: "c3", label: "El servidor está dañado.", bucket: "supo" },
  { id: "c4", label: "La latencia aumenta a 620 ms durante matrícula.", bucket: "hecho" },
  {
    id: "c5",
    label: "El servicio se degrada durante condiciones de alta demanda.",
    bucket: "interp",
  },
  { id: "c6", label: "La única solución es migrar a cloud.", bucket: "supo" },
];

export const STAGE3_Q_AVAIL = {
  id: "s3-q-avail",
  prompt: "¿98,67 % es una buena disponibilidad?",
  options: [
    { id: "a", key: "A", label: "Sí, cualquier valor superior a 95 % es bueno." },
    { id: "b", key: "B", label: "No, cualquier valor inferior a 100 % es malo." },
    {
      id: "c",
      key: "C",
      label:
        "No puede determinarse únicamente mirando el porcentaje; debe compararse con criticidad, SLA e impacto.",
    },
    { id: "d", key: "D", label: "Sí, porque solo hubo 9,6 horas de caída." },
  ],
  correctId: "c",
  feedback: {
    correct:
      "Correcto. El porcentaje necesita contexto. Para un servicio administrativo podría ser aceptable; para un servicio financiero o clínico crítico puede no serlo.",
    incorrect:
      "Un porcentaje aislado no define calidad. Compáralo con criticidad, SLA e impacto del servicio.",
  },
};

export const STAGE3_Q_MISSING = {
  id: "s3-q-missing",
  prompt: "¿Qué información falta para afirmar si 97,81 % es aceptable?",
  options: [
    {
      id: "a",
      key: "A",
      label: "SLA, criticidad, impacto y requerimiento del negocio.",
    },
    { id: "b", key: "B", label: "Solo el color del servidor." },
    { id: "c", key: "C", label: "Únicamente la marca del firewall." },
    { id: "d", key: "D", label: "Nada: el porcentaje basta." },
  ],
  correctId: "a",
  feedback: {
    correct: "Correcto. Sin SLA, criticidad e impacto no puedes juzgar si el valor es aceptable.",
    incorrect: "El porcentaje solo es evidencia parcial. Necesitas contexto de negocio y acuerdo de servicio.",
  },
};

export const STAGE3_Q_MTTR = {
  id: "s3-q-mttr",
  prompt: "Un MTTR de 4 horas significa que:",
  options: [
    { id: "a", key: "A", label: "Todos los incidentes duran exactamente 4 horas." },
    {
      id: "b",
      key: "B",
      label: "En promedio la recuperación ha requerido 4 horas por incidente.",
    },
    { id: "c", key: "C", label: "El sistema falla cada 4 horas." },
    { id: "d", key: "D", label: "El servicio tiene 4 horas de disponibilidad." },
  ],
  correctId: "b",
  feedback: {
    correct:
      "Correcto. MTTR es un promedio de recuperación, no la duración exacta de todos los incidentes.",
    incorrect: "MTTR no es frecuencia de fallos ni disponibilidad: es tiempo medio de recuperación.",
  },
};

export const STAGE3_Q_MTTR_BETTER = {
  id: "s3-q-mttr-better",
  prompt: "¿Qué sería mejor?",
  options: [
    { id: "a", key: "A", label: "MTTR de 2,5 horas." },
    { id: "b", key: "B", label: "MTTR de 5 horas." },
    { id: "c", key: "C", label: "Son iguales." },
    { id: "d", key: "D", label: "No se puede interpretar." },
  ],
  correctId: "a",
  feedback: {
    correct:
      "Correcto. En general, un MTTR menor indica restauración más rápida. Aun así, compara solo con el mismo tipo de incidentes y servicio.",
    incorrect:
      "Un MTTR menor suele indicar recuperación más rápida, siempre con contexto del tipo de incidentes.",
  },
};

export const STAGE3_Q_MTBF = {
  id: "s3-q-mtbf",
  prompt:
    "El caso no registra las fechas exactas de todos los fallos y algunos incidentes no tienen duración documentada. ¿Qué debería hacer el equipo?",
  options: [
    { id: "a", key: "A", label: "Inventar los datos faltantes." },
    { id: "b", key: "B", label: "No mencionar MTBF." },
    {
      id: "c",
      key: "C",
      label: "Realizar una estimación si es posible y documentar claramente la limitación.",
    },
    {
      id: "d",
      key: "D",
      label: "Usar siempre 720 / número de incidentes sin explicación.",
    },
  ],
  correctId: "c",
  feedback: {
    correct: "Correcto. Reconocer una limitación de datos es una conclusión técnicamente válida.",
    incorrect: "No inventes precisión. Estima solo si es razonable y documenta la limitación.",
  },
};

export const STAGE3_Q_CAP = {
  id: "s3-q-cap",
  prompt: "¿Cuál es la interpretación más adecuada?",
  options: [
    { id: "a", key: "A", label: "El servidor está dañado." },
    {
      id: "b",
      key: "B",
      label: "Existe evidencia de degradación bajo alta demanda y debe analizarse capacidad.",
    },
    { id: "c", key: "C", label: "Hay que reemplazar inmediatamente el servidor." },
    { id: "d", key: "D", label: "Moodle debe migrarse a cloud." },
  ],
  correctId: "b",
  feedback: {
    correct:
      "Correcto. Los datos muestran una relación entre alta demanda, utilización de recursos y degradación de respuesta.",
    incorrect: "La respuesta salta de la métrica a una causa o solución no demostrada.",
  },
};

export const STAGE3_Q_PEAK = {
  id: "s3-q-peak",
  prompt: "¿Cuál genera mayor evidencia de presión sostenida de capacidad?",
  options: [
    {
      id: "a",
      key: "A",
      label: "Servidor A (promedio 45 %, pico 96 % por 20 segundos).",
    },
    {
      id: "b",
      key: "B",
      label: "Servidor B (promedio 88 %, pico 96 % por 4 horas diarias).",
    },
    { id: "c", key: "C", label: "Ambos iguales." },
    { id: "d", key: "D", label: "Ninguno." },
  ],
  correctId: "b",
  feedback: {
    correct:
      "Correcto. Un pico breve puede ser normal; una utilización elevada y sostenida requiere mayor análisis.",
    incorrect: "Compara duración y sostenimiento del pico, no solo el valor máximo.",
  },
};

export const STAGE3_Q_WAIT = {
  id: "s3-q-wait",
  prompt: "¿Eso significa que debemos esperar 7,6 meses para actuar?",
  options: [
    { id: "a", key: "A", label: "Sí." },
    { id: "b", key: "B", label: "No." },
  ],
  correctId: "b",
  feedback: {
    correct: "Correcto. La proyección permite anticiparse antes de alcanzar un nivel crítico.",
    incorrect: "La proyección sirve para anticiparse, no para esperar hasta el límite.",
  },
};

export const STAGE3_Q_JOINT = {
  id: "s3-q-joint",
  prompt: "¿Qué conclusión tiene más evidencia?",
  options: [
    { id: "a", key: "A", label: "El proveedor cloud es malo." },
    {
      id: "b",
      key: "B",
      label: "Existe evidencia de degradación bajo alta concurrencia.",
    },
    { id: "c", key: "C", label: "Es necesario duplicar todos los servidores." },
    { id: "d", key: "D", label: "El firewall está fallando." },
  ],
  correctId: "b",
  feedback: {
    correct:
      "Correcto. Usuarios, CPU, latencia y errores aumentan juntos: patrón de degradación bajo demanda.",
    incorrect: "Evita causas o soluciones no demostradas. Quédate con el patrón evidenciado.",
  },
};

export const STAGE3_Q_SLA_DEF = {
  id: "s3-q-sla-def",
  prompt: "¿Qué sería una mejor definición inicial de SLA para Historia Clínica Electrónica?",
  options: [
    { id: "a", key: "A", label: "Debe funcionar bien." },
    {
      id: "b",
      key: "B",
      label:
        "Disponibilidad objetivo 99,9 % durante operación 24/7, con criterios definidos para incidentes críticos.",
    },
  ],
  correctId: "b",
  feedback: {
    correct: "Correcto. Un SLA debe ser medible y contextualizado al servicio.",
    incorrect: "Un SLA no es una frase vaga: define compromisos medibles.",
  },
};

export const STAGE3_Q_SLA_SAME = {
  id: "s3-q-sla-same",
  prompt: "¿Deben tener necesariamente el mismo SLA el portal informativo, el motor de pagos y los reportes semanales?",
  options: [
    { id: "a", key: "A", label: "Sí." },
    { id: "b", key: "B", label: "No." },
  ],
  correctId: "b",
  feedback: {
    correct:
      "Correcto. El nivel esperado depende de criticidad, usuarios, impacto y horario requerido.",
    incorrect: "No todos los servicios requieren el mismo compromiso de nivel.",
  },
};

export const STAGE3_DASHBOARD = [
  {
    id: "disp",
    label: "DISPONIBILIDAD",
    value: "98,67 %",
    insight:
      "<strong>Disponibilidad 98,67 %.</strong> ¿Cuál es el SLA? ¿Qué criticidad tiene el servicio? ¿Cuál fue el impacto de las 9,6 h fuera?",
  },
  {
    id: "mttr",
    label: "MTTR",
    value: "2,5 h",
    insight:
      "<strong>MTTR 2,5 h.</strong> ¿Qué tipo de incidentes incluye? ¿El tiempo cubre diagnóstico + reparación + restauración?",
  },
  {
    id: "cpu",
    label: "CPU PICO",
    value: "95 %",
    insight:
      "<strong>CPU pico 95 %.</strong> ¿Cuánto duró? ¿Coincidió con demanda? ¿Qué pasó con latencia y errores?",
  },
  {
    id: "ram",
    label: "RAM",
    value: "88 %",
    insight:
      "<strong>RAM 88 %.</strong> ¿Es promedio o sostenido? ¿Hay swap/paginación? ¿Qué aplicaciones consumen memoria?",
  },
  {
    id: "lat",
    label: "LATENCIA PICO",
    value: "620 ms",
    insight:
      "<strong>Latencia pico 620 ms.</strong> ¿Para qué operación? ¿Cuál es el umbral aceptable del negocio?",
  },
  {
    id: "sto",
    label: "ALMACENAMIENTO",
    value: "84 %",
    insight:
      "<strong>Almacenamiento 84 %.</strong> ¿Cuál es el crecimiento mensual? ¿Cuánto tiempo queda antes del umbral crítico?",
  },
];

export const STAGE3_CHECKPOINT = [
  {
    id: "ck1",
    prompt: "CPU pico 97 % durante pocos segundos. ¿Demuestra saturación permanente?",
    correctId: "no",
  },
  {
    id: "ck2",
    prompt: "MTTR disminuye de 4 h a 2 h. ¿Es generalmente una mejora?",
    correctId: "si",
  },
  {
    id: "ck3",
    prompt: "99 % de disponibilidad. ¿Es automáticamente suficiente?",
    correctId: "no",
  },
  {
    id: "ck4",
    prompt: "Faltan datos para MTBF. ¿Podemos documentar la limitación?",
    correctId: "si",
  },
  {
    id: "ck5",
    prompt:
      "Un servicio está disponible pero tarda 8 segundos en responder. ¿Puede existir un problema de rendimiento?",
    correctId: "si",
  },
];

export const STAGE3_APPLY_CHECKS = [
  { id: "disp", label: "Disponibilidad." },
  { id: "mttr", label: "MTTR." },
  { id: "mtbf", label: "MTBF." },
  { id: "cap", label: "Uso de capacidad." },
  { id: "growth", label: "Tendencia de crecimiento." },
  { id: "lat", label: "Comportamiento de latencia." },
];
