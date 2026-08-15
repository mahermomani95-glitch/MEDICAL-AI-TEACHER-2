export const SCENE_DEFINITIONS = [
  { id: "QUESTION", label: "المشهد ١ · فهم السؤال" },
  { id: "ANSWER_PROPOSAL", label: "المشهد ٢ · تحديد الإجابة" },
  { id: "CLINICAL_REASONING", label: "المشهد ٣ · الشرح والسبب" },
  { id: "DISTRACTORS", label: "المشهد ٤ · لماذا الخيارات الأخرى خطأ؟" },
  { id: "EXAM_TRAP", label: "المشهد ٥ · فخ الامتحان" },
  { id: "TAKE_HOME", label: "المشهد ٦ · الخلاصة والتثبيت" }
];

const safeText = (value, fallback = "") =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;

export const AR = (text) => ({ type: "ar", text: safeText(text) });
export const SPEAKER = (_name, ...parts) => ({ name: "TEACHER", parts });

const esc = (value) => safeText(value).replace(/[&<>\"]/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;"
}[c]));

function visualCard(title, body, icon = "🩺") {
  return `<div class="teaching-graphic" dir="rtl">
    <div class="graphic-icon">${icon}</div>
    <div class="graphic-title">${esc(title)}</div>
    <div class="graphic-body">${esc(body)}</div>
  </div>`;
}

export function validateQuestion(question) {
  if (!question || typeof question !== "object") throw new Error("Question must be an object.");
  if (!safeText(question.question)) throw new Error("Missing English source question.");
  if (!safeText(question.arabic)) throw new Error("Missing Arabic question translation.");
  if (!Array.isArray(question.options) || question.options.length < 2) {
    throw new Error("Question must contain at least two options.");
  }
  if (!Array.isArray(question.arabic_options) || question.arabic_options.length !== question.options.length) {
    throw new Error("Every option must have an Arabic translation in arabic_options.");
  }
  if (!safeText(question.source_indicated_answer)) throw new Error("Missing source_indicated_answer.");
  if (!question.options.some((option) => option.letter === question.source_indicated_answer)) {
    throw new Error("source_indicated_answer does not match an option.");
  }
  if (!question.teaching || !safeText(question.teaching.reasoning)) {
    throw new Error("Missing Arabic teaching reasoning.");
  }
  return true;
}

export function buildScenes(question) {
  validateQuestion(question);

  const teaching = question.teaching;
  const answer = question.source_indicated_answer;
  const correctIndex = question.options.findIndex((option) => option.letter === answer);
  const correctArabic = safeText(question.arabic_options[correctIndex], "الإجابة الصحيحة");
  const trigger = Array.isArray(teaching.trigger)
    ? safeText(teaching.trigger[0], "حدّد المعلومة المفتاحية في السؤال.")
    : safeText(teaching.trigger, "حدّد المعلومة المفتاحية في السؤال.");
  const reasoning = safeText(teaching.reasoning);
  const distractors = safeText(teaching.distractors, "نقارن كل خيار بالمعلومة المفتاحية ونستبعد ما لا ينسجم معها.");
  const memory = safeText(teaching.memory_anchor, correctArabic);
  const visualHint = safeText(teaching.visual_hint);

  const wrongOptions = question.options
    .map((option, index) => ({ option, index }))
    .filter(({ option }) => option.letter !== answer);

  const distractorLines = wrongOptions.map(({ option, index }) =>
    SPEAKER("TEACHER", AR(`الخيار ${option.letter}: ${question.arabic_options[index]} — نستبعده لأن ${distractors}`))
  );

  const baseVisual = visualHint || trigger;

  return [
    {
      id: "QUESTION",
      label: SCENE_DEFINITIONS[0].label,
      visual: visualCard("اقرأ السؤال أولاً", baseVisual, "🔎"),
      dialogue: [
        SPEAKER("TEACHER", AR("خلينا نبدأ بهدوء. لا تحفظ حرف الإجابة؛ افهم أولاً ماذا يريد السؤال منك.")),
        SPEAKER("TEACHER", AR(`المعلومة المفتاحية هنا هي: ${trigger}`)),
        SPEAKER("TEACHER", AR("هذه المعلومة ستقودنا إلى الإجابة الصحيحة."))
      ]
    },
    {
      id: "ANSWER_PROPOSAL",
      label: SCENE_DEFINITIONS[1].label,
      visual: visualCard("الإجابة الصحيحة", `الخيار ${answer}: ${correctArabic}`, "✅"),
      dialogue: [
        SPEAKER("TEACHER", AR(`الإجابة الصحيحة هي الخيار ${answer}: ${correctArabic}.`)),
        SPEAKER("TEACHER", AR("لكن لا نكتفي بالإجابة؛ الآن سنشرح لماذا هي صحيحة."))
      ]
    },
    {
      id: "CLINICAL_REASONING",
      label: SCENE_DEFINITIONS[2].label,
      visual: visualCard("الشرح والسبب", reasoning, "🧠"),
      dialogue: [
        SPEAKER("TEACHER", AR("الآن نربط المعلومة بالآلية أو المنطق السريري خطوة بخطوة.")),
        SPEAKER("TEACHER", AR(reasoning)),
        SPEAKER("TEACHER", AR("إذا فهمت السبب، تستطيع حل السؤال حتى لو تغيّرت صياغته."))
      ]
    },
    {
      id: "DISTRACTORS",
      label: SCENE_DEFINITIONS[3].label,
      visual: `<div class="teaching-graphic options-graphic" dir="rtl">
        <div class="graphic-icon">🎯</div>
        <div class="graphic-title">تمييز البدائل</div>
        <div class="option-grid">${question.options.map((option, index) =>
          `<div class="mini-option ${option.letter === answer ? "correct" : "wrong"}"><b>${esc(option.letter)}</b><span>${esc(question.arabic_options[index])}</span></div>`
        ).join("")}</div>
      </div>`,
      dialogue: [
        SPEAKER("TEACHER", AR("الآن نراجع البدائل. معرفة سبب الخطأ مهمة مثل معرفة سبب الصواب.")),
        ...distractorLines,
        SPEAKER("TEACHER", AR(`إذن الخيار ${answer} يبقى لأنه الوحيد الذي ينسجم مع المعلومة المفتاحية والشرح.`))
      ]
    },
    {
      id: "EXAM_TRAP",
      label: SCENE_DEFINITIONS[4].label,
      visual: visualCard("فخ الامتحان", `لا تنسَ: ${trigger}`, "⚠️"),
      dialogue: [
        SPEAKER("TEACHER", AR("انتبه لفخ شائع: قد يبدو أحد البدائل صحيحاً جزئياً، لكن المعلومة المفتاحية هي التي تحسم السؤال.")),
        SPEAKER("TEACHER", AR(`عندما ترى: ${trigger}، ارجع مباشرة إلى القاعدة التي شرحناها.`)),
        SPEAKER("TEACHER", AR("لا تعقّد السؤال أكثر من اللازم، ولا تحفظ الإجابة بمعزل عن السبب."))
      ]
    },
    {
      id: "TAKE_HOME",
      label: SCENE_DEFINITIONS[5].label,
      visual: visualCard("قاعدة واحدة تحفظها", memory, "📌"),
      dialogue: [
        SPEAKER("TEACHER", AR(`الخلاصة: ${memory}`)),
        SPEAKER("TEACHER", AR(`الإجابة الصحيحة: الخيار ${answer} — ${correctArabic}.`)),
        SPEAKER("TEACHER", AR("احفظ القاعدة مع السبب، وليس حرف الخيار فقط. هكذا تقدر تحل أسئلة جديدة من نفس الفكرة."))
      ]
    }
  ];
}
