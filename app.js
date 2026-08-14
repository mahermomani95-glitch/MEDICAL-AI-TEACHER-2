import question from "./data/sample-question.json" with { type: "json" };
import { buildScenes } from "./data/scene-engine.js";

const q = question;
const scenes = buildScenes(q);
let currentScene = 0;

function renderQuestion() {
  const questionEl = document.querySelector("#question");
  const arabicEl = document.querySelector("#arabic");
  const optionsEl = document.querySelector("#options");

  if (!questionEl || !arabicEl || !optionsEl) return;

  questionEl.textContent = q.question;
  arabicEl.textContent = q.arabic;
  optionsEl.replaceChildren();

  q.options.forEach((item) => {
    const option = document.createElement("div");
    option.className = "option";
    option.classList.toggle("correct", item.letter === q.source_indicated_answer);

    const letter = document.createElement("span");
    letter.className = "letter";
    letter.dir = "ltr";
    letter.textContent = `${item.letter}.`;

    const text = document.createElement("span");
    text.className = "option-text";
    text.dir = "ltr";
    text.textContent = item.text;

    option.append(letter, text);

    if (item.letter === q.source_indicated_answer) {
      const check = document.createElement("span");
      check.className = "option-check";
      check.textContent = "✓";
      option.appendChild(check);
    }

    optionsEl.appendChild(option);
  });
}

function renderDialogue(dialogue) {
  const container = document.createElement("div");
  container.className = "dialogue-list";

  let currentBlock;
  let currentSpeaker;

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
      line.className = part.type === "ar" ? "arabic-line" : "english-line";
      line.dir = part.type === "ar" ? "rtl" : "ltr";
      line.lang = part.type === "ar" ? "ar" : "en";
      line.textContent = part.text;
      currentBlock.appendChild(line);
    });
  });

  return container;
}

function renderScene() {
  const scene = scenes[currentScene];
  const label = document.querySelector("#sceneLabel");
  const visual = document.querySelector("#visual");
  const dialogue = document.querySelector("#dialogue");
  const next = document.querySelector("#next");

  if (!scene || !label || !visual || !dialogue || !next) return;

  label.textContent = scene.label;
  visual.innerHTML = scene.visual;
  dialogue.replaceChildren(renderDialogue(scene.dialogue));
  next.textContent = currentScene === scenes.length - 1
    ? "Restart teaching →"
    : "Next teaching scene →";
}

document.querySelector("#next")?.addEventListener("click", () => {
  currentScene = currentScene >= scenes.length - 1 ? 0 : currentScene + 1;
  renderScene();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderQuestion();
renderScene();
