export const SCENE_DEFINITIONS = [
  { id: "QUESTION", label: "SCENE 01 · QUESTION" },
  { id: "ANSWER_PROPOSAL", label: "SCENE 02 · ANSWER" },
  { id: "CLINICAL_REASONING", label: "SCENE 03 · CLINICAL REASONING" },
  { id: "DISTRACTORS", label: "SCENE 04 · DISTRACTORS" },
  { id: "EXAM_TRAP", label: "SCENE 05 · EXAM TRAP" },
  { id: "TAKE_HOME", label: "SCENE 06 · TAKE HOME" }
];

const safeText = (value, fallback = "") => typeof value === "string" && value.trim() ? value.trim() : fallback;
export const AR = (text) => ({ type: "ar", text: safeText(text) });
export const EN = (text) => ({ type: "en", text: safeText(text) });
export const SPEAKER = (name, ...parts) => ({ name, parts });

export function validateQuestion(question) {
  if (!question || typeof question !== "object") throw new Error("Question must be an object.");
  if (!safeText(question.question)) throw new Error("Missing English question.");
  if (!safeText(question.arabic)) throw new Error("Missing Arabic question.");
  if (!Array.isArray(question.options) || question.options.length < 2) throw new Error("Question must contain at least two options.");
  if (!safeText(question.source_indicated_answer)) throw new Error("Missing source_indicated_answer.");
  if (!question.options.some((option) => option.letter === question.source_indicated_answer)) throw new Error("source_indicated_answer does not match an option.");
  return true;
}

export function buildScenes(question) {
  validateQuestion(question);
  const teaching = question.teaching || {};
  const answer = question.source_indicated_answer;
  const correctOption = question.options.find((option) => option.letter === answer);
  const correctText = safeText(correctOption?.text, "Correct option");
  const trigger = Array.isArray(teaching.trigger) ? safeText(teaching.trigger[0], "Identify the key clinical clue.") : safeText(teaching.trigger, "Identify the key clinical clue.");
  const reasoning = safeText(teaching.reasoning, "Use the clinical information and source explanation to justify the answer.");
  const distractors = safeText(teaching.distractors, "Compare the alternatives with the clinical reasoning and eliminate the choices that conflict with it.");
  const memory = safeText(teaching.memory_anchor, correctText);
  const wrongOptions = question.options.filter((option) => option.letter !== answer);

  return [
    { id: "QUESTION", label: SCENE_DEFINITIONS[0].label, visual: "Show the Arabic question, English medical terminology where useful, all options, and highlight the key clinical clue.", dialogue: [
      SPEAKER("TEACHER", AR(question.arabic)), SPEAKER("TEACHER", EN(question.question)),
      SPEAKER("TEACHER", AR("أول خطوة: نحدد ما الذي يسأل عنه السؤال ونلتقط الـclinical clue الأساسي.")), SPEAKER("TEACHER", EN(trigger))
    ]},
    { id: "ANSWER_PROPOSAL", label: SCENE_DEFINITIONS[1].label, visual: `Reveal option ${answer} clearly; the teacher remains the only speaker.`, dialogue: [
      SPEAKER("TEACHER", AR(`الإجابة الصحيحة هي الخيار ${answer}.`)), SPEAKER("TEACHER", EN(`${answer}. ${correctText}`)), SPEAKER("TEACHER", AR("لكن لا نحفظ حرف الإجابة؛ نثبت السبب السريري أولاً."))
    ]},
    { id: "CLINICAL_REASONING", label: SCENE_DEFINITIONS[2].label, visual: "Use a relevant anatomy illustration, clinical diagram, ECG, pathway, table, or flowchart when it helps explain the supplied reasoning.", dialogue: [
      SPEAKER("TEACHER", AR("الآن نشرح لماذا هذه الإجابة صحيحة، خطوة بخطوة.")), SPEAKER("TEACHER", EN(reasoning)), SPEAKER("TEACHER", AR("الفكرة الأساسية هي فهم الـclinical reasoning، وليس حفظ الخيار فقط."))
    ]},
    { id: "DISTRACTORS", label: SCENE_DEFINITIONS[3].label, visual: "Display alternatives one by one and visually mark the reasoning that eliminates each distractor.", dialogue: [
      SPEAKER("TEACHER", AR("الآن نراجع لماذا الخيارات الأخرى ليست الأفضل.")), SPEAKER("TEACHER", EN(distractors)),
      ...wrongOptions.map((option) => SPEAKER("TEACHER", EN(`${option.letter}. ${option.text}`), AR("❌ هذا الخيار لا يطابق المفتاح السريري أو الترتيب الذي يشرحه المصدر."))),
      SPEAKER("TEACHER", AR("بهذه الطريقة تستطيع التعرف على الـdistractor حتى لو تغيرت صياغة السؤال."))
    ]},
    { id: "EXAM_TRAP", label: SCENE_DEFINITIONS[4].label, visual: "Warning-card visual that zooms into the trigger word and shows the common exam trap without adding unsupported facts.", dialogue: [
      SPEAKER("TEACHER", AR("انتبه إلى الفخ الامتحاني.")), SPEAKER("TEACHER", EN(`Trigger: ${trigger}`)), SPEAKER("TEACHER", AR("لا تنجذب لخيار يبدو صحيحاً جزئياً وتنسى المعلومة المفتاحية. ارجع دائماً للـclinical clue."))
    ]},
    { id: "TAKE_HOME", label: SCENE_DEFINITIONS[5].label, visual: `Clean recap card with trigger, memory anchor, correct answer ${answer}, and a concise medical diagram when appropriate.`, dialogue: [
      SPEAKER("TEACHER", AR("الخلاصة التي نريد تثبيتها:")), SPEAKER("TEACHER", EN(memory)), SPEAKER("TEACHER", AR(`الإجابة النهائية: ${answer} — ${correctText}.`)), SPEAKER("TEACHER", AR("افهم الفكرة، اربطها بالـvisual، ثم ثبت الـtrigger في الذاكرة."))
    ]}
  ];
}
