import question from "./data/sample-question.json" with { type: "json" };

const q = question;

let currentScene = 0;

const scenes = [
  {
    id: 1,
    label: "SCENE 01 · QUESTION",
    title: "Understand the question first",
    visual: `
      <div class="flow">
        <div>Clinical Question</div>
        <div>↓</div>
        <div>Read the wording</div>
        <div>↓</div>
        <div>Identify what is being tested</div>
      </div>
    `,
    dialogue: `
      <p><strong>MAHER:</strong> دكتور، قبل ما نختار الإجابة، خلينا نفهم السؤال.</p>

      <p><strong>DR. ANAS:</strong> السؤال يسأل عن الترتيب الحقيقي لمسار الجهاز الهضمي.</p>

      <p><strong>TEACHER:</strong> ممتاز. لا تحفظ الاختيار مباشرة. أول شيء حدّد المسار الطبيعي.</p>
    `
  },

  {
    id: 2,
    label: "SCENE 02 · ANSWER PROPOSAL",
    title: "Dr. Anas proposes an answer",
    visual: `
      <div class="flow">
        <div>STOMACH</div>
        <div>↓</div>
        <div>SMALL BOWEL</div>
        <div>↓</div>
        <div>COLON</div>
      </div>
    `,
    dialogue: `
      <p><strong>DR. ANAS:</strong> أنا أميل إلى الخيار C.</p>

      <p><strong>DR. ANAS:</strong> Stomach → Small bowel → Colon.</p>

      <p><strong>TEACHER:</strong> جيد. الآن لازم نثبت لماذا C صحيحة.</p>
    `
  },

  {
    id: 3,
    label: "SCENE 03 · CLINICAL REASONING",
    title: "Why is C correct?",
    visual: `
      <div class="flow">
        <div>STOMACH</div>
        <div>↓</div>
        <div>SMALL BOWEL</div>
        <div>↓</div>
        <div>COLON</div>
        <br>
        <small>Normal physiological sequence</small>
      </div>
    `,
    dialogue: `
      <p><strong>TEACHER:</strong> حسب المصدر، الخيار C يصف المسار الفسيولوجي الطبيعي:</p>

      <p>
        الطعام ينتقل من <strong>المعدة</strong>
        إلى <strong>الأمعاء الدقيقة</strong>
        ثم إلى <strong>القولون</strong>.
      </p>

      <p><strong>MAHER:</strong> يعني المفتاح هو ترتيب الجهاز الهضمي الطبيعي.</p>

      <p><strong>TEACHER:</strong> بالضبط.</p>
    `
  },

  {
    id: 4,
    label: "SCENE 04 · DISTRACTORS",
    title: "Why are the other options wrong?",
    visual: `
      <div class="flow">
        <div>❌ A</div>
        <div>❌ B</div>
        <div>✅ C</div>
        <div>❌ D</div>
        <div>❌ E</div>
      </div>
    `,
    dialogue: `
      <p><strong>TEACHER:</strong> الخيارات الأخرى تغيّر أو تعكس ترتيب المسار الطبيعي.</p>

      <p><strong>A:</strong> Stomach → Colon → Small bowel</p>
      <p>❌ ترتيب غير صحيح.</p>

      <p><strong>B:</strong> Colon → Small bowel → Stomach</p>
      <p>❌ ترتيب معكوس بالنسبة للمسار الطبيعي.</p>

      <p><strong>D:</strong> Small bowel → Stomach → Colon</p>
      <p>❌ يبدأ من الأمعاء الدقيقة بدل المعدة.</p>

      <p><strong>E:</strong> Small bowel → Colon → Stomach</p>
      <p>❌ أيضًا لا يمثل التسلسل الطبيعي.</p>
    `
  },

  {
    id: 5,
    label: "SCENE 05 · EXAM TRAP",
    title: "Exam trap",
    visual: `
      <div class="flow">
        <div>⚠️ EXAM TRAP</div>
        <br>
        <div>Do not overthink the sequence</div>
        <div>↓</div>
        <div>Follow normal physiology</div>
      </div>
    `,
    dialogue: `
      <p><strong>MAHER:</strong> وين الفخ بالسؤال؟</p>

      <p><strong>TEACHER:</strong> الفخ إنك تنجذب للخيارات التي تبدأ أو تنتهي بعضو صحيح، لكن الترتيب الكامل هو المهم.</p>

      <p><strong>TEACHER:</strong> لما يكون السؤال عن المسار الطبيعي، ارجع للـphysiology الأساسية.</p>
    `
  },

  {
    id: 6,
    label: "SCENE 06 · TAKE HOME",
    title: "Memory anchor",
    visual: `
      <div class="flow">
        <div>🎯 TRIGGER</div>
        <div>Normal GI sequence</div>
        <br>
        <div>🧠 MEMORY ANCHOR</div>
        <div>STOMACH → SMALL BOWEL → COLON</div>
        <br>
        <div>ANSWER: C</div>
      </div>
    `,
    dialogue: `
      <p><strong>TEACHER:</strong> احفظها كـmemory anchor:</p>

      <p>
        <strong>Stomach → Small bowel → Colon</strong>
      </p>

      <p><strong>TEACHER:</strong> إذن الإجابة الصحيحة هي <strong>C</strong>.</p>

      <p><strong>DR. ANAS:</strong> واضح. أفهم المسار أولًا بدل ما أحفظ الحرف.</p>

      <p><strong>TEACHER:</strong> وهذا هو المطلوب في الـclinical reasoning.</p>
    `
  }
];


/* =========================
   QUESTION
========================= */

function renderQuestion() {
  document.querySelector("#question").textContent = q.question;
  document.querySelector("#arabic").textContent = q.arabic;

  const options = document.querySelector("#options");

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

  const button = document.querySelector("#next");

  if (currentScene === scenes.length - 1) {
    button.textContent = "Restart teaching →";
  } else {
    button.textContent = "Next teaching scene →";
  }
}


/* =========================
   NEXT
========================= */

document.querySelector("#next").addEventListener("click", () => {

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

});


/* =========================
   START
========================= */

renderQuestion();
renderScene();
