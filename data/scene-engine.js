export const SCENE_DEFINITIONS = [
  { id: "QUESTION", label: "SCENE 01 · QUESTION" },
  { id: "ANSWER_PROPOSAL", label: "SCENE 02 · ANSWER PROPOSAL" },
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
  if (!question.options.some((o) => o.letter === question.source_indicated_answer)) throw new Error("Answer does not match an option.");
  return true;
}

export function buildScenes(question) {
  validateQuestion(question);
  const teaching = question.teaching || {};
  const answer = question.source_indicated_answer;
  const correct = question.options.find((o) => o.letter === answer);
  const correctText = safeText(correct?.text, "Correct option");
  const trigger = Array.isArray(teaching.trigger) ? safeText(teaching.trigger[0], "Identify the key clinical clue.") : safeText(teaching.trigger, "Identify the key clinical clue.");
  const reasoning = safeText(teaching.reasoning, "Use the clinical information and source explanation to justify the answer.");
  const distractors = safeText(teaching.distractors, "Compare each alternative with the clinical reasoning.");
  const memory = safeText(teaching.memory_anchor, correctText);
  const wrong = question.options.filter((o) => o.letter !== answer);

  return [
    { id: "QUESTION", label: SCENE_DEFINITIONS[0].label, visual: `<div class="flow">CLINICAL QUESTION<br>↓<br>READ THE CLUES<br>↓<br>IDENTIFY WHAT IS BEING TESTED</div>`, dialogue: [
      SPEAKER("MAHER", AR("دكتور، قبل ما نختار الإجابة، خلينا نفهم السؤال أول.")),
      SPEAKER("DR. ANAS", AR("خلينا نحدد المطلوب من السؤال ونلتقط أهم clinical clue.")),
      SPEAKER("TEACHER", AR("ممتاز. لا تحفظ حرف الإجابة مباشرة؛ افهم أولاً الفكرة التي يتم اختبارها.")),
      SPEAKER("TEACHER", EN(trigger))
    ]},
    { id: "ANSWER_PROPOSAL", label: SCENE_DEFINITIONS[1].label, visual: `<div class="flow">DR. ANAS<br>↓<br>PROPOSES ANSWER<br>↓<br>${answer}</div>`, dialogue: [
      SPEAKER("DR. ANAS", AR(`أنا أميل إلى الخيار ${answer}.`)), SPEAKER("DR. ANAS", EN(correctText)), SPEAKER("TEACHER", AR(`جيد. اختيار ${answer} يحتاج الآن إلى تبرير سريري واضح.`))
    ]},
    { id: "CLINICAL_REASONING", label: SCENE_DEFINITIONS[2].label, visual: `<div class="flow">CLINICAL CLUE<br>↓<br>REASONING<br>↓<br>CORRECT ANSWER</div>`, dialogue: [
      SPEAKER("TEACHER", AR("الآن نثبت لماذا الإجابة صحيحة، خطوة بخطوة.")), SPEAKER("TEACHER", EN(reasoning)), SPEAKER("MAHER", AR("يعني أفهم الـclinical reasoning بدل ما أحفظ حرف الإجابة.")), SPEAKER("TEACHER", AR("بالضبط. إذا فهمت السبب تستطيع حل صيغة مختلفة من نفس الفكرة."))
    ]},
    { id: "DISTRACTORS", label: SCENE_DEFINITIONS[3].label, visual: `<div class="flow">OPTIONS<br>↓<br>COMPARE<br>↓<br>ELIMINATE DISTRACTORS</div>`, dialogue: [
      SPEAKER("TEACHER", AR("لا يكفي أن تعرف لماذا الصحيح صحيح؛ لازم تعرف لماذا البدائل خاطئة.")), SPEAKER("TEACHER", EN(distractors)),
      ...wrong.map((o) => SPEAKER("TEACHER", EN(`${o.letter}. ${o.text}`), AR("❌ لا نختار هذا الخيار لأنه لا يطابق المفتاح السريري أو الترتيب الصحيح."))),
      SPEAKER("MAHER", AR("هيك أقدر أتعرف على الـdistractor حتى لو تغيّرت صياغة الخيار."))
    ]},
    { id: "EXAM_TRAP", label: SCENE_DEFINITIONS[4].label, visual: `<div class="flow">⚠️ EXAM TRAP<br><br>${trigger}<br><br>↓<br><br>DO NOT OVERTHINK</div>`, dialogue: [
      SPEAKER("MAHER", AR("وين الفخ في السؤال؟")), SPEAKER("TEACHER", AR("الفخ أن تنجذب لخيار يبدو صحيحاً جزئياً وتنسى الـclinical clue الأساسي.")), SPEAKER("TEACHER", EN(`Trigger: ${trigger}`)), SPEAKER("TEACHER", AR("ارجع دائماً للمعلومة المفتاحية قبل أن تختار."))
    ]},
    { id: "TAKE_HOME", label: SCENE_DEFINITIONS[5].label, visual: `<div class="flow">🎯 TRIGGER<br>${trigger}<br><br>🧠 MEMORY ANCHOR<br>${memory}<br><br>ANSWER: ${answer}</div>`, dialogue: [
      SPEAKER("TEACHER", AR("خلينا نختمها بقاعدة واحدة سهلة للحفظ.")), SPEAKER("TEACHER", EN(memory)), SPEAKER("TEACHER", AR(`الإجابة الصحيحة هي ${answer}.`)), SPEAKER("DR. ANAS", AR("واضح. أفهم الفكرة أولاً، وبعدها أثبتها في الذاكرة.")), SPEAKER("TEACHER", AR("هذا هو الهدف: فهم السؤال، التفكير السريري، ثم تثبيت المعلومة."))
    ]}
  ];
}
