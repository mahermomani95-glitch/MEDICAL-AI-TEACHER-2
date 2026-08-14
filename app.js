import question from "./data/sample-question.json" with { type: "json" };

const q = question;
let currentScene = 0;

/* =========================================
   MEDICAL AI TEACHER
   Dynamic Teaching Engine
   JSON → 6 Teaching Scenes
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
  name,
  parts
});


/* =========================================
   BUILD SCENES FROM QUESTION JSON
   ========================================= */

function buildScenes(question) {

  const teaching = question.teaching || {};

  const answer =
    question.source_indicated_answer || "?";

  const correctOption =
    question.options?.find(
      option => option.letter === answer
    );

  const correctText =
    correctOption?.text || "";

  const trigger =
    teaching.trigger?.[0] ||
    "Identify the key clinical clue.";

  const reasoning =
    teaching.reasoning ||
    "Use the information provided in the source.";

  const distractors =
    teaching.distractors ||
    "Compare each alternative with the correct clinical reasoning.";

  const memory =
    teaching.memory_anchor ||
    correctText;


  return [

    /* =====================================
       SCENE 01 — QUESTION
       ===================================== */

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
          AR(
            "دكتور، قبل ما نختار الإجابة، خلينا نفهم السؤال أول."
          )
        ),

        SPEAKER(
          "DR. ANAS",
          AR(
            "خلينا نحدد أولاً شو المطلوب من السؤال، وبعدها نقارن الخيارات."
          )
        ),

        SPEAKER(
          "TEACHER",
          AR(
            "ممتاز. لا تحفظ حرف الإجابة مباشرة. أول شيء حدّد الـclinical clue والمفهوم الذي يتم اختباره."
          )
        ),

        SPEAKER(
          "TEACHER",
          EN(trigger)
        )

      ]
    },


    /* =====================================
       SCENE 02 — ANSWER PROPOSAL
       ===================================== */

    {
      label: "SCENE 02 · ANSWER PROPOSAL",

      visual: `
        <div class="flow">
          DR. ANAS<br>
          ↓<br>
          PROPOSES ANSWER<br>
          ↓<br>
          ${answer}
        </div>
      `,

      dialogue: [

        SPEAKER(
          "DR. ANAS",
          AR(
            `أنا أميل إلى الخيار ${answer}.`
          )
        ),

        SPEAKER(
          "DR. ANAS",
          EN(
            correctText
          )
        ),

        SPEAKER(
          "TEACHER",
          AR(
            `جيد. اخترنا ${answer}، لكن لا يكفي أن نعرف الحرف. الآن لازم نثبت لماذا هو الصحيح.`
          )
        )

      ]
    },


    /* =====================================
       SCENE 03 — CLINICAL REASONING
       ===================================== */

    {
      label: "SCENE 03 · CLINICAL REASONING",

      visual: `
        <div class="flow">
          CLINICAL CLUE<br>
          ↓<br>
          REASONING<br>
          ↓<br>
          CORRECT ANSWER
        </div>
      `,

      dialogue: [

        SPEAKER(
          "TEACHER",
          AR(
            "الآن نركز على طريقة التفكير، وليس على حفظ الإجابة فقط."
          )
        ),

        SPEAKER(
          "TEACHER",
          EN(
            reasoning
          )
        ),

        SPEAKER(
          "MAHER",
          AR(
            "يعني المفتاح هو فهم الـclinical reasoning وراء الإجابة."
          )
        ),

        SPEAKER(
          "TEACHER",
          AR(
            "بالضبط. إذا فهمت السبب، تستطيع الوصول للإجابة حتى لو تغيرت صيغة السؤال."
          )
        )

      ]
    },


    /* =====================================
       SCENE 04 — DISTRACTORS
       ===================================== */

    {
      label: "SCENE 04 · DISTRACTORS",

      visual: `
        <div class="flow">
          OPTIONS<br>
          ↓<br>
          COMPARE<br>
          ↓<br>
          ELIMINATE DISTRACTORS
        </div>
      `,

      dialogue: [

        SPEAKER(
          "TEACHER",
          AR(
            "الآن نراجع لماذا الخيارات الأخرى ليست الأفضل."
          )
        ),

        SPEAKER(
          "TEACHER",
          EN(
            distractors
          )
        ),

        SPEAKER(
          "MAHER",
          AR(
            "إذن لازم أفهم لماذا الخيارات الخاطئة خاطئة، وليس فقط لماذا الصحيحة صحيحة."
          )
        ),

        SPEAKER(
          "TEACHER",
          AR(
            "بالضبط. هذا يقلل احتمال الوقوع في الـdistractors في الامتحان."
          )
        )

      ]
    },


    /* =====================================
       SCENE 05 — EXAM TRAP
       ===================================== */

    {
      label: "SCENE 05 · EXAM TRAP",

      visual: `
        <div class="flow">
          ⚠️ EXAM TRAP<br><br>
          ${trigger}<br><br>
          ↓<br><br>
          DO NOT OVERTHINK
        </div>
      `,

      dialogue: [

        SPEAKER(
          "MAHER",
          AR(
            "وين الفخ في السؤال؟"
          )
        ),

        SPEAKER(
          "TEACHER",
          AR(
            "الفخ غالباً يكون في التركيز على كلمة أو خيار جذاب بدل فهم الفكرة الأساسية."
          )
        ),

        SPEAKER(
          "TEACHER",
          EN(
            trigger
          )
        ),

        SPEAKER(
          "TEACHER",
          AR(
            "لذلك ارجع دائماً إلى الـclinical reasoning قبل اختيار الإجابة."
          )
        )

      ]
    },


    /* =====================================
       SCENE 06 — TAKE HOME
       ===================================== */

    {
      label: "SCENE 06 · TAKE HOME",

      visual: `
        <div class="flow">

          🎯 TRIGGER<br>
          ${trigger}<br><br>

          🧠 MEMORY ANCHOR<br>
          ${memory}<br><br>

          ANSWER: ${answer}

        </div>
      `,

      dialogue: [

        SPEAKER(
          "TEACHER",
          AR(
            "خلينا نختم الفكرة بطريقة سهلة للحفظ."
          )
        ),

        SPEAKER(
          "TEACHER",
          EN(
            "Memory anchor"
          )
        ),

        SPEAKER(
          "TEACHER",
          EN(
            memory
          )
        ),

        SPEAKER(
          "TEACHER",
          AR(
            `إذن الإجابة الصحيحة هي ${answer}.`
          )
        ),

        SPEAKER(
          "DR. ANAS",
          AR(
            "واضح. الآن أفهم الفكرة قبل ما أحفظ الإجابة."
          )
        ),

        SPEAKER(
          "TEACHER",
          AR(
            "وهذا هو الهدف: فهم السؤال، التفكير السريري، ثم تثبيت المعلومة."
          )
        )

      ]
    }

  ];
}


/* =========================================
   QUESTION
   ========================================= */

function renderQuestion() {

  const questionEl =
    document.querySelector("#question");

  const arabicEl =
    document.querySelector("#arabic");

  const optionsEl =
    document.querySelector("#options");

  if (!questionEl || !arabicEl || !optionsEl) {
    return;
  }

  questionEl.textContent =
    q.question;

  arabicEl.textContent =
    q.arabic;

  optionsEl.innerHTML = "";

  q.options.forEach((item) => {

    const option =
      document.createElement("div");

    option.className = "option";

    if (
      item.letter ===
      q.source_indicated_answer
    ) {

      option.classList.add("correct");

    }

    const letter =
      document.createElement("span");

    letter.className = "letter";
    letter.dir = "ltr";

    letter.textContent =
      `${item.letter}.`;

    const text =
      document.createElement("span");

    text.className =
      "option-text";

    text.dir = "ltr";

    text.textContent =
      item.text;

    option.appendChild(letter);
    option.appendChild(text);

    if (
      item.letter ===
      q.source_indicated_answer
    ) {

      const check =
        document.createElement("span");

      check.className =
        "option-check";

      check.textContent = "✓";

      option.appendChild(check);

    }

    optionsEl.appendChild(option);

  });

}


/* =========================================
   DIALOGUE
   ========================================= */

function renderDialogue(dialogue) {

  const container =
    document.createElement("div");

  container.className =
    "dialogue-list";

  let currentBlock = null;
  let currentSpeaker = null;

  dialogue.forEach((item) => {

    if (
      item.name !== currentSpeaker
    ) {

      currentSpeaker =
        item.name;

      currentBlock =
        document.createElement("div");

      currentBlock.className =
        "dialogue-block";

      const speakerName =
        document.createElement("div");

      speakerName.className =
        "speaker-name";

      speakerName.dir = "ltr";

      speakerName.textContent =
        `${item.name}:`;

      currentBlock.appendChild(
        speakerName
      );

      container.appendChild(
        currentBlock
      );
    }


    item.parts.forEach((part) => {

      const line =
        document.createElement("div");

      if (part.type === "ar") {

        line.className =
          "arabic-line";

        line.dir = "rtl";

        line.lang = "ar";

      } else {

        line.className =
          "english-line";

        line.dir = "ltr";

        line.lang = "en";

      }

      line.textContent =
        part.text;

      currentBlock.appendChild(
        line
      );

    });

  });

  return container;
}


/* =========================================
   SCENE
   ========================================= */

const scenes =
  buildScenes(q);


function renderScene() {

  const scene =
    scenes[currentScene];

  const label =
    document.querySelector(
      "#sceneLabel"
    );

  const visual =
    document.querySelector(
      "#visual"
    );

  const dialogue =
    document.querySelector(
      "#dialogue"
    );

  const next =
    document.querySelector(
      "#next"
    );

  if (
    !label ||
    !visual ||
    !dialogue ||
    !next
  ) {
    return;
  }

  label.textContent =
    scene.label;

  visual.innerHTML =
    scene.visual;

  dialogue.innerHTML =
    "";

  dialogue.appendChild(
    renderDialogue(
      scene.dialogue
    )
  );

  next.textContent =
    currentScene ===
    scenes.length - 1

      ? "Restart teaching →"

      : "Next teaching scene →";

}


/* =========================================
   NEXT
   ========================================= */

const nextButton =
  document.querySelector("#next");

if (nextButton) {

  nextButton.addEventListener(
    "click",
    () => {

      if (
        currentScene >=
        scenes.length - 1
      ) {

        currentScene = 0;

      } else {

        currentScene++;

      }

      renderScene();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }
  );

}


/* =========================================
   START
   ========================================= */

renderQuestion();

renderScene();
