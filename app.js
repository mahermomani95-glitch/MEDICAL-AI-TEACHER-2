import question from "./data/sample-question.json" with { type: "json" };

const q = question;
let currentScene = 0;

const LTR = (text) => `<span dir="ltr" class="ltr-text">${text}</span>`;

const scenes = [
  {
    label: "SCENE 01 · QUESTION",
    visual: `
      <div class="flow">
        Clinical Question<br>
        ↓<br>
        Read the clues<br>
        ↓<br>
        Identify what is being tested
      </div>
    `,
    dialogue: `
      <p dir="rtl">
        <strong dir="ltr">MAHER:</strong>
        دكتور، قبل ما نختار الإجابة، خلينا نفهم السؤال أول.
      </p>

      <p dir="rtl">
        <strong dir="ltr">DR. ANAS:</strong>
        السؤال يسأل عن الترتيب الحقيقي لمسار الجهاز الهضمي.
      </p>

      <p dir="rtl">
        <strong dir="ltr">TEACHER:</strong>
        ممتاز. لا تحفظ الاختيار مباشرة. أول شيء حدّد المسار الطبيعي.
      </p>
    `
  },

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
    dialogue: `
      <p dir="rtl">
        <strong dir="ltr">DR. ANAS:</strong>
        أنا أميل إلى الخيار C.
      </p>

      <p dir="rtl">
        <strong dir="ltr">DR. ANAS:</strong>
        ${LTR("Stomach → Small bowel → Colon")}
      </p>

      <p dir="rtl">
        <strong dir="ltr">TEACHER:</strong>
        جيد. الآن لازم نثبت لماذا C صحيحة.
      </p>
    `
  },

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
    dialogue: `
      <p dir="rtl">
        <strong dir="ltr">TEACHER:</strong>
        حسب المصدر، الخيار C يصف المسار الفسيولوجي الطبيعي.
      </p>

      <p dir="rtl">
        الطعام ينتقل من المعدة إلى الأمعاء الدقيقة ثم إلى القولون.
      </p>

      <p dir="rtl">
        <strong dir="ltr">MAHER:</strong>
        يعني المفتاح هو ترتيب الجهاز الهضمي الطبيعي.
      </p>

      <p dir="rtl">
        <strong dir="ltr">TEACHER:</strong>
        بالضبط.
      </p>
    `
  },

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
    dialogue: `
      <p dir="rtl">
        <strong dir="ltr">TEACHER:</strong>
        الخيارات الأخرى تغيّر أو تعكس ترتيب المسار الطبيعي.
      </p>

      <p dir="ltr">
        <strong>A:</strong>
        Stomach → Colon → Small bowel
      </p>

      <p dir="rtl">
        ❌ ترتيب غير صحيح.
      </p>

      <p dir="ltr">
        <strong>B:</strong>
        Colon → Small bowel → Stomach
      </p>

      <p dir="rtl">
        ❌ ترتيب معكوس بالنسبة للمسار الطبيعي.
      </p>

      <p dir="ltr">
        <strong>D:</strong>
        Small bowel → Stomach → Colon
      </p>

      <p dir="rtl">
        ❌ يبدأ من الأمعاء الدقيقة بدل المعدة.
      </p>

      <p dir="ltr">
        <strong>E:</strong>
        Small bowel → Colon → Stomach
      </p>

      <p dir="rtl">
        ❌ لا يمثل التسلسل الطبيعي.
      </p>
    `
  },

  {
    label: "SCENE 05 · EXAM TRAP",
    visual: `
      <div class="flow">
        ⚠️ EXAM TRAP<br><br>
        Do not overthink the sequence<br>
        ↓<br>
        Follow normal physiology
      </div>
    `,
    dialogue: `
      <p dir="rtl">
        <strong dir="ltr">MAHER:</strong>
        وين الفخ بالسؤال؟
      </p>

      <p dir="rtl">
        <strong dir="ltr">TEACHER:</strong>
        الفخ إنك تنجذب للخيارات التي تحتوي على أعضاء صحيحة،
        لكن الترتيب الكامل هو المهم.
      </p>

      <p dir="rtl">
        <strong dir="ltr">TEACHER:</strong>
        لما يكون السؤال عن المسار الطبيعي، ارجع للـ
        ${LTR("normal physiology")}
        الأساسية.
      </p>
    `
  },

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
    dialogue: `
      <p dir="rtl">
        <strong dir="ltr">TEACHER:</strong>
        احفظها كـ
        ${LTR("memory anchor")}
        :
      </p>

      <p dir="ltr">
        <strong>Stomach → Small bowel → Colon</strong>
      </p>

      <p dir="rtl">
        <strong dir="ltr">TEACHER:</strong>
        إذن الإجابة الصحيحة هي C.
      </p>

      <p dir="rtl">
        <strong dir="ltr">DR. ANAS:</strong>
        واضح. أفهم المسار أولاً بدل ما أحفظ الحرف.
      </p>

      <p dir="rtl">
        <strong dir="ltr">TEACHER:</strong>
        وهذا هو المطلوب في الـ
        ${LTR("clinical reasoning")}
        .
      </p>
    `
  }
];


/* =========================
   QUESTION
========================= */

function renderQuestion() {

  document.querySelector("#question").textContent =
    q.question;

  document.querySelector("#arabic").textContent =
    q.arabic;

  const options =
    document.querySelector("#options");

  options.innerHTML = "";

  q.options.forEach((item) => {

    const el = document.createElement("div");

    el.className = "option";

    if (item.letter === q.source_indicated_answer) {
      el.classList.add("correct");
    }

    el.innerHTML = `
      <span class="letter">${item.letter}.</span>
      ${item.text}
      ${
        item.letter === q.source_indicated_answer
          ? `<span style="float:right">✓</span>`
          : ""
      }
    `;

    options.appendChild(el);

  });
}


/* =========================
   SCENE
========================= */

function renderScene() {

  const scene = scenes[currentScene];

  document.querySelector("#sceneLabel").textContent =
    scene.label;

  document.querySelector("#visual").innerHTML =
    scene.visual;

  document.querySelector("#dialogue").innerHTML =
    scene.dialogue;

  const button =
    document.querySelector("#next");

  button.textContent =
    currentScene === scenes.length - 1
      ? "Restart teaching →"
      : "Next teaching scene →";
}


/* =========================
   NEXT
========================= */

document.querySelector("#next").addEventListener(
  "click",
  () => {

    if (currentScene === scenes.length - 1) {
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


/* =========================
   START
========================= */

renderQuestion();
renderScene();
