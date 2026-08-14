import question from "./data/sample-question.json" with { type: "json" };

const q = question;
let currentScene = 0;

/* =========================================
   MEDICAL AI TEACHER
   Structured bilingual dialogue engine
   ========================================= */

const AR = (text) => ({
  type: "ar",
  text
});

const EN = (text) => ({
  type: "en",
  text
});

const SPEAKER = (name, ...parts) => ({
  type: "speaker",
  name,
  parts
});


/* =========================================
   TEACHING SCENES
   ========================================= */

const scenes = [

  /* ================= SCENE 01 ================= */

  {
    label: "SCENE 01 · QUESTION",

    visual: `
      <div class="flow">
        CLINICAL QUESTION<br>
        ↓<br>
        READ THE CLUES<br>
        ↓<br>
        IDENTIFY WHAT IS BEING TESTED
      </div>
    `,

    dialogue: [

      SPEAKER(
        "MAHER",
        AR("دكتور، قبل ما نختار الإجابة، خلينا نفهم السؤال أول.")
      ),

      SPEAKER(
        "DR. ANAS",
        AR("السؤال يسأل عن الترتيب الحقيقي لمسار الجهاز الهضمي.")
      ),

      SPEAKER(
        "TEACHER",
        AR("ممتاز. لا تحفظ الاختيار مباشرة. أول شيء حدّد المسار الطبيعي.")
      )

    ]
  },


  /* ================= SCENE 02 ================= */

  {
    label: "SCENE 02 · ANSWER PROPOSAL",

    visual: `
      <div class="flow">
        STOMACH<br>
        ↓<br>
        SMALL BOWEL<br>
        ↓<br>
        COLON
      </div>
    `,

    dialogue: [

      SPEAKER(
        "DR. ANAS",
        AR("أنا أميل إلى الخيار C.")
      ),

      SPEAKER(
        "DR. ANAS",
        EN("Stomach → Small bowel → Colon")
      ),

      SPEAKER(
        "TEACHER",
        AR("جيد. الآن لازم نثبت لماذا C صحيحة.")
      )

    ]
  },


  /* ================= SCENE 03 ================= */

  {
    label: "SCENE 03 · CLINICAL REASONING",

    visual: `
      <div class="flow">
        STOMACH<br>
        ↓<br>
        SMALL BOWEL<br>
        ↓<br>
        COLON<br><br>
        <small>Normal physiological sequence</small>
      </div>
    `,

    dialogue: [

      SPEAKER(
        "TEACHER",
        AR("حسب المصدر، الخيار C يصف المسار الفسيولوجي الطبيعي.")
      ),

      SPEAKER(
        "TEACHER",
        AR("الطعام ينتقل من المعدة إلى الأمعاء الدقيقة ثم إلى القولون.")
      ),

      SPEAKER(
        "MAHER",
        AR("يعني المفتاح هو ترتيب الجهاز الهضمي الطبيعي.")
      ),

      SPEAKER(
        "TEACHER",
        AR("بالضبط.")
      )

    ]
  },


  /* ================= SCENE 04 ================= */

  {
    label: "SCENE 04 · DISTRACTORS",

    visual: `
      <div class="flow">
        ❌ A<br>
        ❌ B<br>
        ✅ C<br>
        ❌ D<br>
        ❌ E
      </div>
    `,

    dialogue: [

      SPEAKER(
        "TEACHER",
        AR("الخيارات الأخرى تغيّر أو تعكس ترتيب المسار الطبيعي.")
      ),

      SPEAKER(
        "A",
        EN("Stomach → Colon → Small bowel")
      ),

      SPEAKER(
        "TEACHER",
        AR("❌ ترتيب غير صحيح.")
      ),

      SPEAKER(
        "B",
        EN("Colon → Small bowel → Stomach")
      ),

      SPEAKER(
        "TEACHER",
        AR("❌ ترتيب معكوس بالنسبة للمسار الطبيعي.")
      ),

      SPEAKER(
        "D",
        EN("Small bowel → Stomach → Colon")
      ),

      SPEAKER(
        "TEACHER",
        AR("❌ يبدأ من الأمعاء الدقيقة بدل المعدة.")
      ),

      SPEAKER(
        "E",
        EN("Small bowel → Colon → Stomach")
      ),

      SPEAKER(
        "TEACHER",
        AR("❌ لا يمثل التسلسل الطبيعي.")
      )

    ]
  },


  /* ================= SCENE 05 ================= */

  {
    label: "SCENE 05 · EXAM TRAP",

    visual: `
      <div class="flow">
        ⚠️ EXAM TRAP<br><br>
        DO NOT OVERTHINK<br>
        ↓<br>
        FOLLOW NORMAL PHYSIOLOGY
      </div>
    `,

    dialogue: [

      SPEAKER(
        "MAHER",
        AR("وين الفخ بالسؤال؟")
      ),

      SPEAKER(
        "TEACHER",
        AR("الفخ إنك تنجذب للخيارات التي تحتوي على أعضاء صحيحة، لكن الترتيب الكامل هو المهم.")
      ),

      SPEAKER(
        "TEACHER",
        AR("لما يكون السؤال عن المسار الطبيعي، ارجع إلى:")
      ),

      SPEAKER(
        "TEACHER",
        EN("Normal physiology")
      ),

      SPEAKER(
        "TEACHER",
        AR("ولا تحفظ حرف الإجابة فقط.")
      )

    ]
  },


  /* ================= SCENE 06 ================= */

  {
    label: "SCENE 06 · TAKE HOME",

    visual: `
      <div class="flow">

        🎯 TRIGGER<br>
        Normal GI sequence<br><br>

        🧠 MEMORY ANCHOR<br>
        STOMACH → SMALL BOWEL → COLON<br><br>

        ANSWER: C

      </div>
    `,

    dialogue: [

      SPEAKER(
        "TEACHER",
        AR("احفظها كـ:")
      ),

      SPEAKER(
        "TEACHER",
        EN("Memory anchor")
      ),

      SPEAKER(
        "TEACHER",
        EN("Stomach → Small bowel → Colon")
      ),

      SPEAKER(
        "TEACHER",
        AR("إذن الإجابة الصحيحة هي C.")
      ),

      SPEAKER(
        "DR. ANAS",
        AR("واضح. أفهم المسار أولاً بدل ما أحفظ الحرف.")
      ),

      SPEAKER(
        "TEACHER",
        AR("وهذا هو المطلوب في:")
      ),

      SPEAKER(
        "TEACHER",
        EN("Clinical reasoning")
      )

    ]
  }

];


/* =========================================
   QUESTION RENDERER
   ========================================= */

function renderQuestion() {

  const questionEl = document.querySelector("#question");
  const arabicEl = document.querySelector("#arabic");
  const optionsEl = document.querySelector("#options");

  if (!questionEl || !arabicEl || !optionsEl) {
    return;
  }

  questionEl.textContent = q.question;
  arabicEl.textContent = q.arabic;

  optionsEl.innerHTML = "";

  q.options.forEach((item) => {

    const option = document.createElement("div");

    option.className = "option";

    if (item.letter === q.source_indicated_answer) {
      option.classList.add("correct");
    }

    const letter = document.createElement("span");

    letter.className = "letter";
    letter.dir = "ltr";
    letter.textContent = `${item.letter}.`;

    const text = document.createElement("span");

    text.className = "option-text";
    text.dir = "ltr";
    text.textContent = item.text;

    option.appendChild(letter);
    option.appendChild(text);

    if (item.letter === q.source_indicated_answer) {

      const check = document.createElement("span");

      check.className = "option-check";
      check.dir = "ltr";
      check.textContent = "✓";

      option.appendChild(check);
    }

    optionsEl.appendChild(option);

  });
}


/* =========================================
   DIALOGUE RENDERER
   ========================================= */

function renderDialogue(dialogue) {
  const container = document.createElement("div");
  container.className = "dialogue-list";

  let currentBlock = null;
  let currentSpeaker = null;

  dialogue.forEach((item) => {

    if (item.name !== currentSpeaker) {
      currentSpeaker = item.name;

      currentBlock = document.createElement("div");
      currentBlock.className = "dialogue-block";

      const speakerName = document.createElement("div");
      speakerName.className = "speaker-name";
      speakerName.dir = "ltr";
      speakerName.textContent = `${item.name}:`;

      currentBlock.appendChild(speakerName);
      container.appendChild(currentBlock);
    }

    item.parts.forEach((part) => {
      const line = document.createElement("div");

      if (part.type === "ar") {
        line.className = "arabic-line";
        line.dir = "rtl";
        line.lang = "ar";
      } else {
        line.className = "english-line";
        line.dir = "ltr";
        line.lang = "en";
      }

      line.textContent = part.text;
      currentBlock.appendChild(line);
    });

  });

  return container;
}


/* =========================================
   SCENE RENDERER
   ========================================= */

function renderScene() {

  const scene = scenes[currentScene];

  const label = document.querySelector("#sceneLabel");
  const visual = document.querySelector("#visual");
  const dialogue = document.querySelector("#dialogue");
  const next = document.querySelector("#next");

  if (!label || !visual || !dialogue || !next) {
    return;
  }

  label.textContent = scene.label;

  visual.innerHTML = scene.visual;

  dialogue.innerHTML = "";

  dialogue.appendChild(
    renderDialogue(scene.dialogue)
  );

  next.textContent =
    currentScene === scenes.length - 1
      ? "Restart teaching →"
      : "Next teaching scene →";
}


/* =========================================
   NEXT SCENE
   ========================================= */

const nextButton = document.querySelector("#next");

if (nextButton) {

  nextButton.addEventListener("click", () => {

    if (currentScene >= scenes.length - 1) {

      currentScene = 0;

    } else {

      currentScene++;

    }

    renderScene();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });

}


/* =========================================
   START APPLICATION
   ========================================= */

renderQuestion();

renderScene();
