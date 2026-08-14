import questions from "./data/question-bank.json" with { type: "json" };
import { buildScenes } from "./data/scene-engine.js";

let currentQuestionIndex = 0;
let currentScene = 0;
let q = questions[currentQuestionIndex];
let scenes = buildScenes(q);

const $ = (selector) => document.querySelector(selector);

function renderQuestionList() {
  const select = $("#questionSelect");
  if (!select) return;
  select.innerHTML = "";
  questions.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${index + 1}. ${item.id || item.question}`;
    select.appendChild(option);
  });
  select.value = String(currentQuestionIndex);
}

function renderQuestion() {
  $("#question").textContent = q.question;
  $("#arabic").textContent = q.arabic;
  const optionsEl = $("#options");
  optionsEl.innerHTML = "";

  q.options.forEach((item) => {
    const option = document.createElement("div");
    option.className = `option${item.letter === q.source_indicated_answer ? " correct" : ""}`;

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
  let currentBlock = null;
  let currentSpeaker = null;

  dialogue.forEach((item) => {
    if (item.name !== currentSpeaker) {
      currentSpeaker = item.name;
      currentBlock = document.createElement("div");
      currentBlock.className = "dialogue-block";
      const speaker = document.createElement("div");
      speaker.className = "speaker-name";
      speaker.dir = "ltr";
      speaker.textContent = `${item.name}:`;
      currentBlock.appendChild(speaker);
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
  $("#sceneLabel").textContent = scene.label;
  $("#visual").innerHTML = scene.visual;
  const dialogue = $("#dialogue");
  dialogue.innerHTML = "";
  dialogue.appendChild(renderDialogue(scene.dialogue));
  $("#next").textContent = currentScene === scenes.length - 1 ? "Restart teaching →" : "Next teaching scene →";
  $("#sceneProgress").textContent = `Scene ${currentScene + 1} / ${scenes.length}`;
}

function selectQuestion(index) {
  const nextIndex = Number(index);
  if (!Number.isInteger(nextIndex) || !questions[nextIndex]) return;
  currentQuestionIndex = nextIndex;
  q = questions[currentQuestionIndex];
  scenes = buildScenes(q);
  currentScene = 0;
  renderQuestion();
  renderScene();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

$("#questionSelect")?.addEventListener("change", (event) => selectQuestion(event.target.value));
$("#next")?.addEventListener("click", () => {
  currentScene = currentScene >= scenes.length - 1 ? 0 : currentScene + 1;
  renderScene();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderQuestionList();
renderQuestion();
renderScene();
